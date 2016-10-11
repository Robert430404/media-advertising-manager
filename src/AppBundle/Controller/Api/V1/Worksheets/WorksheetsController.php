<?php

namespace AppBundle\Controller\Api\V1\Worksheets;

use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class WorksheetsController extends Controller
{
    /**
     * @param Request $request
     * @param integer $worksheet_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/api/v1/worksheet/{worksheet_id}/update", name="api-worksheet-update")
     * @Method({"POST"})
     */
    public function updateAction(Request $request, $worksheet_id)
    {
        $data = $request->request->all();
        $orm = $this->getDoctrine()->getManager();
        $worksheet = $orm->getRepository('AppBundle:Worksheets')->find($worksheet_id);

        if(!$worksheet)
        {
            return $this->json(['success' => false]);
        }

        $worksheet->setWeekInformation(json_encode($data));
        $orm->flush();

        return $this->json(['success' => true]);
    }
}
