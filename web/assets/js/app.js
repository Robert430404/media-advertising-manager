'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Waits for DOM content to be fully loaded and ready, and then
 * instantiates instances of all view objects so events can
 * be initialized
 */
document.addEventListener('DOMContentLoaded', function () {
    new View();
    new ViewOrganizations();
    new ViewCampaigns();
    new ViewNavigation();
    new ViewWorksheets();
    new ViewSpotTypes();
    new ViewRegions();
    new ViewInvoices();
}, false);
/**
 * CampaignsController Class
 *
 * Contains the data retrieval for the campaigns view
 */

var CampaignsController = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function CampaignsController() {
        _classCallCheck(this, CampaignsController);

        this.AjaxHelpers = new AjaxHelpers();
    }

    /**
     * Loads all regions for a provided campaign through AJAX GET call
     *
     * @param organization
     * @returns {Promise}
     */


    _createClass(CampaignsController, [{
        key: 'loadRegionsFromOrganization',
        value: function loadRegionsFromOrganization(organization) {
            var endpoint = '/api/v1/regions/' + organization;

            return this.AjaxHelpers.getCall(endpoint);
        }

        /**
         * Loads all campaigns for a provided region through AJAX GET call
         *
         * @param region
         * @returns {Promise}
         */

    }, {
        key: 'loadCampaignsFromRegion',
        value: function loadCampaignsFromRegion(region) {
            var endpoint = '/api/v1/campaigns/' + region;

            return this.AjaxHelpers.getCall(endpoint);
        }

        /**
         * Creates a new campaign through AJAX POST call
         *
         * @param data
         * @returns {Promise}
         */

    }, {
        key: 'createNewCampaign',
        value: function createNewCampaign(data) {
            var endpoint = '/api/v1/campaigns/new';

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

    }, {
        key: 'calculateFlightLengthInWeeks',
        value: function calculateFlightLengthInWeeks(start, end) {
            var startDate = moment(start, "YYYY-MM-DD");
            var endDate = moment(end, "YYYY-MM-DD");
            var duration = moment.duration(endDate.diff(startDate));
            var weeks = duration.asWeeks().toFixed(0);

            if (weeks < 0 || weeks == 0) {
                return 'Invalid Dates';
            }

            return weeks;
        }
    }]);

    return CampaignsController;
}();

/**
 * WorksheetsController Class
 *
 * Contains logic that deals with worksheet data persistence
 */


var WorksheetsController = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function WorksheetsController() {
        _classCallCheck(this, WorksheetsController);

        this.AjaxHelpers = new AjaxHelpers();
    }

    /**
     * Persists this data into the database
     *
     * @param id
     * @returns {*}
     */


    _createClass(WorksheetsController, [{
        key: 'persistWorksheetWeekInformation',
        value: function persistWorksheetWeekInformation(id) {
            var form = document.querySelector('.worksheet-counts-' + id);
            var data = this.AjaxHelpers.serialize(form);
            var endpoint = '/api/v1/worksheet/' + id + '/update';

            if (data == '') {
                return false;
            }

            return this.AjaxHelpers.postCall(endpoint, data);
        }
    }]);

    return WorksheetsController;
}();
/**
 * View Class
 *
 * This is the "global" view class that contains initializations for
 * "global" view actions, like confirmation's and other messages
 */


var View = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function View() {
        _classCallCheck(this, View);

        this.ActionHelpers = new ActionHelpers();

        this.registerDeleteConfirmation();
    }

    /**
     * Registers a delete confirmation
     */


    _createClass(View, [{
        key: 'registerDeleteConfirmation',
        value: function registerDeleteConfirmation() {
            this.ActionHelpers.confirmAction('a.delete-button', 'Do you really want to delete this?');
        }
    }]);

    return View;
}();
/**
 * ViewCampaigns Class
 *
 * Contains all logic that interacts with campaigns in the view
 */


