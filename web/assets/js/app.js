"use strict";

$(document).ready(function () {
    new ViewOrganizations();
    new ViewCampaigns();
    new ViewNavigation();
    new ViewWorksheets();
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CampaignsController = function () {
    function CampaignsController() {
        _classCallCheck(this, CampaignsController);

        this.AjaxHelpers = new AjaxHelpers();
    }

    _createClass(CampaignsController, [{
        key: "loadCampaignRegions",
        value: function loadCampaignRegions(organization) {
            var endpoint = '/api/v1/regions/' + organization;

            return this.AjaxHelpers.getCall(endpoint);
        }
    }, {
        key: "calculateFlightLength",
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

var ViewCampaigns = function () {
    function ViewCampaigns() {
        _classCallCheck(this, ViewCampaigns);

        this.setCampaignRegions();
        this.setFlightFieldFormats();
        this.setFlightWeeks();
        this.setInnerOverflow();
        this.setSpotTotals();

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
            var container = $('.info-inner');
            var inputs = container.find('input.date-count');
            var count = 0;

            inputs.each(function () {
                var program = $(this).attr('data-program');
                var sectionedInputs = container.find('input.date-count[data-program=' + program + ']');
                count = 0;

                sectionedInputs.each(function () {
                    count = Number($(this).val()) + Number(count);
                });

                $('.spot-date-total .program-' + program + '-total').empty().append(count);

                $(this).keyup(function () {
                    var program = $(this).attr('data-program');
                    var sectionedInputs = container.find('input.date-count[data-program=' + program + ']');
                    count = 0;

                    sectionedInputs.each(function () {
                        count = Number($(this).val()) + Number(count);
                    });

                    $('.spot-date-total .program-' + program + '-total').empty().append(count);
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
                                container.find('.region-list').append('<li data-id="' + resp[i].id + '">' + resp[i].name + '</li>');
                            }
                        } else {
                            container.append('<p class="align-center">There Are No Regions</p>');
                        }

                        container.append('<hr />');
                        container.append('<div class="region-information"></div>');
                    });
                };
            }
        }
    }]);

    return ViewOrganizations;
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
                var id = $(this).attr('data-worksheet');
                var response = object.Worksheets.persistWorksheetWeekInformation(id);

                if (response) {
                    response.then(function (resp) {
                        if (resp.success == true) {
                            console.log('success');
                        } else {
                            console.log('failure');
                        }
                    });
                }
            });
        }
    }]);

    return ViewWorksheets;
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