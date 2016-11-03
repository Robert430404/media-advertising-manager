class ViewWorksheets {
    constructor() {
        this.persisAction();
        this.expandSpotDetails();

        this.Worksheets = new WorksheetsController();
    }

    persisAction() {
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

    expandSpotDetails() {
        var object = this;

        $('.extra-detail-expander').click(function () {
            $(this).toggleClass('rotated');
            $(this).parent().find('.detail-wrapper').slideToggle();
        });
    }
}