<?php

namespace AppBundle\Helpers;

use AppBundle\Entity\Campaigns;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManager;

class InvoiceHelpers
{
    /**
     * @var InvoiceDataHelpers
     */
    protected $invoiceDataHelpers;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * InvoiceHelpers constructor.
     *
     * @param InvoiceDataHelpers $invoiceDataHelpers
     * @param EntityManager      $entityManager
     */
    public function __construct(InvoiceDataHelpers $invoiceDataHelpers, EntityManager $entityManager)
    {
        $this->invoiceDataHelpers = $invoiceDataHelpers;
        $this->entityManager      = $entityManager;
    }

    /**
     * Returns the raw invoice data in a string for examination
     *
     * @param $files
     * @return string
     */
    public function showRawFile($files)
    {
        $fileData = '';

        foreach ($files as $file) {
            $path     = $file->getPathName();
            $size     = $file->getSize();
            $openFile = fopen($path, 'r');
            $readFile = fread($openFile, $size);
            $fileData = $readFile;
            fclose($openFile);
        }

        return $fileData;
    }

    /**
     * Formats the data from the invoice files into a monolithic array
     *
     * @param $files
     * @return mixed
     */
    public function formatFileData($files)
    {
        $fileData = [];

        foreach ($files as $file) {
            $path     = $file->getPathName();
            $size     = $file->getSize();
            $openFile = fopen($path, 'r');
            $readFile = fread($openFile, $size);
            $fileData = explode("\n", $readFile);

            foreach ($fileData as $key => $line) {
                $fileData[$key] = explode(';', $line);
                $fileData[$key] = array_values($fileData[$key]);
            }

            fclose($openFile);
        }

        return $fileData;
    }

    /**
     * Filters the file data down to the organization data
     *
     * @param $fileData
     * @return array
     */
    public function getOrganizationData($fileData)
    {
        $organizationData = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '21') { // 21: Key For Organization Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return array_values($organizationData);
    }

    /**
     * Filters the file data down to the station data
     *
     * @param $fileData
     * @return array
     */
    public function getStationData($fileData)
    {
        $stationDate = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '22') { // 22: Key For Station Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return array_values($stationDate);
    }

    /**
     * Filters the file data down to the market data
     *
     * @param $fileData
     * @return array
     */
    public function getMarketData($fileData)
    {
        $marketData = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '23') { // 23: Key For Market Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return array_values($marketData);
    }

    /**
     * Filters the file data down to the client data
     *
     * @param $fileData
     * @return array
     */
    public function getClientData($fileData)
    {
        $clientData = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '31') { // 31: Key For Client Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return array_values($clientData);
    }

    /**
     * Filters the file data down to the time frame data
     *
     * @param $fileData
     * @return array
     */
    public function getTimeFrameData($fileData)
    {
        $timeFrameData = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '41') { // 41: Key For Time Frame Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return array_values($timeFrameData);
    }

    /**
     * Filters the file data down to the spot data
     *
     * @param $fileData
     * @return array
     */
    public function getSpotData($fileData)
    {
        $spotData = array_filter($fileData, function ($data, $key) {
            if (!empty($data[0])) {
                if ($data[0] === '51') { // 51: Key For Spot Information In Invoice Files
                    return $data;
                }
            }

            return null;
        }, ARRAY_FILTER_USE_BOTH);

        return $spotData;
    }

    /**
     * Filters the data down to the spot data with the first element
     * in the child collections being the time frame data
     *
     * @param $fileData
     * @return Collection
     */
    public function getSpotDataWithDateTime($fileData)
    {
        $indexed    = $this->invoiceDataHelpers->structureData($fileData);
        $assocArray = $this->invoiceDataHelpers->associateData($indexed);
        $collection = new ArrayCollection($assocArray);

        return $collection;
    }

    /**
     * Calculates the spot totals (invalid spots and valid spots) for
     * the invoice received vs the defined campaign totals
     *
     * @param ArrayCollection $spotData
     * @param Campaigns $campaign
     * @param $threshold
     * @return array
     */
    public function calculateValidSpots(ArrayCollection $spotData, Campaigns $campaign, $threshold)
    {
        // TODO: Create algorithm that calculates spot totals against invoices once we have real data
        $counts     = [];
        $worksheets = $this->entityManager->getRepository('AppBundle:Worksheets')->findByCampaignId($campaign->getId());
        $programs   = $this->invoiceDataHelpers->getWorksheetPrograms($worksheets);
        $spotTotals = $this->invoiceDataHelpers->calculateWorksheetSpotTotals($worksheets);
        $invTotals  = $this->invoiceDataHelpers->calculateInvoiceSpotTotals($spotData);
        $campStart  = $campaign->getFlightStartDate();
        $campEnd    = $campaign->getFlightEndDate();
        $totals     = false;
        $sameCount  = false;
        $dateRange  = [];

        // Validates The Spot Totals To Make Sure Were Not Being Invoices For More/Less Spots
        if ($spotTotals === $invTotals) {
            $totals    = true;
            $sameCount = [];

            foreach ($spotTotals as $key => $total) {
                $spotTotal = $total['totalSpots'];
                $invTotal  = $invTotals[$key]['totalSpots'];

                if ($spotTotal === $invTotal) {
                    $sameCount[$key] = true;
                }
            }
        }

        // Makes Sure The Dates Match Up For The Campaign And Invoice
        foreach ($spotData as $key => $spots) {
            foreach ($spots as $keyTwo => $spot) {
                if ($keyTwo === 'dateInformation') {
                    $startDate = $spot['startDate'];
                    $endDate   = $spot['endDate'];

                    if ($campStart->format('U') <= $startDate->format('U') &&
                        $campEnd->format('U') >= $endDate->format('U')) {
                        $dateRange[$key] = true;
                    }
                }
            }
        }

        return $counts;
    }
}