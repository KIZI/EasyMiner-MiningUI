<?php

use Symfony\Component\ClassLoader\UniversalClassLoader;

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', __DIR__.'/..');

require_once APP_PATH . '/vendor/autoload.php';

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'IZI' => APP_PATH.'/src',
));
$loader->register();