/**
 * ViewOrganizations Class
 *
 * Contains all logic that interacts with organizations in the view
 */
class ViewOrganizations {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.AjaxHelpers   = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
        this.OrgList       = document.querySelectorAll('.organization-list li label');
        this.OrgOverlay    = document.querySelector('.organizations-overlay');

        if (this.OrgList) {
            this.loadRegionsFromOrganizationForDashboard();
        }
        if (this.OrgOverlay) {
            this.createOrganizationFromDashboard();
        }
    }

    /**
     * Loads the regions for an organization when an organization on the
     * dashboard is clicked.
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     *
     * @return void
     */
    loadRegionsFromOrganizationForDashboard() {
        const object    = this,
              targets   = document.querySelectorAll('.organization-list li label'),
              container = document.querySelector('.region-information');

        targets.forEach( function (target) {
            target.onclick = function () {
                const orgId    = target.dataset.id,
                      orgName  = this.dataset.name,
                      endpoint = '/api/v1/regions/' + orgId;

                object.AjaxHelpers.getCall(endpoint).then( function (regions) {
                    container.innerHTML = '<h1 class="content-title">' + orgName + ' Regions</h1>';
                    container.innerHTML = container.innerHTML +
                                          '<ul class="region-list"></ul>';

                    if (regions.length > 0) {
                        regions.forEach( function (region) {
                            const list = container.querySelector('.region-list');

                            list.innerHTML = list.innerHTML +
                                             '<li class="region-selector region-selector-' + region.id + '" data-id="' + region.id + '">' +
                                                 region.name +
                                             '</li>';
                        });
                    } else {
                        container.innerHTML = container.innerHTML +
                                              '<p class="align-center">There Are No Regions</p>';
                    }

                    container.innerHTML = container.innerHTML +
                                          '<div class="region-campaigns"></div>';
                    object.loadCampaignsFromRegion();
                });
            }
        });
    }

    /**
     * Loads the campaigns for a region when a region on the dashboard
     * is clicked
     *
     * Makes an AJAX call to the /api/v1/campaigns/ endpoint to retrieve
     * the data
     *
     * @return void
     */
    loadCampaignsFromRegion() {
        const object  = this,
              regions = document.querySelectorAll('.region-selector');

        regions.forEach( function (region) {
            region.onclick = function () {
                const id         = region.dataset.id,
                      endpoint   = '/api/v1/campaigns/' + id,
                      container  = document.querySelector('.region-campaigns'),
                      regionName = region.innerHTML;

                object.AjaxHelpers.getCall(endpoint).then( function (campaigns) {
                    container.innerHTML = '<p class="align-center">There Are No Campaigns For This Region</p>';

                    if (campaigns.length > 0) {
                        container.innerHTML = '<h1 class="campaigns-title">' + regionName + ' Campaigns</h1>';
                        container.innerHTML = container.innerHTML +
                                              '<ul class="campaign-list"></ul>';

                        campaigns.forEach( function (campaign) {
                            const list = container.querySelector('.campaign-list');

                            list.innerHTML = list.innerHTML +
                                             '<li class="campaign-selector campaign-selector-' + campaign.id + '" data-id="' + campaign.id + '">' +
                                                 campaign.name +
                                             '</li>';

                            const button = list.querySelector('.campaign-selector-' + campaign.id);

                            button.innerHTML = button.innerHTML +
                                               '<div class="actions">' +
                                                   '<a href="/campaigns/worksheets/' + campaign.id + '">Worksheets</a>' +
                                                   '<a href="/reports/station-order/' + campaign.id + '" target="_blank">Station Order</a>' +
                                               '</div>';
                        });
                    }
                });
            }
        });
    }

    /**
     * Brings the create organization form into view and persists the
     * new organization on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     *
     * @return void
     */
    createOrganizationFromDashboard() {
        const overlay  = document.querySelector('.organizations-overlay'),
              button   = document.querySelector('.dash-create-organizations-button'),
              close    = overlay.querySelector('.close'),
              form     = overlay.querySelector('form'),
              endpoint = '/api/v1/organizations/new';

        this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
    }

    /**
     * Refreshes organizations after you have persisted a new organization
     * into the database
     *
     * Makes an AJAX call to /api/v1/organizations endpoint to retrieve
     * the data
     *
     * @return void
     */
    refreshOrganizations() {
        const object   = this,
              sidebar  = document.querySelector('.sidebar .organization-list'),
              endpoint = '/api/v1/organizations';

        object.AjaxHelpers.getCall(endpoint).then(function (organizations) {
            sidebar.innerHTML = '';

            organizations.forEach( function (organization) {
                sidebar.innerHTML = sidebar.innerHTML +
                                    '<li>' +
                                        '<label data-id="' + organization.id + '" data-name="' + organization.name + '">' +
                                            organization.name +
                                            '<i class="fa fa-chevron-right"></i>' +
                                        '</label>' +
                                    '</li>';
            });

            object.loadRegionsFromOrganizationForDashboard();
        });
    }
}