class ViewOrganizations {
    constructor() {
        this.loadDashboardRegions();
        this.loadDashboardCampaigns();
        this.dashboardCreateOrganization();

        this.AjaxHelpers = new AjaxHelpers();
    }

    loadDashboardRegions() {
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
                    }
                    else {
                        container.append('<p class="align-center">There Are No Regions</p>');
                    }

                    container.append('<div class="region-campaigns"></div>');
                });
            };
        }
    }

    loadDashboardCampaigns() {
        var object = this;

        $('body').on('click' , '.region-selector', function () {
            var id = $(this).attr('data-id');
            var endpoint = '/api/v1/campaigns/' + id;
            var container = $('.region-campaigns');

            object.AjaxHelpers.getCall(endpoint).then(function (resp) {
                console.log(resp);
                if(resp.length > 0) {
                    console.log(resp);
                    container.empty().append('<h1 class="campaigns-title">Campaigns</h1>');
                    container.append('<ul class="campaign-list"></ul>');
                    for(var i = 0; i < resp.length; i++) {
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

    dashboardCreateOrganization() {
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
                if(resp.success == true) {
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
}