class WorksheetsController {
    constructor() {
        this.AjaxHelpers = new AjaxHelpers();
    }

    persistWorksheetWeekInformation(id) {
        var form     = $('.worksheet-counts-' + id);
        var data     = form.serialize();
        var endpoint = '/api/v1/worksheet/' + id + '/update';

        if(data == '')
        {
            return false;
        }

        return this.AjaxHelpers.postCall(endpoint, data);
    }
}