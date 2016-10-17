"use strict";

$(document).ready(function () {
    new ViewOrganizations();
    new ViewCampaigns();
    new ViewNavigation();
    new ViewWorksheets();
    new ViewSpotTypes();
    new ViewRegions();
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
        this.setSpotTotals();
        this.dashboardCreateCampaign();

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
                    'min-width': colWidth * dateCount + 'px'
                });
            });
        }
    }, {
        key: 'setSpotTotals',
        value: function setSpotTotals() {
            var object = this;
            var container = $('.info-inner');
            var inputs = container.find('input.date-count');
            var columns = container.find('.spot-column');
            var count = 0;
            var weekCount = 0;

            inputs.each(function () {
                var program = $(this).attr('data-program');

                object.setBuyTotals(container, 0, columns, program);

                $(this).keyup(function () {
                    object.setBuyTotals(container, 0, columns, program);
                });
            });
        }
    }, {
        key: 'setBuyTotals',
        value: function setBuyTotals(container, count, columns, program) {
            var sectionedInputs = container.find('input.date-count[data-program=' + program + ']');
            count = 0;

            sectionedInputs.each(function () {
                count = Number($(this).val()) + Number(count);
            });

            columns.each(function () {
                var inputs = $(this).find('input');
                var sum = 0;

                inputs.each(function () {
                    var value = $(this).val();
                    sum = Number(value) + Number(sum);
                });

                $(this).find('.week-total .total').empty().append(sum);
            });

            $('.spot-date-total .program-' + program + '-total').empty().append(count);
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
    }]);

    return ViewCampaigns;
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
                $('body').toggleClass('add-padding');
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

        this.loadDashboardRegions();
        this.loadDashboardCampaigns();
        this.dashboardCreateOrganization();

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(ViewOrganizations, [{
        key: 'loadDashboardRegions',
        value: function loadDashboardRegions() {
            var object = this;
            var targets = document.querySelectorAll('.organization-list li label');
            var container = $('.region-information');

            for (var i = 0; i < targets.length; i++) {
                targets[i].onclick = function () {
                    var organization = this.dataset.id;
                    var organizationName = this.dataset.name;
                    var endpoint = '/api/v1/regions/' + organization;

                    object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                        container.empty().append('<h1 class="content-title">' + organizationName + ' Regions</h1>');
                        container.append('<ul class="region-list"></ul>');

                        if (resp.length > 0) {
                            for (var i = 0; i < resp.length; i++) {
                                container.find('.region-list').append('<li class="region-selector region-selector-' + resp[i].id + '" data-id="' + resp[i].id + '">' + resp[i].name + '</li>');
                            }
                        } else {
                            container.append('<p class="align-center">There Are No Regions</p>');
                        }

                        container.append('<div class="region-campaigns"></div>');
                    });
                };
            }
        }
    }, {
        key: 'loadDashboardCampaigns',
        value: function loadDashboardCampaigns() {
            var object = this;

            $('body').on('click', '.region-selector', function () {
                var id = $(this).attr('data-id');
                var endpoint = '/api/v1/campaigns/' + id;
                var container = $('.region-campaigns');

                object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                    if (resp.length > 0) {
                        container.empty().append('<h1 class="campaigns-title">Campaigns</h1>');
                        container.append('<ul class="campaign-list"></ul>');
                        for (var i = 0; i < resp.length; i++) {
                            container.find('.campaign-list').append('<li class="campaign-selector campaign-selector-' + resp[i].id + '" data-id="' + resp[i].id + '">' + resp[i].name + '</li>');
                            container.find('.campaign-selector-' + resp[i].id).append('<div class="actions">Actions: <a href="/campaigns/worksheets/' + resp[i].id + '">See Worksheets</a></div>');
                        }
                    } else {
                        container.empty().append('<h1 class="campaigns-title">Campaigns</h1>');
                        container.append('<p class="align-center">No campaigns are currently running</p>');
                    }
                });

                console.log(id);
            });
        }
    }, {
        key: 'dashboardCreateOrganization',
        value: function dashboardCreateOrganization() {
            var object = this;
            var overlay = $('.organizations-overlay');
            var button = $('.dash-create-organizations-button');
            var close = $('.organizations-overlay .close');
            var form = $('.organizations-overlay form');
            var endpoint = '/api/v1/organizations/new';

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
                        object.refreshOrganizations();

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

                object.loadDashboardRegions();
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

        this.persisAction();

        this.Worksheets = new WorksheetsController();
    }

    _createClass(ViewWorksheets, [{
        key: 'persisAction',
        value: function persisAction() {
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
    }]);

    return ViewWorksheets;
}();