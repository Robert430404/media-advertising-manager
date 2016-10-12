class ViewCampaigns {
    constructor() {
        this.setCampaignRegions();
        this.setFlightFieldFormats();
        this.setFlightWeeks();
        this.setInnerOverflow();
        this.setSpotTotals();

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
        var object = this;
        var container = $('.info-inner');
        var inputs = container.find('input.date-count');
        var columns = container.find('.spot-column');
        var count = 0;
        var weekCount = 0;

        inputs.each(function () {
            var program = $(this).attr('data-program');

            object.setBuyTotals(container, 0, columns, program);

            $(this).keyup(function () {
                object.setBuyTotals(container, 0, columns, program);
            });
        });
    }

    setBuyTotals(container, count, columns, program) {
        var sectionedInputs = container.find('input.date-count[data-program=' + program + ']');
        count = 0;

        sectionedInputs.each(function () {
            count = Number($(this).val()) + Number(count);
        });

        columns.each(function () {
            var inputs = $(this).find('input');
            var sum = 0;

            inputs.each(function () {
                var value = $(this).val();
                sum = Number(value) + Number(sum);
            });

            $(this).find('.week-total .total').empty().append(sum);
        });

        $('.spot-date-total .program-' + program + '-total').empty().append(count);
    }
}