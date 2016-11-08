<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\Organizations;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class OrganizationsController extends Controller
{
    /**
     * Shows the base organization view
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/organizations", name="organizations")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();

        return $this->render('dashboard/organizations/index.html.twig', [
            'organizations' => $organizations
        ]);
    }

    /**
     * Inserts the new organization in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/organizations/add", name="organizations-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data         = $request->request->all();
        $user         = $this->getUser();
        $organization = new Organizations();
        $orm          = $this->get('doctrine')->getManager();

        $organization->setName($data['organization_name']);
        $organization->setUserId($user->getId());
        $organization->setCreatedAt(Carbon::now());
        $organization->setUpdatedAt(Carbon::now());

        $orm->persist($organization);
        $orm->flush();

        return $this->redirectToRoute('organizations');
    }

    /**
     * Deletes The Selected Organization And It's Associated Data
     *
     * @param Request $request
     * @param $organizationId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/organizations/delete/{organizationId}", name="organization-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $organizationId)
    {
        $organization = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($organizationId);
        $regions      = $this->getDoctrine()->getRepository('AppBundle:Regions')->findByOrganizationId($organizationId);
        $campaigns    = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->findByOrganizationId($organizationId);
        $campaignIds  = [];
        $worksheetIds = [];

        foreach ($campaigns as $key => $campaign) {
            $campaignIds[$key] = $campaign->getId();
        }

        $worksheets   = $this->getDoctrine()->getRepository('AppBundle:Worksheets')->findByCampaignId($campaignIds);

        foreach ($worksheets as $key => $worksheet) {
            $worksheetIds[$key] = $worksheet->getId();
        }

        $programs = $this->getDoctrine()->getRepository('AppBundle:Programs')->findByWorksheetId($worksheetIds);
        $orm      = $this->get('doctrine')->getManager();

        $orm->remove($organization);

        foreach ($regions as $region) {
            $orm->remove($region);
        }

        foreach ($campaigns as $campaign) {
            $orm->remove($campaign);
        }

        foreach ($worksheets as $worksheet) {
            $orm->remove($worksheet);
        }

        foreach ($programs as $program) {
            $orm->remove($program);
        }

        $orm->flush();

        return $this->redirectToRoute('organizations');
    }

    /**
     * Brings the selected organization up for editing
     *
     * @param Request $request
     * @param $organizationId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/organizations/edit/{organizationId}", name="organization-edit")
     * @Method({"GET"})
     */
    public function editAction(Request $request, $organizationId)
    {
        $organization = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($organizationId);

        return $this->render('/dashboard/organizations/edit.html.twig', [
            'organization' => $organization,
        ]);
    }

    /**
     * Updates the selected organization
     *
     * @param Request $request
     * @param $organizationId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/organizations/update/{organizationId}", name="organization-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $organizationId)
    {
        $orm = $this->getDoctrine()->getManager();
        $organization = $orm->getRepository('AppBundle:Organizations')->find($organizationId);
        $data = $request->request->all();

        $organization->setName($data['organization_name']);
        $organization->setUpdatedAt(Carbon::now());

        $orm->flush();

        return $this->redirect('/organizations/edit/' . $organizationId);
    }
}
