<?php

namespace AppBundle\Controller\Api\V1;

use Carbon\Carbon;
use AppBundle\Entity\Organizations;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class OrganizationsController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/organizations", name="api-organizations")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $data          = [];
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();

        foreach ($organizations as $key => $organization) {
            $data[$key] = [
                'id'         => $organization->getId(),
                'name'       => $organization->getName(),
                'user_id'    => $organization->getUserId(),
                'created_at' => $organization->getCreatedAt(),
                'updated_at' => $organization->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     *
     * @Route("/api/v1/organizations/new", name="api-organizations-new")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $organization = new Organizations();
        $data         = $request->request->all();
        $user         = $this->getUser();
        $validator    = $this->get('validator');
        $errors       = $validator->validate($organization);
        $orm          = $this->get('doctrine')->getManager();

        $organization->setName($data['organization_name']);
        $organization->setUserId($user->getId());
        $organization->setCreatedAt(Carbon::now());
        $organization->setUpdatedAt(Carbon::now());

        if (count($errors) > 0) {
            $response = [
                'success' => false,
                'error'   => (string)$errors,
            ];

            return $this->json($response);
        }

        $orm->persist($organization);
        $orm->flush();

        $response = [
            'success' => true,
        ];

        return $this->json($response);
    }
}
