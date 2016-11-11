<?php

namespace AppBundle\Controller\Api\V1;

use Carbon\Carbon;
use AppBundle\Entity\Regions;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class RegionsController extends Controller
{
    /**
     * Returns a list of regions in JSON based upon organization ID
     *
     * @param Request $request
     * @param integer $organization
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/regions/{organization}", name="api-region")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $organization)
    {
        $data         = [];
        $organization = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($organization);
        $regions      = $this->getDoctrine()->getRepository('AppBundle:Regions')->findByOrganizationId($organization);

        foreach ($regions as $key => $region) {
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

    /**
     * Persists the new region in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/regions/new", name="api-region-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $region    = new Regions();
        $data      = $request->request->all();
        $validator = $this->get('validator');
        $orm       = $this->get('doctrine')->getManager();

        $region->setName($data['region_name']);
        $region->setOrganizationId($data['organization_id']);
        $region->setCreatedAt(Carbon::now());
        $region->setUpdatedAt(Carbon::now());

        $errors    = $validator->validate($region);

        if (count($errors) > 0) {
            $response = [
                'success' => false,
                'error'   => (string)$errors,
            ];

            return $this->json($response);
        }

        $orm->persist($region);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
