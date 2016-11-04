<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\SpotTypes;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class SpotTypeController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/spot-types", name="spot-type")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $types = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();

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
        $orm  = $this->get('doctrine')->getManager();

        $type->setName($data['spot_type_name']);
        $type->setCreatedAt(Carbon::now());
        $type->setUpdatedAt(Carbon::now());

        $orm->persist($type);
        $orm->flush();

        return $this->redirectToRoute('spot-type');
    }

    /**
     * Deletes the selected spot type in the database
     *
     * @param Request $request
     * @param $spotId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/spot-types/delete/{spotId}", name="spot-type-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $spotId)
    {
        $type = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->find($spotId);
        $orm  = $this->get('doctrine')->getManager();

        $orm->remove($type);
        $orm->flush();

        return $this->redirectToRoute('spot-type');
    }

    /**
     * Edits the selected spot type in the database
     *
     * @param Request $request
     * @param $spotId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/spot-types/edit/{spotId}", name="spot-type-edit")
     * @Method({"GET"})
     */
    public function editAction(Request $request, $spotId)
    {
        $type = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->find($spotId);

        return $this->render('dashboard/spot-type/edit.html.twig', [
            'type' => $type,
        ]);
    }

    /**
     * Updates the selected spot type in the database
     *
     * @param Request $request
     * @param $spotId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/spot-types/update/{spotId}", name="spot-type-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $spotId)
    {
        $data = $request->request->all();
        $orm  = $this->getDoctrine()->getManager();
        $type = $orm->getRepository('AppBundle:SpotTypes')->find($spotId);

        $type->setName($data['spot_type_name']);
        $type->setUpdatedAt(Carbon::now());

        $orm->flush();

        return $this->redirect('/spot-types/edit/' . $spotId);
    }
}
