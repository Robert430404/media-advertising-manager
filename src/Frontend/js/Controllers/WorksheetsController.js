/**
 * WorksheetsController Class
 *
 * Contains logic that deals with worksheet data persistence
 */
class WorksheetsController {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.AjaxHelpers = new AjaxHelpers();
    }

    /**
     * Persists this data into the database
     *
     * @param id
     * @returns {*}
     */
    persistWorksheetWeekInformation(id) {
        var form     = document.querySelector('.worksheet-counts-' + id);
        var data     = AjaxHelpers.serialize(form);
        var endpoint = '/api/v1/worksheet/' + id + '/update';

        if(data == '')
        {
            return false;
        }

        return this.AjaxHelpers.postCall(endpoint, data);
    }
}