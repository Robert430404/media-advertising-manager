<?php

namespace AppBundle\Controller\Dashboard;

use AppBundle\Entity\Campaigns;
use AppBundle\Entity\Organizations;
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
            ->findAll();
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
        $data  = $request->request->all();
        $start = Carbon::parse($data['flight_start']);
        $end   = Carbon::parse($data['flight_end']);
        $weeks = $start->diffInWeeks($end);

        $campaign = new Campaigns();
        $campaign->setName($data['campaign_name']);
        $campaign->setOrganizationId($data['campaign_organization']);
        $campaign->setRegionId($data['campaign_region']);
        $campaign->setFlightStartDate($start);
        $campaign->setFlightEndDate($end);
        $campaign->setFlightLength($weeks);
        $campaign->setCreatedAt(Carbon::now());
        $campaign->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($campaign);
        $orm->flush();

        return $this->redirectToRoute('campaigns');
    }
}
