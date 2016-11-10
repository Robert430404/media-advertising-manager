<?php

namespace AppBundle\Helpers;

use Carbon\Carbon;
use Doctrine\ORM\EntityManager;

class InvoiceDataHelpers
{
    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * InvoiceDataHelpers constructor.
     *
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * Structures the data into an indexed array for normalization
     *
     * @param $fileData
     * @return array
     */
    public function structureData($fileData)
    {
        $indexed = [];
        $tempKey = 0;

        // Structures Data Into Useable Structure
        foreach ($fileData as $key => $file) {
            if (!empty($file[0])) {
                if ($file[0] === '41') { // 41: Key For Time Frame Information In Invoice Files
                    $tempKey = $key; // Sets Data Parent Key
                    $indexed[$tempKey][$key] = $file;
                }

                if ($file[0] === '51') { // 51: Key For Spot Information In Invoice Files
                    $indexed[$tempKey][$key] = $file;
                }
            }
        }

        // Resets Array Keys Inside Of Data
        foreach ($indexed as $key => $array) {
            $indexed[$key] = array_values($array);
        }

        return $indexed;
    }

    /**
     * Creates an associative array of the data with the correct data formats for collection
     *
     * @param $indexed
     * @return array
     */
    public function associateData($indexed)
    {
        $assocArray = [];
        $assocIndex = 0;

        // Formats Indexed Array To Associative Array
        foreach ($indexed as $key => $array) {
            foreach ($array as $keyTwo => $inner) {
                if ($inner[0] === '41') {
                    $assocArray[$assocIndex]['dateInformation']['id']         = $keyTwo;
                    $assocArray[$assocIndex]['dateInformation']['typeId']     = (int)$inner[0];
                    $assocArray[$assocIndex]['dateInformation']['order']      = (int)$inner[1];
                    $assocArray[$assocIndex]['dateInformation']['daysRan']    = $this->createDayArray($inner[2]);
                    $assocArray[$assocIndex]['dateInformation']['startTime']  = $inner[3];
                    $assocArray[$assocIndex]['dateInformation']['endTime']    = $inner[4];
                    $assocArray[$assocIndex]['dateInformation']['spotPrice']  = (int)$inner[6];
                    $assocArray[$assocIndex]['dateInformation']['totalSpots'] = (int)$inner[7];
                    $assocArray[$assocIndex]['dateInformation']['startDate']  = $this->createDateFromString($inner[8]);
                    $assocArray[$assocIndex]['dateInformation']['endDate']    = $this->createDateFromString($inner[9]);
                }

                if ($inner[0] === '51') {
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['id']         = $keyTwo;
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['typeId']     = (int)$inner[0];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['unsure_1']   = $inner[1];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['dateRan']    = $this->createDateFromString($inner[2]);
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['unsure_2']   = (int)$inner[3];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['timeRan']    = $inner[4];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['spotLength'] = (int)$inner[5];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['spotName']   = $inner[6];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['spotPrice']  = (int)$inner[7];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['unsure_3']   = $inner[15];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['unsure_4']   = $inner[16];
                    $assocArray[$assocIndex]['spotInformation' . $keyTwo]['unsure_5']   = $inner[17];
                }
            }

            $assocIndex++;
        }

        return $assocArray;
    }

    /**
     * Creates a date from the provided invoice string
     *
     * @param $string
     * @return Carbon
     */
    public function createDateFromString($string)
    {
        $dateString  = $string;
        $stringYear  = substr($dateString, 0, 2);
        $intYear     = (int)$stringYear;

        if (strlen($stringYear) < 4) {
            $currentYear = (string)date('Y');
            $startDigits = substr($currentYear, 0, 2);
            $intYear     = (int)$startDigits . $stringYear;
        }

        $intMonth    = (int)substr($dateString, 2, 2);
        $intDay      = (int)substr($dateString, 4, 2);
        $dateString  = Carbon::create($intYear, $intMonth, $intDay, 0, 0 ,0);

        return $dateString;
    }

    /**
     * Formats the day string into day array for easier processing
     *
     * @param $dayString
     * @return array
     */
    public function createDayArray($dayString)
    {
        $days = str_split($dayString);

        foreach ($days as $keyThree => $day) {
            if (empty($day) || $day === "\n" || $day === "\r" || $day === " ") {
                unset($days[$keyThree]);
            }
        }

        $days = array_values($days);

        return $days;
    }

    /**
     * Returns the total spots for all campaign worksheets with name
     * and id for manipulation
     *
     * @param $worksheets
     * @return array
     */
    public function calculateWorksheetSpotTotals($worksheets)
    {
        $counts = [];

        foreach ($worksheets as $key => $worksheet) {
            $data = json_decode($worksheet->getWeekInformation(), true);

            $counts[$key]['id']         = $key;
            $counts[$key]['name']       = $worksheet->getName();
            $counts[$key]['totalSpots'] = array_sum($data);
        }

        return $counts;
    }

    /**
     * Returns the programs associated with a worksheet in an array
     * for further use and manipulation
     *
     * @param $worksheets
     * @return array
     */
    public function getWorksheetPrograms($worksheets)
    {
        $programs = [];

        foreach ($worksheets as $key => $worksheet) {
            $program = $this->entityManager->getRepository('AppBundle:Programs')->findByWorksheetId($worksheet->getId());

            $programs[$key] = $program;
        }

        return $programs;
    }

    /**
     * Creates a data set that contains the information about spot totals
     * from the spot data provided to the function for comparison
     *
     * @param $spotData
     * @return array
     */
    public function calculateInvoiceSpotTotals($spotData)
    {
        $counts = [];

        foreach ($spotData as $key => $data) {
            if (!empty($data['dateInformation'])) {
                $counts[$key]['id']         = $key;
                $counts[$key]['name']       = 'dateInformation-' . $key;
                $counts[$key]['totalSpots'] = $data['dateInformation']['totalSpots'];
            }
        }

        return $counts;
    }
}