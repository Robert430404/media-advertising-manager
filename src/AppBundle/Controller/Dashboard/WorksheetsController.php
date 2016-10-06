<?php

namespace AppBundle\Controller\Dashboard;

use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class WorksheetsController extends Controller
{
    /**
     * @param Request $request
     * @param $campaign_id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/campaigns/worksheets/{campaign_id}", name="campaign-worksheets")
     * @Method({"GET"})
     */
    public function indexAction(Request $request, $campaign_id)
    {
        $worksheets = $this->getDoctrine()
            ->getRepository('AppBundle:Worksheets')
            ->findByCampaignId($campaign_id);

        var_dump($worksheets);

        return $this->render('dashboard/worksheets/index.html.twig', [
            'worksheets' => $worksheets,
        ]);
    }
}
