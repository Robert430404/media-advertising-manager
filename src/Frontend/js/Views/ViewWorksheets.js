/**
 * ViewWorksheets Class
 *
 * Contains all logic that interacts with worksheets in the view
 */
class ViewWorksheets {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.Worksheets = new WorksheetsController();

        this.persistWeekInformationForWorksheet();
        this.toggleProgramDetails();
        this.setInnerOverflow();

        if (document.querySelector('.info-inner')) {
            this.createTotalCalculations();
        }
    }

    /**
     * This action persists the week information to the database and
     * provides visual feedback to the user
     *
     * Makes an AJAX call to the /api/v1/worksheet/' + id + '/update
     * endpoint to persist the data
     */
    persistWeekInformationForWorksheet() {
        var object  = this;
        var buttons = document.querySelectorAll('.update-week-information');

        buttons.forEach( function (button) {
            button.onclick = function (clicked) {
                clicked.preventDefault();

                var id          = button.dataset.worksheet;
                var worksheet   = button.parentNode.parentNode;
                var wsClasses   = worksheet.classList;
                var infoRequest = object.Worksheets.persistWorksheetWeekInformation(id);

                wsClasses.toggle('loading');

                infoRequest.then( function (resp) {
                    setTimeout(function () {
                        wsClasses.toggle('loading');

                        if (resp.success == true) {
                            wsClasses.toggle('success');

                            setTimeout(function () {
                                wsClasses.toggle('success');
                            }, 700);
                        }
                        else {
                            wsClasses.toggle('failure');

                            setTimeout(function () {
                                wsClasses.toggle('failure');
                            }, 700);
                        }
                    }, 100);
                });
            }
        });
    }

    /**
     * Sets the inner overflow of the horizontal scrolling section of the
     * week information interface so you can scroll through all of the
     * dates inside of the flight run to enter spot counts
     */
    setInnerOverflow() {
        var containers = document.querySelectorAll('.info-inner');

        containers.forEach( function (container) {
            var dates     = container.querySelectorAll('.spot-column');
            var colWidth  = dates[0].offsetWidth;
            var dateCount = dates.length;

            container.querySelector('.scrollable').style.width = (colWidth * dateCount) + 'px';
        });
    }

    /**
     * Sets the spot total for each program (row) of the buy
     */
    createTotalCalculations() {
        var object     = this;
        var containers = document.querySelectorAll('.info-inner');

        containers.forEach( function (container) {
            var inputs  = container.querySelectorAll('input.date-count');
            var columns = container.querySelectorAll('.spot-column');

            inputs.forEach( function (input) {
                object.setWeeklyTotals(container, columns, input.dataset.program);

                input.onkeyup = function () {
                    object.setWeeklyTotals(container, columns, this.dataset.program);
                }
            });
        });
    }

    /**
     * Sets the weekly totals for the buy
     *
     * @param container
     * @param columns
     * @param programId
     */
    setWeeklyTotals(container, columns, programId) {
        columns.forEach( function (column) {
            var inputs = column.querySelectorAll('input');
            var sum    = 0;

            inputs.forEach( function (input) {
                sum = Number(input.value) + Number(sum);
            });

            if (column.querySelector('.week-total .total')) {
                column.querySelector('.week-total .total').innerHTML = sum;
            }
        });

        this.setWholeBuyTotals(container, programId);
    }

    /**
     * Sets the totals for the entire program (row)
     *
     * @param container
     * @param programId
     */
    setWholeBuyTotals(container, programId) {
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

    /**
     * Toggles the display of the program details
     */
    toggleProgramDetails() {
        var expanders = document.querySelectorAll('.extra-detail-expander');

        expanders.forEach( function (expander) {
            expander.onclick = function () {
                var classList = expander.classList;
                var wrapper   = expander.parentNode.querySelector('.detail-wrapper');
                var wrapStyle = wrapper.style.display;

                classList.toggle('rotated');
                wrapper.style.display = wrapStyle === 'block' ? '' : 'block';
            }
        });
    }
}