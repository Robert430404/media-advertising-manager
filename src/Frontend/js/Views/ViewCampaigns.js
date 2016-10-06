class ViewCampaigns {
    constructor() {
        this.setCampaignRegions();
        this.setFlightFieldFormats();
        this.setFlightWeeks();

        this.CampaignsController = new CampaignsController();
    }

    setCampaignRegions() {
        var object = this;
        var target = document.querySelector('#campaign-organization');
        var container = $('#campaign-region');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.empty();

                if (value == '') {
                    container.append('<option value="">Select Organization</option>');
                }
                else {
                    object.CampaignsController.loadCampaignRegions(value).then(function (resp) {
                        for (var i = 0; i < resp.length; i++) {
                            container.append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                    });
                }
            }
        }
    }

    setFlightFieldFormats() {
        $('.flight-start').formatter({
            'pattern': '{{9999}}-{{99}}-{{99}}',
            'persist': true
        });
        $('.flight-end').formatter({
            'pattern': '{{9999}}-{{99}}-{{99}}',
            'persist': true
        });
    }

    setFlightWeeks() {
        var object = this;
        var start = document.querySelector('#flight-start');
        var end = document.querySelector('#flight-end');
        var display = document.querySelector('#flight-length');

        start.onkeyup = function () {
            var startVal = start.value;
            var endVal = end.value;

            if (startVal.length > 9 && endVal.length > 9) {
                var diff = object.CampaignsController.calculateFlightLength(startVal, endVal);

                display.value = diff + ' Weeks';
            }
        };

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