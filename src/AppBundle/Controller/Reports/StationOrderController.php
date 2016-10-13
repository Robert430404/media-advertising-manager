<?php

namespace AppBundle\Controller\Reports;

use Carbon\Carbon;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\SecurityBundle\Tests\Functional\Bundle\AclBundle\Entity\Car;
use Symfony\Component\HttpFoundation\Request;

class StationOrderController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/reports/station-order", name="generate-order")
     * @Method({"GET"})
     */
    public function pdfAction(Request $request)
    {
        return $this->render('reports/stationOrder.html.twig');
    }
}