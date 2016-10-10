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
     * @return array
     */
    public function findAllWorksheetsWithData()
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
                                 's.name as spotType ' .
                          'FROM AppBundle:Worksheets w ' .
                              'JOIN AppBundle:SpotTypes s ' .
                                  'WITH w.spotTypeId = s.id ' .
                              'JOIN AppBundle:Campaigns c ' .
                                  'WITH w.campaignId = c.id ' .
                              'JOIN AppBundle:Organizations o ' .
                                  'WHERE w.organizationId = o.id');
        $data = $query->getResult();

        return $data;
    }
}
