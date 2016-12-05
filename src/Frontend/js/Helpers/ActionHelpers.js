/**
 * ActionHelpers Class
 *
 * Contains all logic for functions that add additional functionality to actions
 * taken on the entities for data. (DELETE, UPDATE, EDIT, etc...)
 */
class ActionHelpers {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.confirmAction();
    }

    /**
     * When a delete action is taken, this puts up a confirmation box
     * before the action is persisted
     *
     * @param selector
     * @param message
     * @return void
     */
    confirmAction(selector, message) {
        const buttons = document.querySelectorAll(selector);

        if (buttons) {
            buttons.forEach( function (button) {
                button.onclick = function (clicked) {
                    clicked.preventDefault();

                    const link         = button.href,
                          confirmation = confirm(message);

                    if (confirmation) {
                        window.location = link;
                    }
                };
            });
        }
    }

    /**
     * Toggles The Modal For The Dashboard
     *
     * @param overlay
     * @param button
     * @param close
     * @param form
     * @param endpoint
     * @return void
     */
    loadDashboardModal(overlay, button, close, form, endpoint) {
        const object  = this;

        button.onclick = function () {
            overlay.style.display = 'block';
        };

        close.onclick = function () {
            overlay.style.display = 'none';
        };

        form.onsubmit = function (submitted) {
            submitted.preventDefault();

            const data = AjaxHelpers.serialize(form);

            object.AjaxHelpers.postCall(endpoint, data).then(function (resp) {
                const formClasses = form.classList;

                if (resp.success == true) {
                    form.reset();
                    formClasses.add('successful');
                    object.refreshOrganizations();

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

    /**
     * This checks the type of fields being sent and if it meets a certain
     * criteria. A boolean value is returned, use in the serialize function
     *
     * @param field
     * @returns {boolean}
     */
    static fieldTypeCheck(field) {
        let type = false;

        if (field.name &&
            !field.disabled &&
            field.type != 'file' &&
            field.type != 'reset' &&
            field.type != 'submit' &&
            field.type != 'button') {
            type = true;
        }

        return type;
    }
}