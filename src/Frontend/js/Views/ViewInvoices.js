/**
 * ViewInvoices Class
 *
 * Contains all logic that interacts with invoices in the view
 */
class ViewInvoices {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.CampaignsController = new CampaignsController();
        this.ActionHelpers       = new ActionHelpers();
        this.DomHelpers          = new DomHelpers();

        this.setRegionForInvoiceImporter();
        this.setInvoiceCampaigns();
    }

    /**
     * Sets the region for the invoice importer after you've selected your
     * organization, loads the regions using the campaigns controller
     *
     * @return void
     */
    setRegionForInvoiceImporter() {
        const object         = this,
              target         = document.querySelector('#organizations'),
              container      = document.querySelector('#regions');

        if (target) {
            target.onchange = () => {
                const value          = target.value,
                      regionDropDown = object.DomHelpers.setContainer(container);

                regionDropDown.replace(`<option value="">Select Organization</option>`);

                if (value !== '') {
                    object.CampaignsController.loadRegionsFromOrganization(value).then((regions) => {
                        regionDropDown.replace(`<option value="">Select Region</option>`);

                        regions.forEach((region) => {
                            regionDropDown.append(`<option value="${region.id}">${region.name}</option>`);
                        });

                        if (regions.length == 0) {
                            regionDropDown.append(`<option value="">No Available Regions</option>`);
                        }
                    });
                }
            }
        }
    }

    /**
     * Sets the campaigns for the invoice importer after you've selected your
     * region, loads the campaigns using the campaigns controller
     *
     * @return void
     */
    setInvoiceCampaigns() {
        const object    = this,
              target    = document.querySelector('#regions'),
              container = document.querySelector('#campaigns');

        if (target) {
            target.onchange = () => {
                const value   = target.value,
                      campCon = object.DomHelpers.setContainer(container);

                campCon.replace(`<option value="">Select Region</option>`);

                if (value !== '') {
                    object.CampaignsController.loadCampaignsFromRegion(value).then((campaigns) => {
                        campCon.replace(`<option value="">Select Campaign</option>`);

                        campaigns.forEach((campaign) => {
                            campCon.append(`<option value="${campaign.id}">${campaign.name}</option>`);
                        });

                        if (campaigns.length == 0) {
                            campCon.append(`<option value="">No Available Campaigns</option>`);
                        }
                    });
                }
            }
        }
    }
}