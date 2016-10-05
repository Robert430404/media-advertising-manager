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
     * @param integer $organization_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/{organization_id}", name="region")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $organization_id)
    {
        $organization = $this->getDoctrine()
            ->getRepository('AppBundle:Organizations')
            ->find($organization_id);
        $regions = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->findByOrganizationId($organization_id);

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
     * @param integer $region_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/delete/{region_id}", name="region-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $region_id)
    {
        $region = $this->getDoctrine()
            ->getRepository('AppBundle:Regions')
            ->find($region_id);
        $organization_id = $region->getOrganizationId();

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->remove($region);
        $orm->flush();

        return $this->redirect('/regions/' . $organization_id, 302);
    }
}
