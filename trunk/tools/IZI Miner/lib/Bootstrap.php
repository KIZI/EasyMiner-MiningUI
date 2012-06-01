<?php

// PHP error reporting
if (DEV_MODE) {
    error_reporting(E_ALL ^ E_NOTICE);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// PHP native JSON is preferred
if (!function_exists('json_encode')) {
  require_once 'lib/JSON.php';
}

// class autoloader
function __autoload($class_name) {
    $paths = array(
    	'lib', 
    	'lib'.DS.'algorithms',
    	'lib'.DS.'exceptions',
    	'lib'.DS.'garbage', 
    	'lib'.DS.'parseData', 
    	'lib'.DS.'serializeRules'
    );
    
    foreach ($paths as $p) {
        $path = APP_PATH.DS.$p.DS.$class_name.'.php';
        if (file_exists($path)) {
            require_once $path;
            break;
        }
    }
}