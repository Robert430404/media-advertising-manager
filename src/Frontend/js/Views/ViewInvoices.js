/**
 * ViewInvoices Class
 *
 * Contains all logic that interacts with invoices in the view
 */
class ViewInvoices {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.setRegionForInvoiceImporter();
        this.setInvoiceCampaigns();
        // this.addMoreInvoices();

        this.CampaignsController = new CampaignsController();
    }

    /**
     * Sets the region for the invoice importer after you've selected your
     * organization, loads the regions using the campaigns controller
     */
    setRegionForInvoiceImporter() {
        var object    = this;
        var target    = document.querySelector('#organizations');
        var container = document.querySelector('#regions');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.innerHTML = '<option value="">Select Organization</option>';

                if (value !== '') {
                    object.CampaignsController.loadRegionsFromOrganization(value).then(function (regions) {
                        container.innerHTML = '<option value="">Select Region</option>';

                        regions.forEach( function (region) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="' + region.id + '">' + region.name + '</option>';
                        });

                        if (regions.length == 0) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="">No Available Regions</option>';
                        }
                    });
                }
            }
        }
    }

    /**
     * Sets the campaigns for the invoice importer after you've selected your
     * region, loads the campaigns using the campaigns controller
     */
    setInvoiceCampaigns() {
        var object    = this;
        var target    = document.querySelector('#regions');
        var container = document.querySelector('#campaigns');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.innerHTML = '<option value="">Select Region</option>';

                if (value !== '') {
                    object.CampaignsController.loadCampaignsFromRegion(value).then(function (campaigns) {
                        container.innerHTML = '<option value="">Select Campaign</option>';

                        campaigns.forEach(function (campaign) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="' + campaign.id + '">' + campaign.name + '</option>';
                        });

                        if (campaigns.length == 0) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="">No Available Campaigns</option>';
                        }
                    });
                }
            }
        }
    }

    /**
     * Function that allows you to add more files to the invoice processor
     * so you can process multiple invoices as once.
     *
     * Currently not in use
     */
    // addMoreInvoices() {
    //     var inputs = document.querySelectorAll('.file-inputs');
    //
    //     $('.add-more-invoices').click(function () {
    //         var lastInput = inputs.find('.columns:last-child').find('input');
    //         var currentId = lastInput.attr('data-id');
    //         var newId     = Number(currentId) + 1;
    //
    //         inputs.append('<div class="columns large-4 medium-4 small-12">' +
    //                            '<input type="file" class="form-control" name="invoices-' + newId + '" data-id="' + newId + '" />' +
    //                       '</div>');
    //     });
    // }
}