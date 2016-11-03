<?php

namespace AppBundle\Controller\Dashboard;

use AppBundle\Entity\Campaigns;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CampaignsController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns", name="campaigns")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $campaigns = $this->getDoctrine()
            ->getRepository('AppBundle:Campaigns')
            ->findAllCampaignsWithOrganization();
        $organizations = $this->getDoctrine()
            ->getRepository('AppBundle:Organizations')
            ->findAll();

        return $this->render('dashboard/campaigns/index.html.twig', [
            'campaigns' => $campaigns,
            'organizations' => $organizations,
        ]);
    }

    /**
     * Inserts the new campaign in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/campaigns/add", name="campaigns-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data = $request->request->all();
        $start = Carbon::parse($data['flight_start']);
        $end = Carbon::parse($data['flight_end']);

        $campaign = new Campaigns();
        $campaign->setName($data['campaign_name']);
        $campaign->setOrganizationId($data['campaign_organization']);
        $campaign->setRegionId($data['campaign_region']);
        $campaign->setFlightStartDate($start);
        $campaign->setFlightEndDate($end);
        $campaign->setFlightLength((int)$data['flight_length']);
        $campaign->setCreatedAt(Carbon::now());
        $campaign->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getManager();
        $orm->persist($campaign);
        $orm->flush();

        return $this->redirectToRoute('campaigns');
    }

    /**
     * Deletes the selected campaign from the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/campaigns/delete/{campaignId}", name="campaign-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $campaignId)
    {
        $campaign = $this->getDoctrine()
            ->getRepository('AppBundle:Campaigns')
            ->find($campaignId);
        $worksheets = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->findByCampaignId($campaignId);
        $worksheetIds = [];

        foreach ($worksheets as $key => $worksheet) {
            $worksheetIds[$key] = $worksheet->getId();
        }

        $programs = $this->getDoctrine()
            ->getRepository('AppBundle:Programs')
            ->findByWorksheetId($worksheetIds);

        $orm = $this->get('doctrine')->getManager();
        $orm->remove($campaign);

        foreach ($worksheets as $worksheet) {
            $orm->remove($worksheet);
        }

        foreach ($programs as $program) {
            $orm->remove($program);
        }

        $orm->flush();

        return $this->redirectToRoute('campaigns');
    }
}
