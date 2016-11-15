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

var WorksheetsController = function () {
    function WorksheetsController() {
        _classCallCheck(this, WorksheetsController);

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(WorksheetsController, [{
        key: 'persistWorksheetWeekInformation',
        value: function persistWorksheetWeekInformation(id) {
            var form = $('.worksheet-counts-' + id);
            var data = form.serialize();
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
            var field,
                s = [];

            if ((typeof form === 'undefined' ? 'undefined' : _typeof(form)) == 'object' && form.nodeName == "FORM") {
                var len = form.elements.length;

                for (var i = 0; i < len; i++) {
                    field = form.elements[i];

                    if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                        if (field.type == 'select-multiple') {
                            for (var j = form.elements[i].options.length - 1; j >= 0; j--) {
                                if (field.options[j].selected) s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                            }
                        } else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                        }
                    }
                }
            }
            return s.join('&').replace(/%20/g, '+');
        }
    }]);

    return AjaxHelpers;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewCampaigns = function () {
    function ViewCampaigns() {
        _classCallCheck(this, ViewCampaigns);

        this.setCampaignRegions();
        this.setFlightFieldFormats();
        this.setFlightWeeks();
        this.setInnerOverflow();
        if (document.querySelector('.info-inner')) {
            this.setSpotTotals();
        }
        this.dashboardCreateCampaign();
        this.campaignEditGetRegions();

        this.CampaignsController = new CampaignsController();
    }

    _createClass(ViewCampaigns, [{
        key: 'setCampaignRegions',
        value: function setCampaignRegions() {
            var object = this;
            var target = document.querySelector('#campaign-organization');
            var container = $('#campaign-region');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.empty();

                    if (value == '') {
                        container.append('<option value="">Select Organization</option>');
                    } else {
                        object.CampaignsController.loadCampaignRegions(value).then(function (resp) {
                            container.append('<option value="">Select A Region</option>');

                            for (var i = 0; i < resp.length; i++) {
                                container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                            }
                        });
                    }
                };
            }
        }
    }, {
        key: 'setFlightFieldFormats',
        value: function setFlightFieldFormats() {
            $('.flight-start').formatter({
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
            $('.flight-end').formatter({
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
        }
    }, {
        key: 'setFlightWeeks',
        value: function setFlightWeeks() {
            var object = this;
            var start = document.querySelector('#flight-start');
            var end = document.querySelector('#flight-end');
            var display = document.querySelector('#flight-length');

            if (start !== null) {
                start.onkeyup = function () {
                    var startVal = start.value;
                    var endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        var diff = object.CampaignsController.calculateFlightLength(startVal, endVal);

                        display.value = diff;
                    }
                };
            }

            if (end !== null) {
                end.onkeyup = function () {
                    var startVal = start.value;
                    var endVal = end.value;

                    if (startVal.length > 9 && endVal.length > 9) {
                        var diff = object.CampaignsController.calculateFlightLength(startVal, endVal);

                        display.value = diff + ' Weeks';
                    }
                };
            }
        }
    }, {
        key: 'setInnerOverflow',
        value: function setInnerOverflow() {
            var container = $('.info-inner');

            container.each(function () {
                var dates = $(this).find('.spot-column');
                var colWidth = dates.outerWidth();
                var dateCount = dates.length;

                $(this).find('.scrollable').css({
                    'width': colWidth * dateCount + 'px'
                });
            });
        }
    }, {
        key: 'setSpotTotals',
        value: function setSpotTotals() {
            var object = this;
            var containers = document.querySelectorAll('.info-inner');

            containers.forEach(function (element) {
                console.log(element);

                var inputs = element.querySelectorAll('input.date-count');
                var columns = element.querySelectorAll('.spot-column');

                for (var b = 0; b < inputs.length; b++) {
                    object.setWeekTotals(element, columns, inputs[b].dataset.program);

                    inputs[b].onkeyup = function () {
                        object.setWeekTotals(element, columns, this.dataset.program);
                    };
                }
            });
        }
    }, {
        key: 'setWeekTotals',
        value: function setWeekTotals(container, columns, programId) {
            for (var c = 0; c < columns.length; c++) {
                var inputs = columns[c].querySelectorAll('input');
                var sum = 0;

                for (var i = 0; i < inputs.length; i++) {
                    sum = Number(inputs[i].value) + Number(sum);
                }

                if (columns[c].querySelector('.week-total .total')) {
                    columns[c].querySelector('.week-total .total').innerHTML = sum;
                }
            }

            this.setBuyTotals(container, programId);
        }
    }, {
        key: 'setBuyTotals',
        value: function setBuyTotals(container, programId) {
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
    }, {
        key: 'dashboardCreateCampaign',
        value: function dashboardCreateCampaign() {
            var object = this;
            var overlay = $('.campaigns-overlay');
            var button = $('.dash-create-campaign-button');
            var close = $('.campaigns-overlay .close');
            var form = $('.campaigns-overlay form');

            button.click(function () {
                overlay.fadeIn();
            });

            close.click(function () {
                overlay.fadeOut();
            });

            form.submit(function (e) {
                e.preventDefault();

                var data = $(this).serialize();

                object.CampaignsController.createNewCampaign(data).then(function (resp) {
                    if (resp.success == true) {
                        form[0].reset();
                        form.addClass('successful');

                        setTimeout(function () {
                            form.removeClass('successful');
                        }, 1000);
                    } else {
                        form.addClass('failure');

                        setTimeout(function () {
                            form.removeClass('failure');
                        }, 1000);
                    }
                });
            });
        }
    }, {
        key: 'campaignEditGetRegions',
        value: function campaignEditGetRegions() {
            var campaignsController = new CampaignsController();
            var target = document.querySelector('.campaign-edit');

            if (target !== null) {
                var selector = document.querySelector('#campaign-organization');
                var container = $('#campaign-region');
                var value = selector.value;

                container.empty();

                if (value == '') {
                    container.append('<option value="">Select Organization</option>');
                } else {
                    container.append('<option value="">Select Region</option>');
                    campaignsController.loadCampaignRegions(value).then(function (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            if (value == resp[i].id) {
                                container.append('<option value="' + resp[i].id + '" selected="selected">' + resp[i].name + '</option>');
                            } else {
                                container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                            }
                        }
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

var ViewInvoices = function () {
    function ViewInvoices() {
        _classCallCheck(this, ViewInvoices);

        this.setInvoiceRegions();
        this.setInvoiceCampaigns();
        this.addMoreInvoices();

        this.CampaignsController = new CampaignsController();
    }

    _createClass(ViewInvoices, [{
        key: 'setInvoiceRegions',
        value: function setInvoiceRegions() {
            var object = this;
            var target = document.querySelector('#organizations');
            var container = $('#regions');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.empty();

                    if (value == '') {
                        container.append('<option value="">Select Organization</option>');
                    } else {
                        object.CampaignsController.loadCampaignRegions(value).then(function (resp) {
                            container.append('<option value="">Select Region</option>');

                            for (var i = 0; i < resp.length; i++) {
                                container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                            }

                            if (resp.length == 0) {
                                container.append('<option value="">No Available Regions</option>');
                            }
                        });
                    }
                };
            }
        }
    }, {
        key: 'setInvoiceCampaigns',
        value: function setInvoiceCampaigns() {
            var object = this;
            var target = document.querySelector('#regions');
            var container = $('#campaigns');

            if (target) {
                target.onchange = function () {
                    var value = this.value;

                    container.empty();

                    if (value == '') {
                        container.append('<option value="">Select Organization</option>');
                    } else {
                        object.CampaignsController.loadRegionCampaigns(value).then(function (resp) {
                            container.append('<option value="">Select Campaign</option>');

                            for (var i = 0; i < resp.length; i++) {
                                container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                            }

                            if (resp.length == 0) {
                                container.append('<option value="">No Available Campaigns</option>');
                            }
                        });
                    }
                };
            }
        }
    }, {
        key: 'addMoreInvoices',
        value: function addMoreInvoices() {
            var inputs = $('.file-inputs');

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

var ViewNavigation = function () {
    function ViewNavigation() {
        _classCallCheck(this, ViewNavigation);

        this.navigationToggle();
    }

    _createClass(ViewNavigation, [{
        key: 'navigationToggle',
        value: function navigationToggle() {
            $('.hamburger').click(function () {
                // $('body').toggleClass('add-padding');
                $('.masthead').toggleClass('show');
            });
        }
    }]);

    return ViewNavigation;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewOrganizations = function () {
    function ViewOrganizations() {
        _classCallCheck(this, ViewOrganizations);

        this.loadRegionsFromOrganization();
        this.createOrganizationFromDashboard();

        this.AjaxHelpers = new AjaxHelpers();
    }

    /**
     * Loads the regions for an organization when an organization on the
     * dashboard is clicked.
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     */


    _createClass(ViewOrganizations, [{
        key: 'loadRegionsFromOrganization',
        value: function loadRegionsFromOrganization() {
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
    }, {
        key: 'refreshOrganizations',
        value: function refreshOrganizations() {
            var object = this;
            var sidebar = $('.sidebar .organization-list');
            var regionSelect = $('.regions-overlay #organization-id');
            var endpoint = '/api/v1/organizations';

            object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                sidebar.empty();

                for (var i = 0; i < resp.length; i++) {
                    sidebar.append('<li>' + '<label data-id="' + resp[i].id + '" data-name="' + resp[i].name + '">' + resp[i].name + '<i class="fa fa-chevron-right"></i>' + '</label>' + '</li>');
                }

                object.loadRegionsFromOrganization();
            });
        }
    }]);

    return ViewOrganizations;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewRegions = function () {
    function ViewRegions() {
        _classCallCheck(this, ViewRegions);

        this.dashboardCreateRegion();

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(ViewRegions, [{
        key: 'dashboardCreateRegion',
        value: function dashboardCreateRegion() {
            var object = this;
            var overlay = $('.regions-overlay');
            var button = $('.dash-create-regions-button');
            var close = $('.regions-overlay .close');
            var form = $('.regions-overlay form');
            var endpoint = '/api/v1/regions/new';

            button.click(function () {
                overlay.fadeIn();
            });

            close.click(function () {
                overlay.fadeOut();
            });

            form.submit(function (e) {
                e.preventDefault();

                var data = $(this).serialize();

                object.AjaxHelpers.postCall(endpoint, data).then(function (resp) {
                    if (resp.success == true) {
                        form[0].reset();
                        form.addClass('successful');

                        setTimeout(function () {
                            form.removeClass('successful');
                        }, 1000);
                    } else {
                        form.addClass('failure');

                        setTimeout(function () {
                            form.removeClass('failure');
                        }, 1000);
                    }
                });
            });
        }
    }]);

    return ViewRegions;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewSpotTypes = function () {
    function ViewSpotTypes() {
        _classCallCheck(this, ViewSpotTypes);

        this.dashboardCreateSpotType();

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(ViewSpotTypes, [{
        key: 'dashboardCreateSpotType',
        value: function dashboardCreateSpotType() {
            var object = this;
            var overlay = $('.spot-types-overlay');
            var button = $('.dash-create-spot-types-button');
            var close = $('.spot-types-overlay .close');
            var form = $('.spot-types-overlay form');
            var endpoint = '/api/v1/spot-types/new';

            button.click(function () {
                overlay.fadeIn();
            });

            close.click(function () {
                overlay.fadeOut();
            });

            form.submit(function (e) {
                e.preventDefault();

                var data = $(this).serialize();

                object.AjaxHelpers.postCall(endpoint, data).then(function (resp) {
                    if (resp.success == true) {
                        form[0].reset();
                        form.addClass('successful');

                        setTimeout(function () {
                            form.removeClass('successful');
                        }, 1000);
                    } else {
                        form.addClass('failure');

                        setTimeout(function () {
                            form.removeClass('failure');
                        }, 1000);
                    }
                });
            });
        }
    }]);

    return ViewSpotTypes;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewWorksheets = function () {
    function ViewWorksheets() {
        _classCallCheck(this, ViewWorksheets);

        this.persistAction();
        this.expandSpotDetails();

        this.Worksheets = new WorksheetsController();
    }

    _createClass(ViewWorksheets, [{
        key: 'persistAction',
        value: function persistAction() {
            var object = this;

            $('.update-week-information').click(function () {
                var button = $(this);
                var id = $(this).attr('data-worksheet');
                var response = object.Worksheets.persistWorksheetWeekInformation(id);

                button.parent().parent().toggleClass('loading');

                if (response) {
                    response.then(function (resp) {
                        setTimeout(function () {
                            button.parent().parent().toggleClass('loading');

                            if (resp.success == true) {
                                button.parent().parent().toggleClass('success');

                                setTimeout(function () {
                                    button.parent().parent().toggleClass('success');
                                }, 700);
                            } else {
                                button.parent().parent().toggleClass('failure');

                                setTimeout(function () {
                                    button.parent().parent().toggleClass('failure');
                                }, 700);
                            }
                        }, 100);
                    });
                }
            });
        }
    }, {
        key: 'expandSpotDetails',
        value: function expandSpotDetails() {
            var object = this;

            $('.extra-detail-expander').click(function () {
                $(this).toggleClass('rotated');
                $(this).parent().find('.detail-wrapper').slideToggle();
            });
        }
    }]);

    return ViewWorksheets;
}();