<?php

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', realpath(realpath(dirname(__FILE__)).DS.'..'));

$configs = array(array('DDPath' => APP_PATH.DS.'data'.DS.'datadescription_0.2.xml',
                   'FLPath' => array (
                        APP_PATH.DS.'data'.DS.'featureList_beginner.xml', // array only, first one is default
                        APP_PATH.DS.'data'.DS.'featureList_exploration.xml'
                    ),
                   'FGCPath' => APP_PATH.DS.'data'.DS.'fieldGroupConfig.xml',
                   'ERPath' => null,
                   'ETreePath' => null, 
                   'FAPath' => APP_PATH.DS.'data'.DS.'frequencyAnalysis.xml',
                   'LANG' => 'en',
                   'DEV_MODE' => false,
                   'DEV_LM_PATH' => 'C:'.DS.'xampp'.DS.'htdocs'.DS.'LM'));
$config = $configs[0];

foreach ($config as $k => $c) {
    is_array($c) ? define($k, serialize($c)) : define($k, $c);
}