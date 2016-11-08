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
}