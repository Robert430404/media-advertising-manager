<?php

namespace AppBundle\Helpers;

use DateInterval;
use DatePeriod;
use Carbon\Carbon;
use Doctrine\ORM\EntityManager;

class ReportHelpers
{
    /**
     * @var EntityManager
     */
    private $doctrine;

    /**
     * ReportHelpers constructor.
     *
     * @param EntityManager $doctrine
     */
    public function __construct(EntityManager $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Formats the start dates for the worksheets so every wek begins on monday
     *
     * @param $worksheets
     * @return mixed
     */
    public function formatStartDate($worksheets)
    {
        foreach ($worksheets as $key => $worksheet) {
            $programs  = $this->doctrine->getRepository('AppBundle:Programs')->findByWorksheetId($worksheet['id']);
            $startDate = Carbon::createFromTimestamp($worksheet['flightStartDate']->format('U'));

            $worksheets[$key]['programs'] = $programs;
            $worksheets[$key]['weekInfo'] = json_decode($worksheet['weekInfo']);

            if ($startDate->format('D') !== 'Mon') {
                $trueStart  = strtotime($startDate);
                $prevMonday = strtotime('previous monday', $trueStart);
                $startDate  = Carbon::createFromTimestamp($prevMonday);
            }

            $worksheets[$key]['flightStartDate'] = $startDate;
        }

        return $worksheets;
    }

    /**
     * Formats the worksheet totals for the monthly totals on the report
     *
     * @param $worksheets
     * @return mixed
     */
    public function formatWorksheetTotals($worksheets)
    {
        foreach ($worksheets as $key => $worksheet) {
            $monthlyTotals = [];
            $startTime     = $worksheet['flightStartDate']->format('U');
            $endTime       = $worksheet['flightEndDate']->format('U');
            $startDate     = Carbon::createFromTimestamp($startTime);
            $endDate       = Carbon::createFromTimestamp($endTime);
            $interval      = DateInterval::createFromDateString('1 day');
            $period        = new DatePeriod($startDate, $interval, $endDate);
            $totalDays     = $startDate->diffInDays($endDate);
            $totalSpots    = 0;

            if (isset($worksheet['weekInfo']) && !empty($worksheet['weekInfo'])) {
                $totalSpots = array_sum((array)$worksheet['weekInfo']);
            }

            $dayCount = $totalSpots / $totalDays;

            foreach ($period as $keyTwo => $date) {
                if (isset($monthlyTotals[$date->format('M')])) {
                    $monthlyTotals[$date->format('M')] = $monthlyTotals[$date->format('M')] + $dayCount;
                } else {
                    $monthlyTotals[$date->format('M')] = $dayCount;
                }
            }

            $worksheets[$key]['monthly_totals'] = $monthlyTotals;
        }

        return $worksheets;
    }
}