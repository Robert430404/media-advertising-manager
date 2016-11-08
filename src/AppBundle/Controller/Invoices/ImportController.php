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
        $data  = $request->request->all();
        $files = $request->files->all();

        foreach ($files as $file) {
            $path     = $file->getPathName();
            $size     = $file->getSize();
            $openFile = fopen($path, 'r');
            $readFile = fread($openFile, $size);
            $fileData = explode("\n", $readFile);

            foreach ($fileData as $key => $line) {
                $fileData[$key] = explode(';', $line);

                foreach ($fileData[$key] as $keyTWo => $set) {
                    if (empty($set)) {
                        unset($fileData[$key][$keyTWo]);
                    }
                }

                $fileData[$key] = array_values($fileData[$key]);
            }

            fclose($openFile);
            var_dump($fileData);
        }

        return $this->render('/invoices/output.html.twig');
    }
}