var ViewCampaigns = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewCampaigns() {
        _classCallCheck(this, ViewCampaigns);

        this.CampaignsController = new CampaignsController();
        this.CampOverlay = document.querySelector('.campaigns-overlay');

        this.loadRegionsFromOrganizationForCampaign();
        this.loadRegionsForCampaignEdit();
        this.setFlightFieldFormats();
        this.setFlightWeeks();

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
     */


    _createClass(ViewCampaigns, [{
        key: 'loadRegionsFromOrganizationForCampaign',
        value: function loadRegionsFromOrganizationForCampaign() {
            var object = this;
            var target = document.querySelector('#campaign-organization');
            var container = document.querySelector('#campaign-region');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.innerHTML = '<option value="">Select Organization</option>';

                    if (value !== '') {
                        container.innerHTML = '';

                        object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                            container.innerHTML = container.innerHTML + '<option value="">Select A Region</option>';

                            regions.forEach(function (region) {
                                container.innerHTML = container.innerHTML + '<option value="' + region.id + '">' + region.name + '</option>';
                            });
                        });
                    }
                };
            }
        }

        /**
         * Enforces the date format on the flight date fields
         *
         * Depends on formatter.js
         */

    }, {
        key: 'setFlightFieldFormats',
        value: function setFlightFieldFormats() {
            var flightStart = document.querySelector('.flight-start');
            var flightEnd = document.querySelector('.flight-end');

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
         */

    }, {
        key: 'setFlightWeeks',
        value: function setFlightWeeks() {
            var object = this;
            var start = document.querySelector('#flight-start');
            var end = document.querySelector('#flight-end');
            var display = document.querySelector('#flight-length');

            if (start) {
                start.onkeyup = function () {
                    var startVal = start.value;
                    var endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        display.value = object.CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) + ' Weeks';
                    }
                };
            }

            if (end) {
                end.onkeyup = function () {
                    var startVal = start.value;
                    var endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        display.value = object.CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) + ' Weeks';
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
         */

    }, {
        key: 'createCampaignFromDashboard',
        value: function createCampaignFromDashboard() {
            var object = this;
            var overlay = document.querySelector('.campaigns-overlay');
            var button = document.querySelector('.dash-create-campaign-button');
            var close = overlay.querySelector('.close');
            var form = overlay.querySelector('form');

            button.onclick = function () {
                overlay.style.display = 'block';
            };

            close.onclick = function () {
                overlay.style.display = 'none';
            };

            form.onsubmit = function (submitted) {
                submitted.preventDefault();

                var data = object.AjaxHelpers.serialize(form);

                object.CampaignsController.createNewCampaign(data).then(function (resp) {
                    var formClasses = form.classList;

                    if (resp.success == true) {
                        form.reset();
                        formClasses.add('successful');

                        setTimeout(function () {
                            formClasses.remove('successful');
                        }, 1000);
                    } else {
                        formClasses.add('failure');

                        setTimeout(function () {
                            formClasses.remove('failure');
                        }, 1000);
                    }
                });
            };
        }

        /**
         * Loads the regions for the selected organization as you're editing
         * the campaign
         *
         * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
         * the data
         */

    }, {
        key: 'loadRegionsForCampaignEdit',
        value: function loadRegionsForCampaignEdit() {
            var object = this;
            var target = document.querySelector('.campaign-edit');

            if (target !== null) {
                var selector = document.querySelector('#campaign-organization');
                var container = document.querySelector('#campaign-region');
                var value = selector.value;

                container.innerHTML = '<option value="">Select Organization</option>';

                if (value !== '') {
                    container.innerHTML = container.innerHTML + '<option value="">Select Region</option>';

                    object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                        regions.forEach(function (region) {
                            if (value == region.id) {
                                container.innerHTML = container.innerHTML + '<option value="' + region.id + '" selected="selected">' + region.name + '</option>';
                            } else {
                                container.innerHTML = container.innerHTML + '<option value="' + region.id + '">' + region.name + '</option>';
                            }
                        });
                    });
                }
            }
        }
    }]);

    return ViewCampaigns;
}();
/**
 * ViewInvoices Class
 *
 * Contains all logic that interacts with invoices in the view
 */


