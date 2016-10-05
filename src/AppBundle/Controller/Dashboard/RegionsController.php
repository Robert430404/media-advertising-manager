<?php

namespace AppBundle\Controller\Dashboard;

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
     * @Route("/region/{organization}", name="region")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $organization)
    {
        $regions = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->findByOrganizationId($organization);

        return $this->render('dashboard/regions/index.html.twig', [
            'organization' => $organization,
            'regions' => $regions
        ]);
    }

    /**
     * Inserts the new region in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/region/add", name="region-add")
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

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($region);
        $orm->flush();

        return $this->redirect('/region/' . $data['organization_id'], 302);
    }
}
