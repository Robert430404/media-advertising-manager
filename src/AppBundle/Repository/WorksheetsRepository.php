<?php

namespace AppBundle\Repository;

use Carbon\Carbon;
use \Doctrine\ORM\EntityRepository;

/**
 * WorksheetsRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class WorksheetsRepository extends EntityRepository
{
    /**
     * Retrives all worksheet data inside of the DB joining it in.
     *
     * @param $campaignId
     * @return array
     */
    public function findAllWorksheetsWithData(int $campaignId): array
    {
        $query = $this->getEntityManager()
            ->createQuery('SELECT w.id as id, ' .
                                 'w.name as name, ' .
                                 'w.weekInformation as weekInfo, ' .
                                 'c.flightStartDate, ' .
                                 'c.flightEndDate, ' .
                                 'c.flightLength, ' .
                                 'c.name as campName, ' .
                                 'o.name as orgName, ' .
                                 's.name as spotType, ' .
                                 'r.name as region ' .
                          'FROM AppBundle:Worksheets w ' .
                              'JOIN AppBundle:SpotTypes s ' .
                                  'WITH w.spotTypeId = s.id ' .
                              'JOIN AppBundle:Campaigns c ' .
                                  'WITH w.campaignId = c.id ' .
                              'JOIN AppBundle:Organizations o ' .
                                  'WITH w.organizationId = o.id ' .
                              'JOIN AppBundle:Regions r ' .
                                  'WITH c.regionId = r.id ' .
                          'WHERE w.campaignId = ' . $campaignId);

        $data = $query->getResult();

        return $data;
    }

    /**
     * Formats the worksheet data for display on the front end
     *
     * @param $worksheets
     * @return array
     */
    public function formatWorksheetData(array $worksheets): array
    {
        foreach ($worksheets as $key => $worksheet) {
            $programs  = $this
                ->getEntityManager()
                ->getRepository('AppBundle:Programs')
                ->findByWorksheetId($worksheet['id']);
            $startDate = Carbon::createFromTimestamp($worksheet['flightStartDate']->format('U'));

            $worksheets[$key]['programs'] = $programs;
            $worksheets[$key]['weekInfo'] = json_decode($worksheet['weekInfo']);

            if ($startDate->format('D') !== 'Mon') {
                $startDate = Carbon::createFromTimestamp(strtotime('previous monday', strtotime($startDate)));
            }

            $worksheets[$key]['flightStartDate'] = $startDate;
        }

        return $worksheets;
    }
}
