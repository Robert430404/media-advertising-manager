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
        this.DomHelpers    = new DomHelpers();

        this.OrgList       = document.querySelectorAll('.organization-list li label');
        this.OrgOverlay    = document.querySelector('.organizations-overlay');
        this.OrgRefresh    = document.querySelector('.refresh-button');

        if (this.OrgList) {
            this.loadRegionsFromOrganizationForDashboard();
        }
        if (this.OrgOverlay) {
            this.createOrganizationFromDashboard();
        }
        if (this.OrgRefresh) {
            this.OrgRefresh.onclick = () => {
                this.refreshOrganizations();
            }
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
        const object     = this,
              targets    = document.querySelectorAll('.organization-list li label'),
              container  = document.querySelector('.region-information');

        targets.forEach((target) => {
            target.onclick = () => {
                const orgId      = target.dataset.id,
                      orgName    = target.dataset.name,
                      endpoint   = '/api/v1/regions/' + orgId,
                      regionInfo = object.DomHelpers.setContainer(container);

                object.AjaxHelpers.getCall(endpoint).then((regions) => {
                    regionInfo.replace(`<h1 class="content-title">${orgName} Regions</h1>`);
                    regionInfo.append(`<ul class="region-list"></ul>`);
                    regionInfo.append(`<div class="region-campaigns"></div>`);

                    if (regions.length > 0) {
                        regions.forEach((region) => {
                            const regionList = container.querySelector('.region-list'),
                                  list       = object.DomHelpers.setContainer(regionList);

                            list.append(`<li class="region-selector region-selector-${region.id}" data-id="${region.id}">
                                            ${region.name}
                                        </li>`);
                        });
                    } else {
                        regionInfo.append(`<p class="align-center">There Are No Regions</p>`);
                    }

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

        regions.forEach((region) => {
            region.onclick = () => {
                const id         = region.dataset.id,
                      endpoint   = '/api/v1/campaigns/' + id,
                      container  = document.querySelector('.region-campaigns'),
                      regionName = region.innerHTML,
                      regionCamp = object.DomHelpers.setContainer(container);

                object.AjaxHelpers.getCall(endpoint).then((campaigns) => {
                    regionCamp.replace(`<p class="align-center">There Are No Campaigns For This Region</p>`);

                    if (campaigns.length > 0) {
                        regionCamp.replace(`<h1 class="campaigns-title">${regionName} Campaigns</h1>`);
                        regionCamp.append(`<ul class="campaign-list"></ul>`);

                        const campList = container.querySelector('.campaign-list'),
                              list     = object.DomHelpers.setContainer(campList);

                        campaigns.forEach((campaign) => {
                            list.append(`<li class="campaign-selector campaign-selector-${campaign.id}" data-id="${campaign.id}">
                                            ${campaign.name}
                                            <div class="actions">
                                                <a href="/campaigns/worksheets/${campaign.id}">Worksheets</a>
                                                <a href="/reports/station-order/${campaign.id}" target="_blank">Station Order</a>
                                            </div>
                                        </li>`);
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
        const object           = this,
              container        = document.querySelector('.sidebar .organization-list'),
              organizationList = this.DomHelpers.setContainer(container),
              sidebarClasses   = container.classList,
              endpoint         = '/api/v1/organizations';

        sidebarClasses.add('loading');

        object.AjaxHelpers.getCall(endpoint).then((organizations) => {
            organizationList.clear();

            organizations.forEach((organization) => {
                organizationList.append(`<li>
                                            <label data-id="${organization.id}" data-name="${organization.name}">
                                                ${organization.name}
                                                <i class="fa fa-chevron-right"></i>
                                            </label>
                                        </li>`);
            });

            sidebarClasses.remove('loading');
            object.loadRegionsFromOrganizationForDashboard();
        });
    }
}