/**
 * ViewCampaigns Class
 *
 * Contains all logic that interacts with campaigns in the view
 */
class ViewCampaigns {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.AjaxHelpers         = new AjaxHelpers();
        this.ActionHelpers       = new ActionHelpers();
        this.CampaignsController = new CampaignsController();
        this.DomHelpers          = new DomHelpers();
        this.CampOverlay         = document.querySelector('.campaigns-overlay');

        this.loadRegionsFromOrganizationForCampaign();
        this.loadRegionsForCampaignEdit();
        this.setFlightWeeks();

        ViewCampaigns.setFlightFieldFormats();

        if (this.CampOverlay) {
            this.createCampaignFromDashboard();
        }
    }

    /**
     * Loads the regions for the dropdown when you're creating a campaign
     * on the campaigns page
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     *
     * @return void
     */
    loadRegionsFromOrganizationForCampaign() {
        const object    = this,
              target    = document.querySelector('#campaign-organization'),
              container = document.querySelector('#campaign-region');

        if (target) {
            target.onchange = function () {
                const dropDown = object.DomHelpers.setContainer(container),
                      value    = this.value;

                dropDown.replace(`<option value="">Select Organization</option>`);

                if (value !== '') {
                    dropDown.clear();

                    object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                        dropDown.append(`<option value="">Select A Region</option>`);

                        regions.forEach( function (region) {
                            dropDown.append(`<option value="${region.id}">${region.name}</option>`);
                        });
                    });
                }
            }
        }
    }

    /**
     * Enforces the date format on the flight date fields
     *
     * Depends on formatter.js
     *
     * @return void
     */
    static setFlightFieldFormats() {
        const flightStart = document.querySelector('.flight-start'),
              flightEnd   = document.querySelector('.flight-end');

        if (flightStart) {
            new Formatter(flightStart, {
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
        }

        if (flightEnd) {
            new Formatter(flightEnd, {
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
        }
    }

    /**
     * Sets the total flight length in weeks once you have your dates
     * entered into the fields
     *
     * @return void
     */
    setFlightWeeks() {
        const start   = document.querySelector('#flight-start'),
              end     = document.querySelector('#flight-end'),
              display = document.querySelector('#flight-length');

        if (start) {
            start.onkeyup = function () {
                const startVal = start.value,
                      endVal   = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    display.value = CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) +
                                    ' Weeks';
                }
            };
        }

        if (end) {
            end.onkeyup = function () {
                const startVal = start.value,
                      endVal   = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    display.value = CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) +
                                    ' Weeks';
                }
            };
        }
    }

    /**
     * Brings the create campaign form into view and persists the
     * new campaign on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     *
     * @return void
     */
    createCampaignFromDashboard() {
        const overlay  = document.querySelector('.campaigns-overlay'),
              button   = document.querySelector('.dash-create-campaign-button'),
              close    = overlay.querySelector('.close'),
              form     = overlay.querySelector('form'),
              endpoint = '/api/v1/campaigns/new';

        this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
    }

    /**
     * Loads the regions for the selected organization as you're editing
     * the campaign
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     *
     * @return void
     */
    loadRegionsForCampaignEdit() {
        const object = this,
              target = document.querySelector('.campaign-edit');

        if (target) {
            const selector  = document.querySelector('#campaign-organization'),
                  container = document.querySelector('#campaign-region'),
                  value     = selector.value,
                  dropDown  = this.DomHelpers.setContainer(container);

            dropDown.replace(`<option value="">Select Organization</option>`);

            if (value !== '') {
                dropDown.append(`<option value="">Select Region</option>`);

                object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                    regions.forEach( function (region) {
                        if (value == region.id) {
                            dropDown.append(`<option value="${region.id}" selected="selected">${region.name}</option>`);
                        }
                        else {
                            dropDown.append(`<option value="${region.id}">${region.name}</option>`);
                        }
                    });
                });
            }
        }
    }
}