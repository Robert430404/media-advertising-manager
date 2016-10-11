class ViewWorksheets {
    constructor() {
        this.persisAction();

        this.Worksheets = new WorksheetsController();
    }

    persisAction() {
        var object = this;

        $('.update-week-information').click(function () {
            var id = $(this).attr('data-worksheet');
            var response = object.Worksheets.persistWorksheetWeekInformation(id);

            if(response) {
                response.then(function (resp) {
                    if(resp.success == true) {
                        console.log('success');
                    }
                    else {
                        console.log('failure');
                    }
                });
            }
        });
    }
}