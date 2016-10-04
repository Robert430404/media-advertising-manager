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
     * @Route("/login", name="login")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        return $this->render('login/index.html.twig', [
            'last_username' => null,
            'error'         => null
        ]);
    }

    /**
     * Authenticates the User From Entity
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/login", name="authenticate")
     * @Method({"POST"})
     */
    public function loginAction(Request $request)
    {
        $authenticationUtils = $this->get('security.authentication_utils');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', array(
            'last_username' => $lastUsername,
            'error'         => $error,
        ));
    }
}
