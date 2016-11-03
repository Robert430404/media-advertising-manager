class ViewInvoices {
    constructor() {
        this.setInvoiceRegions();
        this.setInvoiceCampaigns();

        this.CampaignsController = new CampaignsController();
    }

    setInvoiceRegions() {
        var object = this;
        var target = document.querySelector('#organizations');
        var container = $('#regions');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.empty();

                if (value == '') {
                    container.append('<option value="">Select Organization</option>');
                }
                else {
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
            }
        }
    }

    setInvoiceCampaigns() {
        var object = this;
        var target = document.querySelector('#regions');
        var container = $('#campaigns');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.empty();

                if (value == '') {
                    container.append('<option value="">Select Organization</option>');
                }
                else {
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
            }
        }
    }
}