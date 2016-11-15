class ViewNavigation {
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