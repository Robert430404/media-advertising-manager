<?php

namespace AppBundle\Controller\Dashboard;

use AppBundle\Entity\SpotTypes;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SpotTypeController extends Controller
{
    /**
     * @param Request $request
     * @param integer $organization
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/spot-types", name="spot-type")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $types = $this->getDoctrine()
            ->getRepository('AppBundle:SpotTypes')
            ->findAll();

        return $this->render('dashboard/spot-type/index.html.twig', [
            'types' => $types
        ]);
    }

    /**
     * Inserts the new spot type in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/spot-types/add", name="spot-type-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data = $request->request->all();

        $type = new SpotTypes();
        $type->setName($data['spot_type_name']);
        $type->setCreatedAt(Carbon::now());
        $type->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($type);
        $orm->flush();

        return $this->redirectToRoute('spot-type');
    }

    /**
     * Deletes the selected spot type in the database
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/spot-types/delete/{spot_id}", name="spot-type-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $spot_id)
    {
        $type = $this->getDoctrine()
            ->getRepository('AppBundle:SpotTypes')
            ->find($spot_id);

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->remove($type);
        $orm->flush();

        return $this->redirectToRoute('spot-type');
    }
}