class ViewOrganizations {
    constructor() {
        $.views.settings.delimiters('{$','$}');

        this.callOrganizationLoad();

        this.regions = new Regions();
    }

    callOrganizationLoad() {
        var object = this;
        var template = $.templates('Name {$:[0]$}');

        $('.organization-list li label').click(function () {
            var organization = $(this).attr('data-id');

            object.regions.loadRegionData(organization).then(function (resp) {
                var html = template.render(resp);

                console.log(html);
            });
        });
    }
}