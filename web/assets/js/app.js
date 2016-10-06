"use strict";

$(document).ready(function () {
    new ViewOrganizations();
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sidebar = function () {
    function Sidebar() {
        _classCallCheck(this, Sidebar);

        this.regionToggles();
    }

    _createClass(Sidebar, [{
        key: "regionToggles",
        value: function regionToggles() {}
    }]);

    return Sidebar;
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
    }]);

    return AjaxHelpers;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewOrganizations = function () {
    function ViewOrganizations() {
        _classCallCheck(this, ViewOrganizations);

        this.loadDashboardRegions();
        this.loadCampaignRegions();

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
    }, {
        key: 'loadCampaignRegions',
        value: function loadCampaignRegions() {
            var object = this;
            var target = document.querySelector('#campaign-organization');
            var container = $('#campaign-region');

            if (target) {
                target.onchange = function () {
                    var value = this.value;
                    var endpoint = '/api/v1/regions/' + value;

                    container.empty();

                    object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                    });
                };
            }
        }
    }]);

    return ViewOrganizations;
}();