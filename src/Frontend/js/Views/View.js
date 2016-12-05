/**
 * View Class
 *
 * This is the "global" view class that contains initializations for
 * "global" view actions, like confirmation's and other messages
 */
class View {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.ActionHelpers = new ActionHelpers();

        this.registerDeleteConfirmation();
    }

    /**
     * Registers a delete confirmation
     *
     * @return void
     */
    registerDeleteConfirmation() {
        this.ActionHelpers.confirmAction('a.delete-button', 'Do you really want to delete this?');
    }
}