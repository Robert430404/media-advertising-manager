class ViewSpotTypes {
    constructor() {
        this.dashboardCreateSpotType()

        this.AjaxHelpers = new AjaxHelpers();
    }

    dashboardCreateSpotType() {
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