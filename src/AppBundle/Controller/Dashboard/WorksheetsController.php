<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use AppBundle\Entity\Worksheets;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class WorksheetsController extends Controller
{
    /**
     * @param Request $request
     * @param $campaignId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/{campaignId}", name="campaign-worksheets")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $campaignId)
    {
        $worksheets = $this->getDoctrine()->getRepository('AppBundle:Worksheets')->findAllWorksheetsWithData($campaignId);
        $campaign   = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->find($campaignId);
        $spotTypes  = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();

        foreach ($worksheets as $key => $worksheet) {
            $programs  = $this->getDoctrine()->getRepository('AppBundle:Programs')->findByWorksheetId($worksheet['id']);
            $startDate = Carbon::createFromTimestamp($worksheet['flightStartDate']->format('U'));

            $worksheets[$key]['programs'] = $programs;
            $worksheets[$key]['weekInfo'] = json_decode($worksheet['weekInfo']);

            if ($startDate->format('D') !== 'Mon') {
                $startDate = Carbon::createFromTimestamp(strtotime('previous monday', strtotime($startDate)));
            }

            $worksheets[$key]['flightStartDate'] = $startDate;
        }

        return $this->render('dashboard/worksheets/index.html.twig', [
            'worksheets' => $worksheets,
            'campaign'   => $campaign,
            'spot_types' => $spotTypes,
        ]);
    }

    /**
     * @param Request $request
     * @param $campaignId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/{campaignId}/add", name="campaign-worksheets-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request, $campaignId)
    {
        $data      = $request->request->all();
        $worksheet = new Worksheets();
        $orm       = $this->get('doctrine')->getManager();

        $worksheet->setName($data['worksheet_name']);
        $worksheet->setCampaignId($campaignId);
        $worksheet->setOrganizationId($data['worksheet_organization']);
        $worksheet->setRegionId($data['worksheet_region']);
        $worksheet->setSpotTypeId($data['worksheet_spot_type']);
        $worksheet->setWeekInformation('none available');
        $worksheet->setCreatedAt(Carbon::now());
        $worksheet->setUpdatedAt(Carbon::now());

        $orm->persist($worksheet);
        $orm->flush();

        return $this->redirect('/campaigns/worksheets/' . $campaignId);
    }

    /**
     * Deletes the selected campaign from the database
     *
     * @param Request $request
     * @param $worksheetId
     * @param $campaignId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/campaigns/worksheets/{campaignId}/delete/{worksheetId}", name="worksheet-delete")
     * @Method({"GET"})
     */
    public function deleteAction(Request $request, $worksheetId, $campaignId)
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
     * @param Request $request
     * @param $worksheetId
     * @param $campaignId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/campaigns/worksheets/{campaignId}/edit/{worksheetId}", name="worksheet-edit")
     * @Method({"GET"})
     */
    public function editAction(Request $request, $worksheetId, $campaignId)
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
     * Brings up the selected campaign from the database for editing
     *
     * @param Request $request
     * @param $worksheetId
     * @param $campaignId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/campaigns/worksheets/{campaignId}/update/{worksheetId}", name="worksheet-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $worksheetId, $campaignId)
    {
        $data      = $request->request->all();
        $orm       = $this->getDoctrine()->getManager();
        $worksheet = $orm->getRepository('AppBundle:Worksheets')->find($worksheetId);

        $worksheet->setName($data['worksheet_name']);
        $worksheet->setCampaignId($campaignId);
        $worksheet->setOrganizationId($data['worksheet_organization']);
        $worksheet->setRegionId($data['worksheet_region']);
        $worksheet->setSpotTypeId($data['worksheet_spot_type']);
        $worksheet->setWeekInformation('none available');
        $worksheet->setUpdatedAt(Carbon::now());

        $orm->flush();

        return $this->redirect('/campaigns/worksheets/' . $campaignId . '/edit/' . $worksheetId);
    }
}
