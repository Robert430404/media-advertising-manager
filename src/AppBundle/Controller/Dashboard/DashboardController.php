<?php

namespace AppBundle\Controller\Dashboard;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class DashboardController extends Controller
{
    /**
     * This shows the applications dashboard
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/", name="dashboard")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();
        $spotTypes     = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();
        $regions       = [];

        foreach ($organizations as $key => $organization) {
            $orgId         = $organization->getId();
            $regions[$key] = $this->getDoctrine()->getRepository('AppBundle:Regions')->findByOrganizationId($orgId);
        }

        return $this->render('dashboard/index.html.twig', [
            'organizations' => $organizations,
            'regions'       => $regions,
            'types'         => $spotTypes,
        ]);
    }
}
