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
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/spot-types", name="api-spot-types")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $spotTypes = $this->getDoctrine()
            ->getRepository('AppBundle:SpotTypes')
            ->findAll();

        $data = [];

        foreach ($spotTypes as $key => $spotType) {
            $data[$key] = [
                'id' => $spotType->getId(),
                'name' => $spotType->getName(),
                'created_at' => $spotType->getCreatedAt(),
                'updated_at' => $spotType->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/spot-types/new", name="api-spot-types-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data = $request->request->all();

        $type = new SpotTypes();
        $type->setName($data['spot_type_name']);
        $type->setCreatedAt(Carbon::now());
        $type->setUpdatedAt(Carbon::now());

        $validator = $this->get('validator');
        $errors = $validator->validate($type);

        if (count($errors) > 0) {
            $error_string = (string)$errors;

            $response = [
                'success' => false,
                'error' => $error_string,
            ];

            return $this->json($response);
        }

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($type);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
