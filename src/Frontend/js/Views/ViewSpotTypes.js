/**
 * ViewSpotTypes Class
 *
 * Contains all logic that interacts with spot types in the view
 */
class ViewSpotTypes {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.AjaxHelpers     = new AjaxHelpers();
        this.ActionHelpers   = new ActionHelpers();
        this.SpotTypeOverlay = document.querySelector('.spot-types-overlay');

        if (this.SpotTypeOverlay) {
            this.createSpotTypeFromDashboard();
        }
    }

    /**
     * Brings the create spot type form into view and persists the new
     * spot type on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     *
     * @return void
     */
    createSpotTypeFromDashboard() {
        const overlay  = document.querySelector('.spot-types-overlay'),
              button   = document.querySelector('.dash-create-spot-types-button'),
              close    = overlay.querySelector('.close'),
              form     = overlay.querySelector('form'),
              endpoint = '/api/v1/spot-types/new';

        this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
    }
}