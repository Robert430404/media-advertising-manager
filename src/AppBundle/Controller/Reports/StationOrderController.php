<?php

namespace AppBundle\Controller\Reports;

use DatePeriod;
use DateInterval;
use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\SecurityBundle\Tests\Functional\Bundle\AclBundle\Entity\Car;
use Symfony\Component\HttpFoundation\Request;

class StationOrderController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/reports/station-order/{campaignId}", name="generate-order")
     * @Method({"GET"})
     */
    public function pdfAction(Request $request, $campaignId)
    {
        $monthlyTotals = [];
        $worksheets    = $this->getDoctrine()
                              ->getRepository('AppBundle:Worksheets')
                              ->findAllWorksheetsWithData($campaignId);
        $campaign      = $this->getDoctrine()
                              ->getRepository('AppBundle:Campaigns')
                              ->find($campaignId);
        $spotTypes     = $this->getDoctrine()
                              ->getRepository('AppBundle:SpotTypes')
                              ->findAll();

        foreach ($worksheets as $key => $worksheet) {
            $programs = $this->getDoctrine()
                             ->getRepository('AppBundle:Programs')
                             ->findByWorksheetId($worksheet['id']);

            $worksheets[$key]['programs'] = $programs;
            $worksheets[$key]['weekInfo'] = json_decode($worksheet['weekInfo']);
            $starTimeStamp                = $worksheet['flightStartDate']->format('U');
            $startDate                    = Carbon::createFromTimestamp($starTimeStamp);

            if ($startDate->format('D') !== 'Mon') {
                $starTimeStamp = strtotime('previous monday', strtotime($startDate));
                $startDate     = Carbon::createFromTimestamp($starTimeStamp);
            }

            $worksheets[$key]['flightStartDate'] = $startDate;
        }

        foreach ($worksheets as $key => $worksheet) {
            $startDate     = Carbon::createFromTimestamp($worksheet['flightStartDate']->format('U'));
            $endDate       = Carbon::createFromTimestamp($worksheet['flightEndDate']->format('U'));
            $interval      = DateInterval::createFromDateString('1 day');
            $period        = new DatePeriod($startDate, $interval, $endDate);
            $totalDays     = $startDate->diffInDays($endDate);
            $totalSpots    = array_sum((array)$worksheet['weekInfo']);
            $dayCount      = $totalSpots / $totalDays;
            $monthlyTotals = [];

            foreach ($period as $keyTwo => $date) {
                if (isset($monthlyTotals[$date->format('M')])) {
                    $monthlyTotals[$date->format('M')] = $monthlyTotals[$date->format('M')] + $dayCount;
                } else {
                    $monthlyTotals[$date->format('M')] = $dayCount;
                }
            }
        }

        return $this->render('reports/stationOrder.html.twig', [
            'worksheets'     => $worksheets,
            'campaign'       => $campaign,
            'spot_types'     => $spotTypes,
            'monthly_totals' => $monthlyTotals,
        ]);
    }
}