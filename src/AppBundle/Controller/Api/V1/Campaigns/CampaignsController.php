<?php

namespace AppBundle\Controller\Api\V1\Campaigns;

use Carbon\Carbon;
use AppBundle\Entity\Campaigns;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CampaignsController extends Controller
{
    /**
     * @param Request $request
     * @param integer $region_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/campaigns/{region_id}", name="api-campaigns")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $region_id)
    {
        $campaigns = $this->getDoctrine()
            ->getRepository('AppBundle:Campaigns')
            ->findByRegionId($region_id);

        $data = [];

        foreach($campaigns as $key => $campaign)
        {
            $data[$key] = [
                'id'              => $campaign->getId(),
                'name'            => $campaign->getName(),
                'organization_id' => $campaign->getOrganizationId(),
                'created_at'      => $campaign->getCreatedAt(),
                'updated_at'      => $campaign->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/campaigns/new", name="api-campaign-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data  = $request->request->all();
        $start = Carbon::parse($data['flight_start']);
        $end   = Carbon::parse($data['flight_end']);

        $campaign = new Campaigns();
        $campaign->setName($data['campaign_name']);
        $campaign->setOrganizationId($data['campaign_organization']);
        $campaign->setRegionId($data['campaign_region']);
        $campaign->setFlightStartDate($start);
        $campaign->setFlightEndDate($end);
        $campaign->setFlightLength((int)$data['flight_length']);
        $campaign->setCreatedAt(Carbon::now());
        $campaign->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($campaign);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
