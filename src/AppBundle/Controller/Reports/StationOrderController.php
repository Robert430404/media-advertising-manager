<?php

namespace AppBundle\Controller\Reports;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class StationOrderController extends Controller
{
    /**
     * Generates the station order from the selected campaign
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/reports/station-order/{campaignId}", name="generate-order")
     * @Method({"GET"})
     */
    public function pdfAction(Request $request, $campaignId)
    {
        $worksheets = $this->getDoctrine()->getRepository('AppBundle:Worksheets')->findAllWorksheetsWithData($campaignId);
        $campaign   = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->find($campaignId);
        $spotTypes  = $this->getDoctrine()->getRepository('AppBundle:SpotTypes')->findAll();
        $worksheets = $this->get('app.report_helpers')->formatStartDate($worksheets);
        $worksheets = $this->get('app.report_helpers')->formatWorksheetTotals($worksheets);

        return $this->render('reports/stationOrder.html.twig', [
            'worksheets'     => $worksheets,
            'campaign'       => $campaign,
            'spot_types'     => $spotTypes,
        ]);
    }
}