<?php

namespace AppBundle\Controller\Dashboard;

use AppBundle\Entity\Worksheets;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class WorksheetsController extends Controller
{
    /**
     * @param Request $request
     * @param $campaign_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/{campaign_id}", name="campaign-worksheets")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $campaign_id)
    {
        $worksheets = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->findAllWorksheetsWithData($campaign_id);
        $campaign = $this->getDoctrine()
            ->getRepository('AppBundle:Campaigns')
            ->find($campaign_id);
        $spot_types = $this->getDoctrine()
            ->getRepository('AppBundle:SpotTypes')
            ->findAll();

        foreach($worksheets as $key => $worksheet)
        {
            $programs = $this->getDoctrine()
                ->getRepository('AppBundle:Programs')
                ->findByWorksheetId($worksheet['id']);

            $worksheets[$key]['programs'] = $programs;
            $worksheets[$key]['weekInfo'] = json_decode($worksheet['weekInfo']);
        }

        return $this->render('dashboard/worksheets/index.html.twig', [
            'worksheets' => $worksheets,
            'campaign' => $campaign,
            'spot_types' => $spot_types,
        ]);
    }

    /**
     * @param Request $request
     * @param $campaign_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/{campaign_id}/add", name="campaign-worksheets-add")
     * @Method({"POST"})
     */
    public function insertAction(Request $request, $campaign_id)
    {
        $data = $request->request->all();

        $worksheet = new Worksheets();
        $worksheet->setName($data['worksheet_name']);
        $worksheet->setCampaignId($campaign_id);
        $worksheet->setOrganizationId($data['worksheet_organization']);
        $worksheet->setRegionId($data['worksheet_region']);
        $worksheet->setSpotTypeId($data['worksheet_spot_type']);
        $worksheet->setWeekInformation('none available');
        $worksheet->setCreatedAt(Carbon::now());
        $worksheet->setUpdatedAt(Carbon::now());

        $orm = $this->get('doctrine')->getEntityManager();
        $orm->persist($worksheet);
        $orm->flush();

        return $this->redirectToRoute('campaigns');
    }
}
