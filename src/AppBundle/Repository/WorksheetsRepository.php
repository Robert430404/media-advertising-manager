<?php

namespace AppBundle\Repository;

/**
 * WorksheetsRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class WorksheetsRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * @param $campaignId
     * @return array
     */
    public function findAllWorksheetsWithData($campaignId)
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
}
