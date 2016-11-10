<?php

namespace AppBundle\Controller\Api\V1;

use Carbon\Carbon;
use AppBundle\Entity\Campaigns;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CampaignsController extends Controller
{
    /**
     * Returns a JSON list of all campaigns by region
     *
     * @param Request $request
     * @param integer $regionId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/campaigns/{regionId}", name="api-campaigns")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $regionId)
    {
        $data      = [];
        $campaigns = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->findByRegionId($regionId);

        foreach ($campaigns as $key => $campaign) {
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
     * Persists the provided campaign into the database and then returns
     * a success or fail response based upon the action
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/campaigns/new", name="api-campaign-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $campaign  = new Campaigns();
        $data      = $request->request->all();
        $start     = Carbon::parse($data['flight_start']);
        $end       = Carbon::parse($data['flight_end']);
        $validator = $this->get('validator');
        $errors    = $validator->validate($campaign);
        $orm       = $this->get('doctrine')->getManager();

        $campaign->setName($data['campaign_name']);
        $campaign->setOrganizationId($data['campaign_organization']);
        $campaign->setRegionId($data['campaign_region']);
        $campaign->setFlightStartDate($start);
        $campaign->setFlightEndDate($end);
        $campaign->setFlightLength((int)$data['flight_length']);
        $campaign->setCreatedAt(Carbon::now());
        $campaign->setUpdatedAt(Carbon::now());

        if (count($errors) > 0) {
            $response = [
                'success' => false,
                'error'   => (string)$errors,
            ];

            return $this->json($response);
        }

        $orm->persist($campaign);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
