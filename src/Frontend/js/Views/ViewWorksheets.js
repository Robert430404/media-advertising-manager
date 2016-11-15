class ViewWorksheets {
    constructor() {
        this.persistAction();
        this.expandSpotDetails();
        this.setInnerOverflow();

        if (document.querySelector('.info-inner')) {
            this.setSpotTotals();
        }

        this.Worksheets = new WorksheetsController();
    }

    persistAction() {
        var object = this;

        $('.update-week-information').click(function () {
            var button = $(this);
            var id = $(this).attr('data-worksheet');
            var response = object.Worksheets.persistWorksheetWeekInformation(id);

            button.parent().parent().toggleClass('loading');

            if(response) {
                response.then(function (resp) {
                    setTimeout(function () {
                        button.parent().parent().toggleClass('loading');

                        if(resp.success == true) {
                            button.parent().parent().toggleClass('success');

                            setTimeout(function () {
                                button.parent().parent().toggleClass('success');
                            }, 700);
                        }
                        else {
                            button.parent().parent().toggleClass('failure');

                            setTimeout(function () {
                                button.parent().parent().toggleClass('failure');
                            }, 700);
                        }
                    }, 100);
                });
            }
        });
    }

    setInnerOverflow() {
        var container = $('.info-inner');

        container.each(function () {
            var dates = $(this).find('.spot-column');
            var colWidth = dates.outerWidth();
            var dateCount = dates.length;

            $(this).find('.scrollable').css({
                'width': colWidth * dateCount + 'px',
            });
        });
    }

    setSpotTotals() {
        var object     = this;
        var containers = document.querySelectorAll('.info-inner');

        containers.forEach( function (element) {
            console.log(element);

            var inputs  = element.querySelectorAll('input.date-count');
            var columns = element.querySelectorAll('.spot-column');

            for (var b = 0; b < inputs.length; b++) {
                object.setWeekTotals(element, columns, inputs[b].dataset.program);

                inputs[b].onkeyup = function () {
                    object.setWeekTotals(element, columns, this.dataset.program);
                }
            }
        });
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

    expandSpotDetails() {
        var object = this;

        $('.extra-detail-expander').click(function () {
            $(this).toggleClass('rotated');
            $(this).parent().find('.detail-wrapper').slideToggle();
        });
    }
}