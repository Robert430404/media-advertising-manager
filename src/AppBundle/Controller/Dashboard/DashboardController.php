<?php

namespace AppBundle\Controller\Dashboard;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DashboardController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/", name="dashboard")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();
        $spotTypes = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();
        $regions = [];

        foreach ($organizations as $key => $organization) {
            $regions[$key] = $this->getDoctrine()
                ->getRepository('AppBundle:Regions')
                ->findByOrganizationId($organization->getId());
        }

        return $this->render('dashboard/index.html.twig', [
            'organizations' => $organizations,
            'regions' => $regions,
            'types' => $spotTypes,
        ]);
    }
}
