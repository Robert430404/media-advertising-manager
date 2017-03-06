<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\Worksheets;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class WorksheetsController
 *
 * @package AppBundle\Controller\Dashboard
 */
class WorksheetsController extends Controller
{
    /**
     * @param Request $request
     * @param $campaignId
     * @return Response
     *
     * @Route("/campaigns/worksheets/{campaignId}", name="campaign-worksheets")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, int $campaignId): Response
    {
        $orm           = $this->getDoctrine();
        $worksheetRepo = $orm->getRepository('AppBundle:Worksheets');
        $campaignRepo  = $orm->getRepository('AppBundle:Campaigns');
        $spotTypesRepo = $orm->getRepository('AppBundle:SpotTypes');
        $worksheets    = $worksheetRepo->findAllWorksheetsWithData($campaignId);
        $campaign      = $campaignRepo->find($campaignId);
        $spotTypes     = $spotTypesRepo->findAll();
        $worksheets    = $worksheetRepo->formatWorksheetData($worksheets);

        return $this->render('dashboard/worksheets/index.html.twig', [
            'worksheets' => $worksheets,
            'campaign'   => $campaign,
            'spot_types' => $spotTypes,
        ]);
    }

    /**
     * @param Request $request
     * @param $campaignId
     * @return Response
     *
     * @Route("/campaigns/worksheets/{campaignId}/add", name="campaign-worksheets-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request, int $campaignId): Response
    {
        $worksheet = $this->get('app.factories.worksheets')->create($request, new Worksheets());
        $orm       = $this->get('doctrine')->getManager();

        $orm->persist($worksheet);
        $orm->flush();

        return $this->redirect('/campaigns/worksheets/' . $campaignId);
    }

    /**
     * Deletes the selected campaign from the database
     *
     * @param $worksheetId
     * @param $campaignId
     * @return RedirectResponse
     *
     * @Route("/campaigns/worksheets/{campaignId}/delete/{worksheetId}", name="worksheet-delete")
     * @Method({"GET"})
     */
    public function deleteAction(int $worksheetId, int $campaignId): RedirectResponse
    {
        $worksheet = $this->getDoctrine()->getRepository('AppBundle:Worksheets')->find($worksheetId);
        $programs  = $this->getDoctrine()->getRepository('AppBundle:Programs')->findByWorksheetId($worksheetId);
        $orm       = $this->get('doctrine')->getManager();

        $orm->remove($worksheet);

        foreach ($programs as $program) {
            $orm->remove($program);
        }

        $orm->flush();

        return $this->redirect('/campaigns/worksheets/' . $campaignId);
    }

    /**
     * Brings up the selected campaign from the database for editing
     *
     * @param $worksheetId
     * @param $campaignId
     * @return Response
     *
     * @Route("/campaigns/worksheets/{campaignId}/edit/{worksheetId}", name="worksheet-edit")
     * @Method({"GET"})
     */
    public function editAction(int $worksheetId, int $campaignId): Response
    {
        $worksheet = $this->getDoctrine()->getRepository('AppBundle:Worksheets')->find($worksheetId);
        $campaign  = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->find($campaignId);
        $spotTypes = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();

        return $this->render('dashboard/worksheets/edit.html.twig', [
            'worksheet'  => $worksheet,
            'campaign'   => $campaign,
            'spot_types' => $spotTypes,
        ]);
    }

    /**
     * Updates the selected campaign in the database
     *
     * @param Request $request
     * @param $worksheetId
     * @param $campaignId
     * @return RedirectResponse
     *
     * @Route("/campaigns/worksheets/{campaignId}/update/{worksheetId}", name="worksheet-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, int $worksheetId, int $campaignId): RedirectResponse
    {
        $data      = $request->request->all();
        $orm       = $this->getDoctrine()->getManager();
        $worksheet = $orm->getRepository('AppBundle:Worksheets')->find($worksheetId);

        $worksheet->setName($data['worksheet_name']);
        $worksheet->setSpotTypeId($data['worksheet_spot_type']);
        $worksheet->setUpdatedAt(Carbon::now());

        $orm->flush();

        return $this->redirect('/campaigns/worksheets/' . $campaignId);
    }
}
