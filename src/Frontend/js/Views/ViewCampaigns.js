/**
 * ViewCampaigns Class
 *
 * Contains all logic that interacts with campaigns in the view
 */
class ViewCampaigns {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.CampaignsController = new CampaignsController();
        this.CampOverlay         = document.querySelector('.campaigns-overlay');

        this.loadRegionsFromOrganizationForCampaign();
        this.loadRegionsForCampaignEdit();
        this.setFlightFieldFormats();
        this.setFlightWeeks();

        if (this.CampOverlay) {
            this.createCampignFromDashboard();
        }
    }

    /**
     * Loads the regions for the dropdown when you're creating a campaign
     * on the campaigns page
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     */
    loadRegionsFromOrganizationForCampaign() {
        var object    = this;
        var target    = document.querySelector('#campaign-organization');
        var container = document.querySelector('#campaign-region');

        if (target) {
            target.onchange = function () {
                var value = this.value;

                container.innerHTML = '<option value="">Select Organization</option>';

                if (value !== '') {
                    container.innerHTML = '';

                    object.CampaignsController.loadCampaignRegions(value).then(function (regions) {
                        container.innerHTML = container.innerHTML +
                                              '<option value="">Select A Region</option>';

                        regions.forEach( function (region) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="' + region.id + '">' + region.name + '</option>';
                        });
                    });
                }
            }
        }
    }

    /**
     * Enforces the date format on the flight date fields
     *
     * Depends on formatter.js
     */
    setFlightFieldFormats() {
        var flightStart = document.querySelector('.flight-start');
        var flightEnd   = document.querySelector('.flight-end');

        if (flightStart) {
            new Formatter(flightStart, {
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
        }

        if (flightEnd) {
            new Formatter(flightEnd, {
                'pattern': '{{9999}}-{{99}}-{{99}}',
                'persist': true
            });
        }
    }

    /**
     * Sets the total flight length in weeks once you have your dates
     * entered into the fields
     */
    setFlightWeeks() {
        var object  = this;
        var start   = document.querySelector('#flight-start');
        var end     = document.querySelector('#flight-end');
        var display = document.querySelector('#flight-length');

        if (start) {
            start.onkeyup = function () {
                var startVal = start.value;
                var endVal   = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    display.value = object.CampaignsController.calculateFlightLength(startVal, endVal) +
                                    ' Weeks';
                }
            };
        }

        if (end) {
            end.onkeyup = function () {
                var startVal = start.value;
                var endVal   = end.value;

                if (startVal.length > 9 && endVal.length > 9) {
                    display.value = object.CampaignsController.calculateFlightLength(startVal, endVal) +
                                    ' Weeks';
                }
            };
        }
    }

    /**
     * Brings the create campaign form into view and persists the
     * new campaign on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     */
    createCampignFromDashboard() {
        var object  = this;
        var overlay = document.querySelector('.campaigns-overlay');
        var button  = document.querySelector('.dash-create-campaign-button');
        var close   = overlay.querySelector('.close');
        var form    = overlay.querySelector('form');

        button.onclick = function () {
            overlay.style.display = 'block';
        };

        close.onclick = function () {
            overlay.style.display = 'none';
        };

        form.onsubmit = function (submitted) {
            submitted.preventDefault();

            var data = object.AjaxHelpers.serialize(form);

            object.CampaignsController.createNewCampaign(data).then(function (resp) {
                var formClasses = form.classList;

                if (resp.success == true) {
                    form.reset();
                    formClasses.add('successful');

                    setTimeout(function () {
                        formClasses.remove('successful');
                    }, 1000);
                } else {
                    formClasses.add('failure');

                    setTimeout(function () {
                        formClasses.remove('failure');
                    }, 1000);
                }
            });
        };
    }

    /**
     * Loads the regions for the selected organization as you're editing
     * the campaign
     *
     * Makes an AJAX call to the /api/v1/regions/ endpoint to retrieve
     * the data
     */
    loadRegionsForCampaignEdit() {
        var object = this;
        var target = document.querySelector('.campaign-edit');

        if (target !== null) {
            var selector  = document.querySelector('#campaign-organization');
            var container = document.querySelector('#campaign-region');
            var value     = selector.value;

            container.innerHTML = '<option value="">Select Organization</option>';

            if (value !== '') {
                container.innerHTML = container.innerHTML +
                                      '<option value="">Select Region</option>';

                object.CampaignsController.loadCampaignRegions(value).then(function (regions) {
                    regions.forEach( function (region) {
                        if (value == region.id) {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="' + region.id + '" selected="selected">' + region.name + '</option>';
                        }
                        else {
                            container.innerHTML = container.innerHTML +
                                                  '<option value="' + region.id + '">' + region.name + '</option>';
                        }
                    });
                });
            }
        }
    }
}