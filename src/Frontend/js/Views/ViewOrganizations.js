/**
 * ViewOrganizations Class
 *
 * Contains all logic that interacts with organizations in the view
 */
class ViewOrganizations {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.AjaxHelpers = new AjaxHelpers();
        this.OrgList     = document.querySelectorAll('.organization-list li label');
        this.OrgOverlay  = document.querySelector('.organizations-overlay');

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
     */
    loadRegionsFromOrganizationForDashboard() {
        var object    = this;
        var targets   = document.querySelectorAll('.organization-list li label');
        var container = document.querySelector('.region-information');

        targets.forEach( function (target) {
            target.onclick = function () {
                var orgId    = target.dataset.id;
                var orgName  = this.dataset.name;
                var endpoint = '/api/v1/regions/' + orgId;

                object.AjaxHelpers.getCall(endpoint).then( function (regions) {
                    container.innerHTML = '<h1 class="content-title">' + orgName + ' Regions</h1>';
                    container.innerHTML = container.innerHTML +
                                          '<ul class="region-list"></ul>';

                    if (regions.length > 0) {
                        regions.forEach( function (region) {
                            var list = container.querySelector('.region-list');

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
     */
    loadCampaignsFromRegion() {
        var object  = this;
        var regions = document.querySelectorAll('.region-selector');

        regions.forEach( function (region) {
            region.onclick = function () {
                var id         = region.dataset.id;
                var endpoint   = '/api/v1/campaigns/' + id;
                var container  = document.querySelector('.region-campaigns');
                var regionName = region.innerHTML;

                object.AjaxHelpers.getCall(endpoint).then( function (campaigns) {
                    container.innerHTML = '<p class="align-center">There Are No Campaigns For This Region</p>';

                    if (campaigns.length > 0) {
                        container.innerHTML = '<h1 class="campaigns-title">' + regionName + ' Campaigns</h1>';
                        container.innerHTML = container.innerHTML +
                                              '<ul class="campaign-list"></ul>';

                        campaigns.forEach( function (campaign) {
                            var list = container.querySelector('.campaign-list');

                            list.innerHTML = list.innerHTML +
                                             '<li class="campaign-selector campaign-selector-' + campaign.id + '" data-id="' + campaign.id + '">' +
                                                 campaign.name +
                                             '</li>';

                            var button = list.querySelector('.campaign-selector-' + campaign.id);

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
     */
    createOrganizationFromDashboard() {
        var object   = this;
        var overlay  = document.querySelector('.organizations-overlay');
        var button   = document.querySelector('.dash-create-organizations-button');
        var close    = overlay.querySelector('.close');
        var form     = overlay.querySelector('form');
        var endpoint = '/api/v1/organizations/new';

        button.onclick = function () {
            overlay.style.display = 'block';
        };

        close.onclick = function () {
            overlay.style.display = 'none';
        };

        form.onsubmit = function (submitted) {
            submitted.preventDefault();

            var data = object.AjaxHelpers.serialize(form);

            object.AjaxHelpers.postCall(endpoint, data).then(function (resp) {
                var formClasses = form.classList;

                if (resp.success == true) {
                    form.reset();
                    formClasses.add('successful');
                    object.refreshOrganizations();

                    setTimeout( function () {
                        formClasses.remove('successful');
                    }, 1000);
                } else {
                    formClasses.add('failure');

                    setTimeout( function () {
                        formClasses.remove('failure');
                    }, 1000);
                }
            });
        };
    }

    /**
     * Refreshes organizations after you have persisted a new organization
     * into the database
     *
     * Makes an AJAX call to /api/v1/organizations endpoint to retrieve
     * the data
     */
    refreshOrganizations() {
        var object   = this;
        var sidebar  = document.querySelector('.sidebar .organization-list');
        var endpoint = '/api/v1/organizations';

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