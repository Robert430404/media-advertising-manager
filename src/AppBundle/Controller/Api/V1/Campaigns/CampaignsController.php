<?php

namespace AppBundle\Controller\Api\V1\Campaigns;

use Carbon\Carbon;
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
}
