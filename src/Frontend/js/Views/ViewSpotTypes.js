/**
 * ViewSpotTypes Class
 *
 * Contains all logic that interacts with spot types in the view
 */
class ViewSpotTypes {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.AjaxHelpers     = new AjaxHelpers();
        this.SpotTypeOverlay = document.querySelector('.spot-types-overlay');

        if (this.SpotTypeOverlay) {
            this.createSpotTypeFromDashboard();
        }
    }

    /**
     * Brings the create spot type form into view and persists the new
     * spot type on the forms submission
     *
     * Controls the modals display and sends the data off in an AJAX
     * call to get persisted into the database
     */
    createSpotTypeFromDashboard() {
        var object   = this;
        var overlay  = document.querySelector('.spot-types-overlay');
        var button   = document.querySelector('.dash-create-spot-types-button');
        var close    = overlay.querySelector('.close');
        var form     = overlay.querySelector('form');
        var endpoint = '/api/v1/spot-types/new';

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