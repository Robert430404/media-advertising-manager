class ViewNavigation {
    constructor() {
        this.navigationToggle();
    }

    navigationToggle() {
        $('.hamburger').click(function () {
            $('body').toggleClass('add-padding');
            $('.masthead').toggleClass('show');
        });
    }
}