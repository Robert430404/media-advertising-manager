class ViewOrganizations {
    constructor() {
        this.callOrganizationLoad();

        this.regions = new Regions();
    }

    callOrganizationLoad() {
        var object    = this;
        var targets   = document.querySelectorAll('.organization-list li label');
        var container = document.querySelector('.region-information');

        for(var i = 0; i < targets.length; i++)
        {
            targets[i].onclick = function () {
                var organization = this.dataset.id;

                object.regions
                    .loadRegionData(organization)
                    .then(function (resp) {
                        container.innerHTML = resp.markup;
                    });
            };
        }
    }
}