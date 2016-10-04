<?php

namespace AppBundle\Controller\Authentication;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class LoginController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/", name="login")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        return $this->render('login/index.html.twig');
    }
}
