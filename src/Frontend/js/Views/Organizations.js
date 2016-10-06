class ViewOrganizations {
    constructor() {
        this.loadDashboardRegions();
        this.loadCampaignRegions();

        this.AjaxHelpers = new AjaxHelpers();
    }

    loadDashboardRegions() {
        var object = this;
        var targets = document.querySelectorAll('.organization-list li label');
        var container = $('.region-information');

        for (var i = 0; i < targets.length; i++)
        {
            targets[i].onclick = function () {
                var organization     = this.dataset.id;
                var organizationName = this.dataset.name;
                var endpoint         = '/api/v1/regions/' + organization;

                object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                    container.empty().append('<h1 class="content-title">' + organizationName + ' Regions</h1>');
                    container.append('<ul class="region-list"></ul>');

                    if (resp.length > 0) {
                        for (var i = 0; i < resp.length; i++)
                        {
                            container.find('.region-list').append('<li data-id="' + resp[i].id + '">' + resp[i].name + '</li>');
                        }
                    }
                    else {
                        container.append('<p class="align-center">There Are No Regions</p>');
                    }

                    container.append('<hr />');
                    container.append('<div class="region-information"></div>');
                });
            };
        }
    }

    loadCampaignRegions() {
        var object = this;
        var target = document.querySelector('#campaign-organization');
        var container = $('#campaign-region');

        if (target) {
            target.onchange = function () {
                var value = this.value;
                var endpoint = '/api/v1/regions/' + value;

                container.empty();

                object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                    for (var i = 0; i < resp.length; i++)
                    {
                        container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                    }
                });
            }
        }
    }
}