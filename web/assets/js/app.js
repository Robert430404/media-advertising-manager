'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Waits for DOM content to be fully loaded and ready, and then
 * instantiates instances of all view objects so events can
 * be initialized
 *
 * @return void
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
     *
     * @return void
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

    }], [{
        key: 'calculateFlightLengthInWeeks',
        value: function calculateFlightLengthInWeeks(start, end) {
            var startDate = moment(start, "YYYY-MM-DD"),
                endDate = moment(end, "YYYY-MM-DD"),
                duration = moment.duration(endDate.diff(startDate)),
                weeks = duration.asWeeks().toFixed(0);

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
            var data = AjaxHelpers.serialize(form);
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
 * ActionHelpers Class
 *
 * Contains all logic for functions that add additional functionality to actions
 * taken on the entities for data. (DELETE, UPDATE, EDIT, etc...)
 */


var ActionHelpers = function () {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
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
     * @return void
     */


    _createClass(ActionHelpers, [{
        key: 'confirmAction',
        value: function confirmAction(selector, message) {
            var buttons = document.querySelectorAll(selector);

            if (buttons) {
                buttons.forEach(function (button) {
                    button.onclick = function (clicked) {
                        clicked.preventDefault();

                        var link = button.href,
                            confirmation = confirm(message);

                        if (confirmation) {
                            window.location = link;
                        }
                    };
                });
            }
        }

        /**
         * Toggles The Modal For The Dashboard
         *
         * @param overlay
         * @param button
         * @param close
         * @param form
         * @param endpoint
         * @return void
         */

    }, {
        key: 'loadDashboardModal',
        value: function loadDashboardModal(overlay, button, close, form, endpoint) {
            var object = this;

            button.onclick = function () {
                overlay.style.display = 'block';
            };

            close.onclick = function () {
                overlay.style.display = 'none';
            };

            form.onsubmit = function (submitted) {
                submitted.preventDefault();

                var data = AjaxHelpers.serialize(form);

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
         * This checks the type of fields being sent and if it meets a certain
         * criteria. A boolean value is returned, use in the serialize function
         *
         * @param field
         * @returns {boolean}
         */

    }], [{
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
     *
     * @return void
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

    }], [{
        key: 'serialize',
        value: function serialize(form) {
            var field = [];
            var value = [];

            if ((typeof form === 'undefined' ? 'undefined' : _typeof(form)) == 'object' && form.nodeName == "FORM") {
                var length = form.elements.length;

                for (var i = 0; i < length; i++) {
                    field = form.elements[i];
                    var fieldCheck = ActionHelpers.fieldTypeCheck(field);

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
     *
     * @return void
     */
    function View() {
        _classCallCheck(this, View);

        this.ActionHelpers = new ActionHelpers();

        this.registerDeleteConfirmation();
    }

    /**
     * Registers a delete confirmation
     *
     * @return void
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
     *
     * @return void
     */
    function ViewCampaigns() {
        _classCallCheck(this, ViewCampaigns);

        this.AjaxHelpers = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
        this.CampaignsController = new CampaignsController();
        this.CampOverlay = document.querySelector('.campaigns-overlay');

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


    _createClass(ViewCampaigns, [{
        key: 'loadRegionsFromOrganizationForCampaign',
        value: function loadRegionsFromOrganizationForCampaign() {
            var object = this,
                target = document.querySelector('#campaign-organization'),
                container = document.querySelector('#campaign-region');

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
         *
         * @return void
         */

    }, {
        key: 'setFlightWeeks',


        /**
         * Sets the total flight length in weeks once you have your dates
         * entered into the fields
         *
         * @return void
         */
        value: function setFlightWeeks() {
            var object = this,
                start = document.querySelector('#flight-start'),
                end = document.querySelector('#flight-end'),
                display = document.querySelector('#flight-length');

            if (start) {
                start.onkeyup = function () {
                    var startVal = start.value,
                        endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        display.value = CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) + ' Weeks';
                    }
                };
            }

            if (end) {
                end.onkeyup = function () {
                    var startVal = start.value,
                        endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        display.value = CampaignsController.calculateFlightLengthInWeeks(startVal, endVal) + ' Weeks';
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

    }, {
        key: 'createCampaignFromDashboard',
        value: function createCampaignFromDashboard() {
            var overlay = document.querySelector('.campaigns-overlay'),
                button = document.querySelector('.dash-create-campaign-button'),
                close = overlay.querySelector('.close'),
                form = overlay.querySelector('form'),
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

    }, {
        key: 'loadRegionsForCampaignEdit',
        value: function loadRegionsForCampaignEdit() {
            var object = this,
                target = document.querySelector('.campaign-edit');

            if (target !== null) {
                (function () {
                    var selector = document.querySelector('#campaign-organization'),
                        container = document.querySelector('#campaign-region'),
                        value = selector.value;

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
                })();
            }
        }
    }], [{
        key: 'setFlightFieldFormats',
        value: function setFlightFieldFormats() {
            var flightStart = document.querySelector('.flight-start'),
                flightEnd = document.querySelector('.flight-end');

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
     *
     * @return void
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
     *
     * @return void
     */


    _createClass(ViewInvoices, [{
        key: 'setRegionForInvoiceImporter',
        value: function setRegionForInvoiceImporter() {
            var object = this,
                target = document.querySelector('#organizations'),
                container = document.querySelector('#regions');

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
         *
         * @return void
         */

    }, {
        key: 'setInvoiceCampaigns',
        value: function setInvoiceCampaigns() {
            var object = this,
                target = document.querySelector('#regions'),
                container = document.querySelector('#campaigns');

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
         *
         * @return void
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
     *
     * @return void
     */
    function ViewNavigation() {
        _classCallCheck(this, ViewNavigation);

        this.navigationToggle();
    }

    /**
     * This toggles the side menu into and out of visibility
     * when you click on the hamburger
     *
     * @return void
     */


    _createClass(ViewNavigation, [{
        key: 'navigationToggle',
        value: function navigationToggle() {
            var hamburger = document.querySelector('.hamburger');

            hamburger.onclick = function () {
                var masthead = document.querySelector('.masthead'),
                    classList = masthead.classList;

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
     *
     * @return void
     */
    function ViewOrganizations() {
        _classCallCheck(this, ViewOrganizations);

        this.AjaxHelpers = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
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
     *
     * @return void
     */


    _createClass(ViewOrganizations, [{
        key: 'loadRegionsFromOrganizationForDashboard',
        value: function loadRegionsFromOrganizationForDashboard() {
            var object = this,
                targets = document.querySelectorAll('.organization-list li label'),
                container = document.querySelector('.region-information');

            targets.forEach(function (target) {
                target.onclick = function () {
                    var orgId = target.dataset.id,
                        orgName = this.dataset.name,
                        endpoint = '/api/v1/regions/' + orgId;

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
         *
         * @return void
         */

    }, {
        key: 'loadCampaignsFromRegion',
        value: function loadCampaignsFromRegion() {
            var object = this,
                regions = document.querySelectorAll('.region-selector');

            regions.forEach(function (region) {
                region.onclick = function () {
                    var id = region.dataset.id,
                        endpoint = '/api/v1/campaigns/' + id,
                        container = document.querySelector('.region-campaigns'),
                        regionName = region.innerHTML;

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
         *
         * @return void
         */

    }, {
        key: 'createOrganizationFromDashboard',
        value: function createOrganizationFromDashboard() {
            var overlay = document.querySelector('.organizations-overlay'),
                button = document.querySelector('.dash-create-organizations-button'),
                close = overlay.querySelector('.close'),
                form = overlay.querySelector('form'),
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

    }, {
        key: 'refreshOrganizations',
        value: function refreshOrganizations() {
            var object = this,
                sidebar = document.querySelector('.sidebar .organization-list'),
                endpoint = '/api/v1/organizations';

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
     *
     * @return void
     */
    function ViewRegions() {
        _classCallCheck(this, ViewRegions);

        this.AjaxHelpers = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
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
     *
     * @return void
     */


    _createClass(ViewRegions, [{
        key: 'dashboardCreateRegion',
        value: function dashboardCreateRegion() {
            var overlay = document.querySelector('.regions-overlay'),
                button = document.querySelector('.dash-create-regions-button'),
                close = overlay.querySelector('.close'),
                form = overlay.querySelector('form'),
                endpoint = '/api/v1/regions/new';

            this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
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
     *
     * @return void
     */
    function ViewSpotTypes() {
        _classCallCheck(this, ViewSpotTypes);

        this.AjaxHelpers = new AjaxHelpers();
        this.ActionHelpers = new ActionHelpers();
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


    _createClass(ViewSpotTypes, [{
        key: 'createSpotTypeFromDashboard',
        value: function createSpotTypeFromDashboard() {
            var overlay = document.querySelector('.spot-types-overlay'),
                button = document.querySelector('.dash-create-spot-types-button'),
                close = overlay.querySelector('.close'),
                form = overlay.querySelector('form'),
                endpoint = '/api/v1/spot-types/new';

            this.ActionHelpers.loadDashboardModal(overlay, button, close, form, endpoint);
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
     *
     * @return void
     */
    function ViewWorksheets() {
        _classCallCheck(this, ViewWorksheets);

        this.Worksheets = new WorksheetsController();

        this.persistWeekInformationForWorksheet();
        this.toggleProgramDetails();

        ViewWorksheets.setInnerOverflow();

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
     *
     * @return void
     */


    _createClass(ViewWorksheets, [{
        key: 'persistWeekInformationForWorksheet',
        value: function persistWeekInformationForWorksheet() {
            var object = this,
                buttons = document.querySelectorAll('.update-week-information');

            buttons.forEach(function (button) {
                button.onclick = function (clicked) {
                    clicked.preventDefault();

                    var id = button.dataset.worksheet,
                        worksheet = button.parentNode.parentNode,
                        wsClasses = worksheet.classList,
                        infoRequest = object.Worksheets.persistWorksheetWeekInformation(id);

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
         *
         * @return void
         */

    }, {
        key: 'createTotalCalculations',


        /**
         * Sets the spot total for each program (row) of the buy
         *
         * @return void
         */
        value: function createTotalCalculations() {
            var object = this,
                containers = document.querySelectorAll('.info-inner');

            containers.forEach(function (container) {
                var inputs = container.querySelectorAll('input.date-count'),
                    columns = container.querySelectorAll('.spot-column');

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
         * @return void
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

            ViewWorksheets.setWholeBuyTotals(container, programId);
        }

        /**
         * Sets the totals for the entire program (row)
         *
         * @param container
         * @param programId
         * @return void
         */

    }, {
        key: 'toggleProgramDetails',


        /**
         * Toggles the display of the program details
         *
         * @return void
         */
        value: function toggleProgramDetails() {
            var expanders = document.querySelectorAll('.extra-detail-expander');

            expanders.forEach(function (expander) {
                expander.onclick = function () {
                    var classList = expander.classList,
                        wrapper = expander.parentNode.querySelector('.detail-wrapper'),
                        wrapStyle = wrapper.style.display;

                    classList.toggle('rotated');
                    wrapper.style.display = wrapStyle === 'block' ? '' : 'block';
                };
            });
        }
    }], [{
        key: 'setInnerOverflow',
        value: function setInnerOverflow() {
            var containers = document.querySelectorAll('.info-inner');

            containers.forEach(function (container) {
                var dates = container.querySelectorAll('.spot-column'),
                    colWidth = dates[0].offsetWidth,
                    dateCount = dates.length;

                container.querySelector('.scrollable').style.width = colWidth * dateCount + 'px';
            });
        }
    }, {
        key: 'setWholeBuyTotals',
        value: function setWholeBuyTotals(container, programId) {
            var allInputs = container.querySelectorAll('input.date-count');
            var sectionedInputs = [];
            var count = 0;

            allInputs.forEach(function (input) {
                if (input.dataset.program == programId) {
                    sectionedInputs.push(input);
                }
            });

            sectionedInputs.forEach(function (input) {
                count = Number(input.value) + Number(count);
            });

            document.querySelector('.spot-date-total .program-' + programId + '-total').innerHTML = count.toString();
        }
    }]);

    return ViewWorksheets;
}();