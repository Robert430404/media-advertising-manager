<?php

use Symfony\Component\HttpFoundation\Request;

/**
 * This is the composer autoloader, it allows you to use composer
 * and have all of the libraries/files be used dynamically.
 *
 * @var \Composer\Autoload\ClassLoader $loader
 */
$loader = require __DIR__.'/../app/autoload.php';

/**
 * Import the PHP Symfony Cache to store views and requests.
 */
include_once __DIR__.'/../var/bootstrap.php.cache';

/**
 * Activate the application kernel and disable debug inside of the
 * kernel/activate the production mode.
 */
$kernel = new AppKernel('prod', false);
$kernel->loadClassCache();

/**
 * Activates the symfony request object for your interactions with
 * the application.
 */
$request  = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
