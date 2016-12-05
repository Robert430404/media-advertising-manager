/**
 * ViewNavigation Class
 *
 * Contains all logic that interacts with the navigation in the view
 */
class ViewNavigation {
    /**
     * Registers all dependencies to the object, and creates checks
     * before executing the setup functions on this object
     *
     * @return void
     */
    constructor() {
        this.navigationToggle();
    }

    /**
     * This toggles the side menu into and out of visibility
     * when you click on the hamburger
     *
     * @return void
     */
    navigationToggle() {
        const hamburger = document.querySelector('.hamburger');

        hamburger.onclick = function () {
            const masthead  = document.querySelector('.masthead'),
                  classList = masthead.classList;

            classList.toggle('show');
        }
    }
}