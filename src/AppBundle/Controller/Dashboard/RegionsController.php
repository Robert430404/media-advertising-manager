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
     * @param integer $organizationId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/{organizationId}", name="region")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $organizationId)
    {
        $organization = $this->getDoctrine()
            ->getRepository('AppBundle:Organizations')
            ->find($organizationId);
        $regions = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->findByOrganizationId($organizationId);

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
     * @Route("/regions/add", name="region-add")
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

        return $this->redirect('/regions/' . $data['organization_id'], 302);
    }

    /**
     * @param Request $request
     * @param integer $regionId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/delete/{regionId}", name="region-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $regionId)
    {
        $region = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->find($regionId);
        $organizationId = $region->getOrganizationId();

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->remove($region);
        $orm->flush();

        return $this->redirect('/regions/' . $organizationId, 302);
    }
}
