/**
 * CampaignsController Class
 *
 * Contains the data retrieval for the campaigns view
 */
class CampaignsController {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.AjaxHelpers = new AjaxHelpers();
    }

    /**
     * Loads all regions for a provided campaign through AJAX GET call
     *
     * @param organization
     * @returns {Promise}
     */
    loadRegionsFromOrganization(organization) {
        const endpoint = '/api/v1/regions/' + organization;

        return this.AjaxHelpers.getCall(endpoint);
    }

    /**
     * Loads all campaigns for a provided region through AJAX GET call
     *
     * @param region
     * @returns {Promise}
     */
    loadCampaignsFromRegion(region) {
        const endpoint = '/api/v1/campaigns/' + region;

        return this.AjaxHelpers.getCall(endpoint);
    }

    /**
     * Creates a new campaign through AJAX POST call
     *
     * @param data
     * @returns {Promise}
     */
    createNewCampaign(data) {
        const endpoint = '/api/v1/campaigns/new';

        return this.AjaxHelpers.postCall(endpoint, data);
    }

    /**
     * Returns the the difference in weeks between two dates, in this
     * case it is used to calculate the total flight length of a
     * campaign
     *
     * @param start
     * @param end
     * @returns {*}
     */
    static calculateFlightLengthInWeeks(start, end) {
        const startDate = moment(start, "YYYY-MM-DD"),
              endDate   = moment(end, "YYYY-MM-DD"),
              duration  = moment.duration(endDate.diff(startDate)),
              weeks     = duration.asWeeks().toFixed(0);

        if (weeks < 0 || weeks == 0) {
            return 'Invalid Dates';
        }

        return weeks;
    }
}