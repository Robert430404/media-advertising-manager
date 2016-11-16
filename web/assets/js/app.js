"use strict";

$(document).ready(function () {
    new ViewOrganizations();
    new ViewCampaigns();
    new ViewNavigation();
    new ViewWorksheets();
    new ViewSpotTypes();
    new ViewRegions();
    new ViewInvoices();
    new ActionHelpers();
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CampaignsController = function () {
    function CampaignsController() {
        _classCallCheck(this, CampaignsController);

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(CampaignsController, [{
        key: 'loadCampaignRegions',
        value: function loadCampaignRegions(organization) {
            var endpoint = '/api/v1/regions/' + organization;

            return this.AjaxHelpers.getCall(endpoint);
        }
    }, {
        key: 'loadRegionCampaigns',
        value: function loadRegionCampaigns(region) {
            var endpoint = '/api/v1/campaigns/' + region;

            return this.AjaxHelpers.getCall(endpoint);
        }
    }, {
        key: 'createNewCampaign',
        value: function createNewCampaign(data) {
            var endpoint = '/api/v1/campaigns/new';

            return this.AjaxHelpers.postCall(endpoint, data);
        }
    }, {
        key: 'calculateFlightLength',
        value: function calculateFlightLength(start, end) {
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
"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionHelpers = function () {
    function ActionHelpers() {
        _classCallCheck(this, ActionHelpers);

        this.confirmDelete();
    }

    _createClass(ActionHelpers, [{
        key: 'confirmDelete',
        value: function confirmDelete() {
            $('a.delete-button').click(function (e) {
                e.preventDefault();
                var link = $(this).attr('href');
                var confirmation = confirm('Do you really want to delete this?');

                if (confirmation) {
                    window.location = link;
                }
            });
        }
    }]);

    return ActionHelpers;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxHelpers = function () {
    function AjaxHelpers() {
        _classCallCheck(this, AjaxHelpers);
    }

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
    }, {
        key: 'serialize',
        value: function serialize(form) {
            var field = [];
            var value = [];

            if ((typeof form === 'undefined' ? 'undefined' : _typeof(form)) == 'object' && form.nodeName == "FORM") {
                var length = form.elements.length;

                for (var i = 0; i < length; i++) {
                    field = form.elements[i];

                    if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                        if (field.type == 'select-multiple') {
                            for (var j = form.elements[i].options.length - 1; j >= 0; j--) {
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            this.createCampignFromDashboard();
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

                        object.CampaignsController.loadCampaignRegions(value).then(function (regions) {
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
                        display.value = object.CampaignsController.calculateFlightLength(startVal, endVal) + ' Weeks';
                    }
                };
            }

            if (end) {
                end.onkeyup = function () {
                    var startVal = start.value;
                    var endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        display.value = object.CampaignsController.calculateFlightLength(startVal, endVal) + ' Weeks';
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
        key: 'createCampignFromDashboard',
        value: function createCampignFromDashboard() {
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

                    object.CampaignsController.loadCampaignRegions(value).then(function (regions) {
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.addMoreInvoices();

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
                        object.CampaignsController.loadCampaignRegions(value).then(function (regions) {
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
                        object.CampaignsController.loadRegionCampaigns(value).then(function (campaigns) {
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
         */

    }, {
        key: 'addMoreInvoices',
        value: function addMoreInvoices() {
            var inputs = document.querySelectorAll('.file-inputs');

            $('.add-more-invoices').click(function () {
                var lastInput = inputs.find('.columns:last-child').find('input');
                var currentId = lastInput.attr('data-id');
                var newId = Number(currentId) + 1;

                inputs.append('<div class="columns large-4 medium-4 small-12">' + '<input type="file" class="form-control" name="invoices-' + newId + '" data-id="' + newId + '" />' + '</div>');
            });
        }
    }]);

    return ViewInvoices;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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