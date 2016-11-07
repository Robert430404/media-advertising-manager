class ActionHelpers {
    constructor() {
        this.confirmDelete();
    }

    confirmDelete() {
        $('a.delete-button').click(function (e) {
            e.preventDefault();
            var link = $(this).attr('href');
            var confirmation = confirm('Do you really want to delete this?');

            if (confirmation) {
                window.location = link;
            }
        });
    }
}