/**
 * ViewWorksheets Class
 *
 * Contains all logic that interacts with worksheets in the view
 */
class ViewWorksheets {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.Worksheets = new WorksheetsController();

        this.persistWeekInformationForWorksheet();
        this.toggleProgramDetails();

        ViewWorksheets.setInnerOverflow();

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
     *
     * @return void
     */
    persistWeekInformationForWorksheet() {
        const object  = this,
              buttons = document.querySelectorAll('.update-week-information');

        buttons.forEach( function (button) {
            button.onclick = function (clicked) {
                clicked.preventDefault();

                const id          = button.dataset.worksheet,
                      worksheet   = button.parentNode.parentNode,
                      wsClasses   = worksheet.classList,
                      infoRequest = object.Worksheets.persistWorksheetWeekInformation(id);

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
     *
     * @return void
     */
    static setInnerOverflow() {
        const containers = document.querySelectorAll('.info-inner');

        containers.forEach( function (container) {
            const dates     = container.querySelectorAll('.spot-column'),
                  colWidth  = dates[0].offsetWidth,
                  dateCount = dates.length;

            container.querySelector('.scrollable').style.width = (colWidth * dateCount) + 'px';
        });
    }

    /**
     * Sets the spot total for each program (row) of the buy
     *
     * @return void
     */
    createTotalCalculations() {
        const object     = this,
              containers = document.querySelectorAll('.info-inner');

        containers.forEach( function (container) {
            const inputs  = container.querySelectorAll('input.date-count'),
                  columns = container.querySelectorAll('.spot-column');

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
     * @return void
     */
    setWeeklyTotals(container, columns, programId) {
        columns.forEach( function (column) {
            const inputs = column.querySelectorAll('input');
            let sum      = 0;

            inputs.forEach( function (input) {
                sum = Number(input.value) + Number(sum);
            });

            if (column.querySelector('.week-total .total')) {
                column.querySelector('.week-total .total').innerHTML = sum;
            }
        });

        ViewWorksheets.setWholeBuyTotals(container, programId);
    }

    /**
     * Sets the totals for the entire program (row)
     *
     * @param container
     * @param programId
     * @return void
     */
    static setWholeBuyTotals(container, programId) {
        const allInputs     = container.querySelectorAll('input.date-count');
        let sectionedInputs = [];
        let count           = 0;

        allInputs.forEach( function (input) {
            if (input.dataset.program == programId) {
                sectionedInputs.push(input);
            }
        });

        sectionedInputs.forEach( function (input) {
            count = Number(input.value) + Number(count);
        });

        document.querySelector('.spot-date-total .program-' + programId + '-total').innerHTML = count.toString();
    }

    /**
     * Toggles the display of the program details
     *
     * @return void
     */
    toggleProgramDetails() {
        const expanders = document.querySelectorAll('.extra-detail-expander');

        expanders.forEach( function (expander) {
            expander.onclick = function () {
                const classList = expander.classList,
                      wrapper   = expander.parentNode.querySelector('.detail-wrapper'),
                      wrapStyle = wrapper.style.display;

                classList.toggle('rotated');
                wrapper.style.display = wrapStyle === 'block' ? '' : 'block';
            }
        });
    }
}