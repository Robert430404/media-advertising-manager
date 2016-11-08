<?php

namespace AppBundle\Controller\Invoices;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ImportController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/invoices", name="invoices")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $organizations = $this->getDoctrine()->getRepository('AppBundle:Organizations')->findAll();

        return $this->render('invoices/index.html.twig', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/invoices/insert", name="invoice-insert")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data          = $request->request->all();
        $files         = $request->files->all();
        $fileData      = $this->get('app.invoice_helpers')->formatFileData($files);
        $orgData       = $this->get('app.invoice_helpers')->getOrganizationData($fileData);
        $stationData   = $this->get('app.invoice_helpers')->getStationData($fileData);
        $marketData    = $this->get('app.invoice_helpers')->getMarketData($fileData);
        $timeFrameData = $this->get('app.invoice_helpers')->getTimeFrameData($fileData);
        $spotData      = $this->get('app.invoice_helpers')->getSpotData($fileData);

        var_dump($spotData);

        return $this->render('/invoices/output.html.twig', [
            'organization' => $orgData,
            'station'      => $stationData,
            'market'       => $marketData,
            'timeFrame'    => $timeFrameData,
            'spots'        => $spotData
        ]);
    }
}
