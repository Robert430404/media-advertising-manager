<?php

namespace AppBundle\Services\Mappers;

use AppBundle\Entity\Worksheets;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class WorksheetMapper
 *
 * @package AppBundle\Services\Mappers
 */
class WorksheetMapper
{
    /**
     * @var Request
     */
    private $request;

    /**
     * @var Worksheets
     */
    private $entity;

    /**
     * WorksheetMapper constructor.
     *
     * @param Request $request
     */
    public function __construct(Request $request, Worksheets $entity)
    {
        $this->request = $request;
        $this->entity  = $entity;
    }

    /**
     * Returns the mapped entity to the factory
     *
     * @return Worksheets
     */
    public function getMappedEntity(): Worksheets
    {
        return $this->mapRequest();
    }

    /**
     * Maps the data to the entity
     *
     * @return Worksheets
     */
    private function mapRequest(): Worksheets
    {
        $this->entity->setName($this->request->request->get('worksheet_name'));
        $this->entity->setCampaignId($this->request->attributes->get('campaignId'));
        $this->entity->setOrganizationId($this->request->request->get('worksheet_organization'));
        $this->entity->setRegionId($this->request->request->get('worksheet_region'));
        $this->entity->setSpotTypeId($this->request->request->get('worksheet_spot_type'));
        $this->entity->setWeekInformation('none available');
        $this->entity->setCreatedAt(Carbon::now());
        $this->entity->setUpdatedAt(Carbon::now());

        return $this->entity;
    }
}