var ViewInvoices = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewInvoices() {
        _classCallCheck(this, ViewInvoices);

        this.setRegionForInvoiceImporter();
        this.setInvoiceCampaigns();
        // this.addMoreInvoices();

        this.CampaignsController = new CampaignsController();
    }

    /**
     * Sets the region for the invoice importer after you've selected your
     * organization, loads the regions using the campaigns controller
     */


    _createClass(ViewInvoices, [{
        key: 'setRegionForInvoiceImporter',
        value: function setRegionForInvoiceImporter() {
            var object = this;
            var target = document.querySelector('#organizations');
            var container = document.querySelector('#regions');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.innerHTML = '<option value="">Select Organization</option>';

                    if (value !== '') {
                        object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                            container.innerHTML = '<option value="">Select Region</option>';

                            regions.forEach(function (region) {
                                container.innerHTML = container.innerHTML + '<option value="' + region.id + '">' + region.name + '</option>';
                            });

                            if (regions.length == 0) {
                                container.innerHTML = container.innerHTML + '<option value="">No Available Regions</option>';
                            }
                        });
                    }
                };
            }
        }

        /**
         * Sets the campaigns for the invoice importer after you've selected your
         * region, loads the campaigns using the campaigns controller
         */

    }, {
        key: 'setInvoiceCampaigns',
        value: function setInvoiceCampaigns() {
            var object = this;
            var target = document.querySelector('#regions');
            var container = document.querySelector('#campaigns');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.innerHTML = '<option value="">Select Region</option>';

                    if (value !== '') {
                        object.CampaignsController.loadCampaignsFromRegion(value).then(function (campaigns) {
                            container.innerHTML = '<option value="">Select Campaign</option>';

                            campaigns.forEach(function (campaign) {
                                container.innerHTML = container.innerHTML + '<option value="' + campaign.id + '">' + campaign.name + '</option>';
                            });

                            if (campaigns.length == 0) {
                                container.innerHTML = container.innerHTML + '<option value="">No Available Campaigns</option>';
                            }
                        });
                    }
                };
            }
        }

        /**
         * Function that allows you to add more files to the invoice processor
         * so you can process multiple invoices as once.
         *
         * Currently not in use
         */
        // addMoreInvoices() {
        //     var inputs = document.querySelectorAll('.file-inputs');
        //
        //     $('.add-more-invoices').click(function () {
        //         var lastInput = inputs.find('.columns:last-child').find('input');
        //         var currentId = lastInput.attr('data-id');
        //         var newId     = Number(currentId) + 1;
        //
        //         inputs.append('<div class="columns large-4 medium-4 small-12">' +
        //                            '<input type="file" class="form-control" name="invoices-' + newId + '" data-id="' + newId + '" />' +
        //                       '</div>');
        //     });
        // }

    }]);

    return ViewInvoices;
}();
/**
 * ViewNavigation Class
 *
 * Contains all logic that interacts with the navigation in the view
 */


var ViewNavigation = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewNavigation() {
        _classCallCheck(this, ViewNavigation);

        this.navigationToggle();
    }

    /**
     * This toggles the side menu into and out of visibility
     * when you click on the hamburger
     */


    _createClass(ViewNavigation, [{
        key: 'navigationToggle',
        value: function navigationToggle() {
            var hamburger = document.querySelector('.hamburger');

            hamburger.onclick = function () {
                var masthead = document.querySelector('.masthead');
                var classList = masthead.classList;

                classList.toggle('show');
            };
        }
    }]);

    return ViewNavigation;
}();
/**
 * ViewOrganizations Class
 *
 * Contains all logic that interacts with organizations in the view
 */


