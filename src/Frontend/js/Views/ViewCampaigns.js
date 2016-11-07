class ViewCampaigns {
    constructor() {
        this.setCampaignRegions();
        this.setFlightFieldFormats();
        this.setFlightWeeks();
        this.setInnerOverflow();
        this.setSpotTotals();
        this.dashboardCreateCampaign();
        this.campaignEditGetRegions();

        this.CampaignsController = new CampaignsController();
    }

    setCampaignRegions() {
        var object = this;
        var target = document.querySelector('#campaign-organization');
        var container = $('#campaign-region');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.empty();

                if (value == '') {
                    container.append('<option value="">Select Organization</option>');
                }
                else {
                    object.CampaignsController.loadCampaignRegions(value).then(function (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                    });
                }
            }
        }
    }

    setFlightFieldFormats() {
        $('.flight-start').formatter({
            'pattern': '{{9999}}-{{99}}-{{99}}',
            'persist': true
        });
        $('.flight-end').formatter({
            'pattern': '{{9999}}-{{99}}-{{99}}',
            'persist': true
        });
    }

    setFlightWeeks() {
        var object = this;
        var start = document.querySelector('#flight-start');
        var end = document.querySelector('#flight-end');
        var display = document.querySelector('#flight-length');

        if (start !== null) {
            start.onkeyup = function () {
                var startVal = start.value;
                var endVal = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    var diff = object.CampaignsController.calculateFlightLength(startVal, endVal);

                    display.value = diff;
                }
            };
        }

        if (end !== null) {
            end.onkeyup = function () {
                var startVal = start.value;
                var endVal = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    var diff = object.CampaignsController.calculateFlightLength(startVal, endVal);

                    display.value = diff + ' Weeks';
                }
            };
        }
    }

    setInnerOverflow() {
        var container = $('.info-inner');

        container.each(function () {
            var dates = $(this).find('.spot-column');
            var colWidth = dates.outerWidth();
            var dateCount = dates.length;

            $(this).find('.scrollable').css({
                'min-width': colWidth * dateCount + 'px',
            });
        });
    }

    setSpotTotals() {
        var object    = this;
        var container = document.querySelector('.info-inner');
        var inputs    = container.querySelectorAll('input.date-count');
        var columns   = container.querySelectorAll('.spot-column');

        for (var i = 0; i < inputs.length; i++) {
            object.setWeekTotals(container, columns, inputs[i].dataset.program);

            inputs[i].onkeyup = function () {
                object.setWeekTotals(container, columns, this.dataset.program);
            }
        }
    }

    setWeekTotals(container, columns, programId) {
        for (var c = 0; c < columns.length; c++) {
            var inputs = columns[c].querySelectorAll('input');
            var sum = 0;

            for (var i = 0; i < inputs.length; i++) {
                sum = Number(inputs[i].value) + Number(sum);
            }

            if (columns[c].querySelector('.week-total .total')) {
                columns[c].querySelector('.week-total .total').innerHTML = sum;
            }
        }

        this.setBuyTotals(container, programId);
    }

    setBuyTotals(container, programId) {
        var allInputs = container.querySelectorAll('input.date-count');
        var sectionedInputs = [];
        var count = 0;

        for (var a = 0; a < allInputs.length; a++) {
            if (allInputs[a].dataset.program == programId) {
                sectionedInputs.push(allInputs[a]);
            }
        }

        for (var b = 0; b < sectionedInputs.length; b++) {
            count = Number(sectionedInputs[b].value) + Number(count);
        }

        document.querySelector('.spot-date-total .program-' + programId + '-total').innerHTML = count;
    }

    dashboardCreateCampaign() {
        var object = this;
        var overlay = $('.campaigns-overlay');
        var button = $('.dash-create-campaign-button');
        var close = $('.campaigns-overlay .close');
        var form = $('.campaigns-overlay form');

        button.click(function () {
            overlay.fadeIn();
        });

        close.click(function () {
            overlay.fadeOut();
        });

        form.submit(function (e) {
            e.preventDefault();

            var data = $(this).serialize();

            object.CampaignsController.createNewCampaign(data).then(function (resp) {
                if (resp.success == true) {
                    form[0].reset();
                    form.addClass('successful');

                    setTimeout(function () {
                        form.removeClass('successful');
                    }, 1000);
                } else {
                    form.addClass('failure');

                    setTimeout(function () {
                        form.removeClass('failure');
                    }, 1000);
                }
            });
        });
    }

    campaignEditGetRegions() {
        var campaignsController = new CampaignsController();
        var target = document.querySelector('.campaign-edit');

        if (target !== null) {
            var selector = document.querySelector('#campaign-organization');
            var container = $('#campaign-region');
            var value = selector.value;

            container.empty();

            if (value == '') {
                container.append('<option value="">Select Organization</option>');
            }
            else {
                container.append('<option value="">Select Region</option>');
                campaignsController.loadCampaignRegions(value).then(function (resp) {
                    for (var i = 0; i < resp.length; i++) {
                        if (value == resp[i].id) {
                            container.append('<option value="' + resp[i].id + '" selected="selected">' + resp[i].name + '</option>');
                        }
                        else {
                            container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                    }
                });
            }
        }
    }
}