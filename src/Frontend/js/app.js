/**
 * Waits for DOM content to be fully loaded and ready, and then
 * instantiates instances of all view objects so events can
 * be initialized
 */
document.addEventListener('DOMContentLoaded', function () {
    new View();
    new ViewOrganizations();
    new ViewCampaigns();
    new ViewNavigation();
    new ViewWorksheets();
    new ViewSpotTypes();
    new ViewRegions();
    new ViewInvoices();
}, false);