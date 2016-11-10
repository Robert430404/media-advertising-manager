<?php

namespace AppBundle\Controller\Api\V1;

use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class WorksheetsController extends Controller
{
    /**
     * Returns a JSON list of a worksheet by ID
     *
     * @param Request $request
     * @param integer $worksheetId
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/worksheet/{worksheetId}/update", name="api-worksheet-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $worksheetId)
    {
        $data      = $request->request->all();
        $orm       = $this->getDoctrine()->getManager();
        $worksheet = $orm->getRepository('AppBundle:Worksheets')->find($worksheetId);

        if (!$worksheet) {
            return $this->json(['success' => false]);
        }

        $worksheet->setWeekInformation(json_encode($data));
        $worksheet->setUpdatedAt(Carbon::now());
        $orm->flush();

        return $this->json(['success' => true]);
    }
}
