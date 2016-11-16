/**
 * ViewRegions Class
 *
 * Contains all logic that interacts with regions in the view
 */
class ViewRegions {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.AjaxHelpers   = new AjaxHelpers();
        this.RegionOverlay = document.querySelector('.regions-overlay');

        if (this.RegionOverlay) {
            this.dashboardCreateRegion()
        }
    }

    /**
     * Brings the create region form into view and persists the new
     * region on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     */
    dashboardCreateRegion() {
        var object   = this;
        var overlay  = document.querySelector('.regions-overlay');
        var button   = document.querySelector('.dash-create-regions-button');
        var close    = overlay.querySelector('.close');
        var form     = overlay.querySelector('form');
        var endpoint = '/api/v1/regions/new';

        button.onclick = function () {
            overlay.style.display = 'block';
        };

        close.onclick = function () {
            overlay.style.display = 'none';
        };

        form.onsubmit = function (submitted) {
            submitted.preventDefault();

            var data = object.AjaxHelpers.serialize(form);

            object.AjaxHelpers.postCall(endpoint, data).then(function (resp) {
                var formClasses = form.classList;

                if (resp.success == true) {
                    form.reset();
                    formClasses.add('successful');

                    setTimeout( function () {
                        formClasses.remove('successful');
                    }, 1000);
                } else {
                    formClasses.add('failure');

                    setTimeout( function () {
                        formClasses.remove('failure');
                    }, 1000);
                }
            });
        };
    }
}