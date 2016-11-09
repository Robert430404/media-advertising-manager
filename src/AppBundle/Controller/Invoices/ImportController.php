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
     * Processes Provided Invoice
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/invoices/insert", name="invoice-insert")
     * @Method({"POST"})
     */
    public function insertAction(Request $request)
    {
        $data         = $request->request->all();
        $files        = $request->files->all();
        $fileData     = $this->get('app.invoice_helpers')->formatFileData($files);
        $spotData     = $this->get('app.invoice_helpers')->getSpotDataWithDateTime($fileData);
        $organization = $this->getDoctrine()->getRepository('AppBundle:Organizations')->find($data['organizations']);
        $region       = $this->getDoctrine()->getRepository('AppBundle:Regions')->find($data['regions']);
        $campaign     = $this->getDoctrine()->getRepository('AppBundle:Campaigns')->find($data['campaigns']);

        return $this->render('/invoices/insert.html.twig', [
            'spots'        => $spotData,
            'organization' => $organization,
            'region'       => $region,
            'campaign'     => $campaign,
        ]);
    }
}