var ViewOrganizations = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewOrganizations() {
        _classCallCheck(this, ViewOrganizations);

        this.AjaxHelpers = new AjaxHelpers();
        this.OrgList = document.querySelectorAll('.organization-list li label');
        this.OrgOverlay = document.querySelector('.organizations-overlay');

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


    _createClass(ViewOrganizations, [{
        key: 'loadRegionsFromOrganizationForDashboard',
        value: function loadRegionsFromOrganizationForDashboard() {
            var object = this;
            var targets = document.querySelectorAll('.organization-list li label');
            var container = document.querySelector('.region-information');

            targets.forEach(function (target) {
                target.onclick = function () {
                    var orgId = target.dataset.id;
                    var orgName = this.dataset.name;
                    var endpoint = '/api/v1/regions/' + orgId;

                    object.AjaxHelpers.getCall(endpoint).then(function (regions) {
                        container.innerHTML = '<h1 class="content-title">' + orgName + ' Regions</h1>';
                        container.innerHTML = container.innerHTML + '<ul class="region-list"></ul>';

                        if (regions.length > 0) {
                            regions.forEach(function (region) {
                                var list = container.querySelector('.region-list');

                                list.innerHTML = list.innerHTML + '<li class="region-selector region-selector-' + region.id + '" data-id="' + region.id + '">' + region.name + '</li>';
                            });
                        } else {
                            container.innerHTML = container.innerHTML + '<p class="align-center">There Are No Regions</p>';
                        }

                        container.innerHTML = container.innerHTML + '<div class="region-campaigns"></div>';
                        object.loadCampaignsFromRegion();
                    });
                };
            });
        }

        /**
         * Loads the campaigns for a region when a region on the dashboard
         * is clicked
         *
         * Makes an AJAX call to the /api/v1/campaigns/ endpoint to retrieve
         * the data
         */

    }, {
        key: 'loadCampaignsFromRegion',
        value: function loadCampaignsFromRegion() {
            var object = this;
            var regions = document.querySelectorAll('.region-selector');

            regions.forEach(function (region) {
                region.onclick = function () {
                    var id = region.dataset.id;
                    var endpoint = '/api/v1/campaigns/' + id;
                    var container = document.querySelector('.region-campaigns');
                    var regionName = region.innerHTML;

                    object.AjaxHelpers.getCall(endpoint).then(function (campaigns) {
                        container.innerHTML = '<p class="align-center">There Are No Campaigns For This Region</p>';

                        if (campaigns.length > 0) {
                            container.innerHTML = '<h1 class="campaigns-title">' + regionName + ' Campaigns</h1>';
                            container.innerHTML = container.innerHTML + '<ul class="campaign-list"></ul>';

                            campaigns.forEach(function (campaign) {
                                var list = container.querySelector('.campaign-list');

                                list.innerHTML = list.innerHTML + '<li class="campaign-selector campaign-selector-' + campaign.id + '" data-id="' + campaign.id + '">' + campaign.name + '</li>';

                                var button = list.querySelector('.campaign-selector-' + campaign.id);

                                button.innerHTML = button.innerHTML + '<div class="actions">' + '<a href="/campaigns/worksheets/' + campaign.id + '">Worksheets</a>' + '<a href="/reports/station-order/' + campaign.id + '" target="_blank">Station Order</a>' + '</div>';
                            });
                        }
                    });
                };
            });
        }

        /**
         * Brings the create organization form into view and persists the
         * new organization on the forms submission
         *
         * Controls the modals display and sends the data off in an AJAX
         * call to get persisted into the database
         */

    }, {
        key: 'createOrganizationFromDashboard',
        value: function createOrganizationFromDashboard() {
            var object = this;
            var overlay = document.querySelector('.organizations-overlay');
            var button = document.querySelector('.dash-create-organizations-button');
            var close = overlay.querySelector('.close');
            var form = overlay.querySelector('form');
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

                        setTimeout(function () {
                            formClasses.remove('successful');
                        }, 1000);
                    } else {
                        formClasses.add('failure');

                        setTimeout(function () {
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

    }, {
        key: 'refreshOrganizations',
        value: function refreshOrganizations() {
            var object = this;
            var sidebar = document.querySelector('.sidebar .organization-list');
            var endpoint = '/api/v1/organizations';

            object.AjaxHelpers.getCall(endpoint).then(function (organizations) {
                sidebar.innerHTML = '';

                organizations.forEach(function (organization) {
                    sidebar.innerHTML = sidebar.innerHTML + '<li>' + '<label data-id="' + organization.id + '" data-name="' + organization.name + '">' + organization.name + '<i class="fa fa-chevron-right"></i>' + '</label>' + '</li>';
                });

                object.loadRegionsFromOrganizationForDashboard();
            });
        }
    }]);

    return ViewOrganizations;
}();
/**
 * ViewRegions Class
 *
 * Contains all logic that interacts with regions in the view
 */


var ViewRegions = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewRegions() {
        _classCallCheck(this, ViewRegions);

        this.AjaxHelpers = new AjaxHelpers();
        this.RegionOverlay = document.querySelector('.regions-overlay');

        if (this.RegionOverlay) {
            this.dashboardCreateRegion();
        }
    }

    /**
     * Brings the create region form into view and persists the new
     * region on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     */


    _createClass(ViewRegions, [{
        key: 'dashboardCreateRegion',
        value: function dashboardCreateRegion() {
            var object = this;
            var overlay = document.querySelector('.regions-overlay');
            var button = document.querySelector('.dash-create-regions-button');
            var close = overlay.querySelector('.close');
            var form = overlay.querySelector('form');
            var endpoint = '/api/v1/regions/new';

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

                        setTimeout(function () {
                            formClasses.remove('successful');
                        }, 1000);
                    } else {
                        formClasses.add('failure');

                        setTimeout(function () {
                            formClasses.remove('failure');
                        }, 1000);
                    }
                });
            };
        }
    }]);

    return ViewRegions;
}();
/**
 * ViewSpotTypes Class
 *
 * Contains all logic that interacts with spot types in the view
 */


