/**
 * ViewRegions Class
 *
 * Contains all logic that interacts with regions in the view
 */
class ViewRegions {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.AjaxHelpers   = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
        this.RegionOverlay = document.querySelector('.regions-overlay');

        if (this.RegionOverlay) {
            this.dashboardCreateRegion()
        }
    }

    /**
     * Brings the create region form into view and persists the new
     * region on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     *
     * @return void
     */
    dashboardCreateRegion() {
        const overlay  = document.querySelector('.regions-overlay'),
              button   = document.querySelector('.dash-create-regions-button'),
              close    = overlay.querySelector('.close'),
              form     = overlay.querySelector('form'),
              endpoint = '/api/v1/regions/new';

        this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
    }
}