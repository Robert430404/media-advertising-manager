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
        $regions = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->findByOrganizationId($organization);

        $data = [];

        foreach ($regions as $key => $region) {
            $data[$key] = [
                'id' => $region->getId(),
                'name' => $region->getName(),
                'organization_id' => $region->getOrganizationId(),
                'created_at' => $region->getCreatedAt(),
                'updated_at' => $region->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Inserts the new region in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/regions/new", name="api-region-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data = $request->request->all();

        $region = new Regions();
        $region->setName($data['region_name']);
        $region->setOrganizationId($data['organization_id']);
        $region->setCreatedAt(Carbon::now());
        $region->setUpdatedAt(Carbon::now());

        $validator = $this->get('validator');
        $errors = $validator->validate($region);

        if (count($errors) > 0) {
            $error_string = (string)$errors;

            $response = [
                'success' => false,
                'error' => $error_string,
            ];

            return $this->json($response);
        }

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($region);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
