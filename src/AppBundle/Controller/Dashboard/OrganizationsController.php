<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\Organizations;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class OrganizationsController extends Controller
{
    /**
     * Shows the base organization view
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/organizations", name="organizations")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();

        return $this->render('dashboard/organizations/index.html.twig', [
            'organizations' => $organizations
        ]);
    }

    /**
     * Inserts the new organization in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/organizations/add", name="organizations-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data         = $request->request->all();
        $user         = $this->getUser();
        $organization = new Organizations();
        $orm          = $this->get('doctrine')->getManager();

        $organization->setName($data['organization_name']);
        $organization->setUserId($user->getId());
        $organization->setCreatedAt(Carbon::now());
        $organization->setUpdatedAt(Carbon::now());

        $orm->persist($organization);
        $orm->flush();

        return $this->redirectToRoute('organizations');
    }
}
