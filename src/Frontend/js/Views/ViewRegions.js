class ViewRegions {
    constructor() {
        this.dashboardCreateRegion()

        this.AjaxHelpers = new AjaxHelpers();
    }

    dashboardCreateRegion() {
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