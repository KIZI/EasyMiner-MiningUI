<?php

use Symfony\Component\ClassLoader\UniversalClassLoader;

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', __DIR__.'/..');
define('DEV_MODE', true);

// PHP error reporting
if (DEV_MODE) {
    error_reporting(E_ALL ^ E_NOTICE);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

require_once APP_PATH . '/vendor/autoload.php';

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'IZI' => APP_PATH.'/src',
));
$loader->register();