<?php

namespace AppBundle\Services\Factories;

use AppBundle\Entity\Worksheets;
use AppBundle\Services\Mappers\WorksheetMapper;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class WorksheetsFactory
 *
 * @package AppBundle\Services\Factories
 */
class WorksheetsFactory
{
    /**
     * Creates a Mapped Worksheets Entity
     *
     * @param Request $request
     * @param Worksheets $worksheets
     * @return Worksheets
     */
    public function create(Request $request, Worksheets $worksheets): Worksheets
    {
        return (new WorksheetMapper($request, $worksheets))->getMappedEntity();
    }

    public function update()
    {

    }
}