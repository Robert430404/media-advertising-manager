<?php

namespace AppBundle\Controller\Api\V1;

use Carbon\Carbon;
use AppBundle\Entity\SpotTypes;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SpotTypesController extends Controller
{
    /**
     * Returns a full JSON list of Spot Types
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/spot-types", name="api-spot-types")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $data      = [];
        $spotTypes = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();

        foreach ($spotTypes as $key => $spotType) {
            $data[$key] = [
                'id'         => $spotType->getId(),
                'name'       => $spotType->getName(),
                'created_at' => $spotType->getCreatedAt(),
                'updated_at' => $spotType->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Persists the new Spot Type into the database from the provided
     * information
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/spot-types/new", name="api-spot-types-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $type      = new SpotTypes();
        $data      = $request->request->all();
        $validator = $this->get('validator');
        $orm       = $this->get('doctrine')->getManager();

        $type->setName($data['spot_type_name']);
        $type->setCreatedAt(Carbon::now());
        $type->setUpdatedAt(Carbon::now());

        $errors    = $validator->validate($type);

        if (count($errors) > 0) {
            $response = [
                'success' => false,
                'error'   => (string)$errors,
            ];

            return $this->json($response);
        }

        $orm->persist($type);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
