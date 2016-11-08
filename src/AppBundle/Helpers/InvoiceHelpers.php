<?php

namespace AppBundle\Helpers;

class InvoiceHelpers
{
    /**
     * InvoiceHelpers constructor.
     */
    public function __construct()
    {
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

                foreach ($fileData[$key] as $keyTWo => $set) {
                    if (empty($set) || $set == "\n" || $set == "\r") {
                        unset($fileData[$key][$keyTWo]);
                    }
                }

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
     * Filters the data down to the spot data with the first array in the set being the time frame data
     *
     * @param $fileData
     * @return array
     */
    public function getSpotDataWithDateTime($fileData)
    {
        $indexed = [];
        $associative = [];
        $assIndex = 0;
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
        array_values($indexed);

        // Formats Indexed Array To Associative Array
        foreach ($indexed as $key => $array) {
            foreach ($array as $keyTwo => $inner) {
                if ($inner[0] === '41') {
                    $days = explode(' ', $inner[2]);

                    foreach ($days as $keyThree => $day) {
                        if (empty($day)) {
                            unset($days[$keyThree]);
                        }
                    }

                    $associative[$assIndex]['dateInformation']['id']         = $keyTwo;
                    $associative[$assIndex]['dateInformation']['order']      = (int)$inner[1];
                    $associative[$assIndex]['dateInformation']['days']       = $days;
                    $associative[$assIndex]['dateInformation']['startTime']  = $inner[3];
                    $associative[$assIndex]['dateInformation']['endTime']    = $inner[4];
                    $associative[$assIndex]['dateInformation']['spotPrice']  = (int)$inner[5];
                    $associative[$assIndex]['dateInformation']['totalSpots'] = (int)$inner[6];
                    $associative[$assIndex]['dateInformation']['startDate']  = $inner[7];
                    $associative[$assIndex]['dateInformation']['endDate']    = $inner[8];
                }

                if ($inner[0] === '51') {
                    $associative[$assIndex]['spotInformation' . $keyTwo]['id']         = $keyTwo;
                    $associative[$assIndex]['spotInformation' . $keyTwo]['unsure_1']   = $inner[1];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['dateRan']    = $inner[2];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['unsure_2']   = (int)$inner[3];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['timeRan']    = $inner[4];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['spotLength'] = (int)$inner[5];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['spotName']   = $inner[6];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['spotPrice']  = (int)$inner[7];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['unsure_3']   = $inner[8];
                    $associative[$assIndex]['spotInformation' . $keyTwo]['unsure_4']   = $inner[9];
                }
            }
            $assIndex++;
        }

        var_dump($associative);

        return $indexed;
    }
}