var ViewSpotTypes = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewSpotTypes() {
        _classCallCheck(this, ViewSpotTypes);

        this.AjaxHelpers = new AjaxHelpers();
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
     */


    _createClass(ViewSpotTypes, [{
        key: 'createSpotTypeFromDashboard',
        value: function createSpotTypeFromDashboard() {
            var object = this;
            var overlay = document.querySelector('.spot-types-overlay');
            var button = document.querySelector('.dash-create-spot-types-button');
            var close = overlay.querySelector('.close');
            var form = overlay.querySelector('form');
            var endpoint = '/api/v1/spot-types/new';

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

                        setTimeout(function () {
                            formClasses.remove('successful');
                        }, 1000);
                    } else {
                        formClasses.add('failure');

                        setTimeout(function () {
                            formClasses.remove('failure');
                        }, 1000);
                    }
                });
            };
        }
    }]);

    return ViewSpotTypes;
}();
/**
 * ViewWorksheets Class
 *
 * Contains all logic that interacts with worksheets in the view
 */


var ViewWorksheets = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ViewWorksheets() {
        _classCallCheck(this, ViewWorksheets);

        this.Worksheets = new WorksheetsController();

        this.persistWeekInformationForWorksheet();
        this.toggleProgramDetails();
        this.setInnerOverflow();

        if (document.querySelector('.info-inner')) {
            this.createTotalCalculations();
        }
    }

    /**
     * This action persists the week information to the database and
     * provides visual feedback to the user
     *
     * Makes an AJAX call to the /api/v1/worksheet/' + id + '/update
     * endpoint to persist the data
     */


    _createClass(ViewWorksheets, [{
        key: 'persistWeekInformationForWorksheet',
        value: function persistWeekInformationForWorksheet() {
            var object = this;
            var buttons = document.querySelectorAll('.update-week-information');

            buttons.forEach(function (button) {
                button.onclick = function (clicked) {
                    clicked.preventDefault();

                    var id = button.dataset.worksheet;
                    var worksheet = button.parentNode.parentNode;
                    var wsClasses = worksheet.classList;
                    var infoRequest = object.Worksheets.persistWorksheetWeekInformation(id);

                    wsClasses.toggle('loading');

                    infoRequest.then(function (resp) {
                        setTimeout(function () {
                            wsClasses.toggle('loading');

                            if (resp.success == true) {
                                wsClasses.toggle('success');

                                setTimeout(function () {
                                    wsClasses.toggle('success');
                                }, 700);
                            } else {
                                wsClasses.toggle('failure');

                                setTimeout(function () {
                                    wsClasses.toggle('failure');
                                }, 700);
                            }
                        }, 100);
                    });
                };
            });
        }

        /**
         * Sets the inner overflow of the horizontal scrolling section of the
         * week information interface so you can scroll through all of the
         * dates inside of the flight run to enter spot counts
         */

    }, {
        key: 'setInnerOverflow',
        value: function setInnerOverflow() {
            var containers = document.querySelectorAll('.info-inner');

            containers.forEach(function (container) {
                var dates = container.querySelectorAll('.spot-column');
                var colWidth = dates[0].offsetWidth;
                var dateCount = dates.length;

                container.querySelector('.scrollable').style.width = colWidth * dateCount + 'px';
            });
        }

        /**
         * Sets the spot total for each program (row) of the buy
         */

    }, {
        key: 'createTotalCalculations',
        value: function createTotalCalculations() {
            var object = this;
            var containers = document.querySelectorAll('.info-inner');

            containers.forEach(function (container) {
                var inputs = container.querySelectorAll('input.date-count');
                var columns = container.querySelectorAll('.spot-column');

                inputs.forEach(function (input) {
                    object.setWeeklyTotals(container, columns, input.dataset.program);

                    input.onkeyup = function () {
                        object.setWeeklyTotals(container, columns, this.dataset.program);
                    };
                });
            });
        }

        /**
         * Sets the weekly totals for the buy
         *
         * @param container
         * @param columns
         * @param programId
         */

    }, {
        key: 'setWeeklyTotals',
        value: function setWeeklyTotals(container, columns, programId) {
            columns.forEach(function (column) {
                var inputs = column.querySelectorAll('input');
                var sum = 0;

                inputs.forEach(function (input) {
                    sum = Number(input.value) + Number(sum);
                });

                if (column.querySelector('.week-total .total')) {
                    column.querySelector('.week-total .total').innerHTML = sum;
                }
            });

            this.setWholeBuyTotals(container, programId);
        }

        /**
         * Sets the totals for the entire program (row)
         *
         * @param container
         * @param programId
         */

    }, {
        key: 'setWholeBuyTotals',
        value: function setWholeBuyTotals(container, programId) {
            var allInputs = container.querySelectorAll('input.date-count');
            var sectionedInputs = [];
            var count = 0;

            for (var a = 0; a < allInputs.length; a++) {
                if (allInputs[a].dataset.program == programId) {
                    sectionedInputs.push(allInputs[a]);
                }
            }

            for (var b = 0; b < sectionedInputs.length; b++) {
                count = Number(sectionedInputs[b].value) + Number(count);
            }

            document.querySelector('.spot-date-total .program-' + programId + '-total').innerHTML = count;
        }

        /**
         * Toggles the display of the program details
         */

    }, {
        key: 'toggleProgramDetails',
        value: function toggleProgramDetails() {
            var expanders = document.querySelectorAll('.extra-detail-expander');

            expanders.forEach(function (expander) {
                expander.onclick = function () {
                    var classList = expander.classList;
                    var wrapper = expander.parentNode.querySelector('.detail-wrapper');
                    var wrapStyle = wrapper.style.display;

                    classList.toggle('rotated');
                    wrapper.style.display = wrapStyle === 'block' ? '' : 'block';
                };
            });
        }
    }]);

    return ViewWorksheets;
}();
/**
 * ActionHelpers Class
 *
 * Contains all logic for functions that add additional functionality to actions
 * taken on the entities for data. (DELETE, UPDATE, EDIT, etc...)
 */


