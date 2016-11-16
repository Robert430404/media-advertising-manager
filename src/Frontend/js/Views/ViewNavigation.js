/**
 * ViewNavigation Class
 *
 * Contains all logic that interacts with the navigation in the view
 */
class ViewNavigation {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     */
    constructor() {
        this.navigationToggle();
    }

    /**
     * This toggles the side menu into and out of visibility
     * when you click on the hamburger
     */
    navigationToggle() {
        var hamburger = document.querySelector('.hamburger');

        hamburger.onclick = function () {
            var masthead  = document.querySelector('.masthead');
            var classList = masthead.classList;

            classList.toggle('show');
        }
    }
}