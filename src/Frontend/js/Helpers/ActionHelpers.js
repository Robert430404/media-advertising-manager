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
        this.AjaxHelpers = new AjaxHelpers();

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
     * @return {Promise}
     */
    loadDashboardModal(overlay, button, close, form, endpoint) {
        const object = this;

        button.onclick = () => {
            overlay.style.display = 'block';
        };

        close.onclick = () => {
            overlay.style.display = 'none';
        };

        form.onsubmit = (submitted) => {
            submitted.preventDefault();

            const data = AjaxHelpers.serialize(form);

            object.AjaxHelpers.postCall(endpoint, data).then((resp) => {
                const formClasses = form.classList;

                if (resp.success == true) {
                    form.reset();
                    formClasses.add('successful');
                    object.timeout(1500).then(() => {
                        formClasses.remove('successful');
                    });
                } else {
                    if (resp.error == 'duplicate') {
                        formClasses.add('duplicate');
                        object.timeout(1500).then(() => {
                            formClasses.remove('duplicate');
                        });
                    } else {
                        formClasses.add('failure');
                        object.timeout(1500).then(() => {
                            formClasses.remove('failure');
                        });
                    }
                }
            });
        };
    }

    /**
     * Promise Based Timeout Function
     *
     * @param duration
     * @returns {Promise}
     */
    timeout(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration);
        });
    }
}