var ActionHelpers = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function ActionHelpers() {
        _classCallCheck(this, ActionHelpers);

        this.confirmAction();
    }

    /**
     * When a delete action is taken, this puts up a confirmation box
     * before the action is persisted
     *
     * @param selector
     * @param message
     */


    _createClass(ActionHelpers, [{
        key: 'confirmAction',
        value: function confirmAction(selector, message) {
            var buttons = document.querySelectorAll(selector);

            if (buttons) {
                buttons.forEach(function (button) {
                    button.onclick = function (clicked) {
                        clicked.preventDefault();

                        var link = button.href;
                        var confirmation = confirm(message);

                        if (confirmation) {
                            window.location = link;
                        }
                    };
                });
            }
        }

        /**
         * This checks the type of fields being sent and if it meets a certain
         * criteria. A boolean value is returned, use in the serialize function
         *
         * @param field
         * @returns {boolean}
         */

    }, {
        key: 'fieldTypeCheck',
        value: function fieldTypeCheck(field) {
            var type = false;

            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                type = true;
            }

            return type;
        }
    }]);

    return ActionHelpers;
}();
/**
 * AjaxHelpers Class
 *
 * Contains functions that execute and help execute AJAX calls
 */


var AjaxHelpers = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    function AjaxHelpers() {
        _classCallCheck(this, AjaxHelpers);

        this.ActionHelpers = new ActionHelpers();
    }

    /**
     * Executes a GET call and returns an ASYNC promise for use inside
     * of the requesting function
     *
     * @param url
     * @returns {Promise}
     */


    _createClass(AjaxHelpers, [{
        key: 'getCall',
        value: function getCall(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();

                request.open('GET', url);

                request.onload = function () {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.response));
                    } else {
                        reject(new Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    reject(new Error('Network Error'));
                };

                request.send();
            });
        }

        /**
         * Executes a POST call and returns an ASYNC promise for use inside
         * of the requesting function
         *
         * @param url
         * @param data
         * @returns {Promise}
         */

    }, {
        key: 'postCall',
        value: function postCall(url, data) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();

                request.open('POST', url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                request.onload = function () {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.response));
                    } else {
                        reject(new Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    reject(new Error('Network Error'));
                };

                request.send(data);
            });
        }

        /**
         * Serializes form data for use inside of the post call, works
         * similarly to the jQuery serialize function
         *
         * @param form
         * @returns {string}
         */

    }, {
        key: 'serialize',
        value: function serialize(form) {
            var field = [];
            var value = [];

            if ((typeof form === 'undefined' ? 'undefined' : _typeof(form)) == 'object' && form.nodeName == "FORM") {
                var length = form.elements.length;

                for (var i = 0; i < length; i++) {
                    field = form.elements[i];
                    var fieldCheck = this.ActionHelpers.fieldTypeCheck(field);

                    if (fieldCheck) {
                        if (field.type == 'select-multiple') {
                            var optionLength = form.elements[i].options.length - 1;

                            for (var j = optionLength; j >= 0; j--) {
                                if (field.options[j].selected) {
                                    value[value.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                                }
                            }
                        } else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
                            value[value.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                        }
                    }
                }
            }

            return value.join('&').replace(/%20/g, '+');
        }
    }]);

    return AjaxHelpers;
}();