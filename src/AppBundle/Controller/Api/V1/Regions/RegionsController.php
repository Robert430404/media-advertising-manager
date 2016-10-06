<?php

namespace AppBundle\Controller\Api\V1\Regions;

use AppBundle\Entity\Regions;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class RegionsController extends Controller
{
    /**
     * @param Request $request
     * @param integer $organization
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/regions/{organization}", name="api-region")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $organization)
    {
        $organization = $this->getDoctrine()
            ->getRepository('AppBundle:Organizations')
            ->find($organization);
        $regions  = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->findByOrganizationId($organization);

        $data = [];

        foreach($regions as $key => $region)
        {
            $data[$key] = [
                'id'              => $region->getId(),
                'name'            => $region->getName(),
                'organization_id' => $region->getOrganizationId(),
                'created_at'      => $region->getCreatedAt(),
                'updated_at'      => $region->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }
}
