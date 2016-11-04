<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\Regions;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

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
        $organization = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($organizationId);
        $regions      = $this->getDoctrine()->getRepository('AppBundle:Regions')->findByOrganizationId($organizationId);

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
        $data   = $request->request->all();
        $orm    = $this->getDoctrine()->getManager();
        $region = new Regions();

        $region->setName($data['region_name']);
        $region->setOrganizationId($data['organization_id']);
        $region->setCreatedAt(Carbon::now());
        $region->setUpdatedAt(Carbon::now());

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
        $region         = $this->getDoctrine()->getRepository('AppBundle:Regions')->find($regionId);
        $organizationId = $region->getOrganizationId();
        $orm            = $this->getDoctrine()->getManager();

        $orm->remove($region);
        $orm->flush();

        return $this->redirect('/regions/' . $organizationId, 302);
    }

    /**
     * @param Request $request
     * @param integer $regionId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/edit/{regionId}", name="region-edit")
     * @Method({"GET"})
     */
    public function editAction(Request $request, $regionId)
    {
        $region         = $this->getDoctrine()->getRepository('AppBundle:Regions')->find($regionId);
        $organizationId = $region->getOrganizationId();
        $organization   = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($organizationId);

        return $this->render('dashboard/regions/edit.html.twig', [
            'organization' => $organization,
            'region' => $region,
        ]);
    }

    /**
     * @param Request $request
     * @param integer $regionId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/regions/update/{regionId}", name="region-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $regionId)
    {
        $data   = $request->request->all();
        $orm    = $this->getDoctrine()->getManager();
        $region = $orm->getRepository('AppBundle:Regions')->find($regionId);

        $region->setName($data['region_name']);
        $region->setUpdatedAt(Carbon::now());

        $orm->flush();

        return $this->redirect('/regions/edit/' . $regionId);
    }
}
