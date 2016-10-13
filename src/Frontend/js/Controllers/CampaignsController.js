class CampaignsController {
    constructor() {
        this.AjaxHelpers = new AjaxHelpers();
    }

    loadCampaignRegions(organization) {
        var endpoint = '/api/v1/regions/' + organization;

        return this.AjaxHelpers.getCall(endpoint);
    }

    createNewCampaign(data) {
        var endpoint = '/api/v1/campaigns/new';

        return this.AjaxHelpers.postCall(endpoint, data);
    }

    calculateFlightLength(start, end) {
        var startDate = moment(start, "YYYY-MM-DD");
        var endDate = moment(end, "YYYY-MM-DD");
        var duration = moment.duration(endDate.diff(startDate));
        var weeks = duration.asWeeks().toFixed(0);

        if (weeks < 0 || weeks == 0) {
            return 'Invalid Dates';
        }

        return weeks;
    }
}