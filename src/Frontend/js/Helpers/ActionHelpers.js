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
     */
    confirmAction(selector, message) {
        var buttons = document.querySelectorAll(selector);

        buttons.forEach( function (button) {
            button.onclick = function (clicked) {
                clicked.preventDefault();

                var link         = button.href;
                var confirmation = confirm(message);

                if (confirmation) {
                    window.location = link;
                }
            };
        });
    }

    /**
     * This checks the type of fields being sent and if it meets a certain
     * criteria. A boolean value is returned, use in the serialize function
     *
     * @param field
     * @returns {boolean}
     */
    fieldTypeCheck(field) {
        var type = false;

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