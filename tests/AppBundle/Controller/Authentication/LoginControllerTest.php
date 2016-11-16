<?php

namespace Tests\AppBundle\Controller\Authentication;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class LoginControllerTest extends WebTestCase
{
    /**
     * Test for 200 okay on login view
     */
    public function testIndexAction()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/login');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertContains('Login', $crawler->filter('h1.form-title')->text());
    }
}
