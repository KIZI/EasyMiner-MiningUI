<?php

use Symfony\Component\ClassLoader\UniversalClassLoader;

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', __DIR__.'/../..');
define('WEB_PATH', 'http://localhost/izi-miner/web/');

require_once APP_PATH . '/vendor/autoload.php';

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'IZI' => APP_PATH.'/src',
    'PHPUnit' => APP_PATH.'/vendor',
));
$loader->register();

$pathXML = realpath(dirname(__FILE__)).'/_data';
define('DD', $pathXML.DS.'datadescription_0.2.xml');
define('FL', $pathXML.DS.'featurelistQueryByAr.xml');
define('FGC', $pathXML.DS.'fieldGroupConfig.xml');
define('FGCINVALIDROOTCONFIGID', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidRootConfigID.xml');
define('FGCINVALIDSTRUCTURE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidStructure.xml');
define('FGCINVALIDATTRIBUTE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidAttribute.xml');
define('FGCINVALIDCOEFFICIENTTYPE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidCoefficientType.xml');
define('ERASSOCIATIONRULES', $pathXML.DIRECTORY_SEPARATOR.'hitlist_AssociationRules.pmml');
define('ERASSOCIATIONRULES2', $pathXML.DIRECTORY_SEPARATOR.'hitlist_AssociationRules2.pmml');
define('ERTASKSETTING', $pathXML.DIRECTORY_SEPARATOR.'hitlist_TaskSetting.xml');
define('ERARQUERY', $pathXML.DIRECTORY_SEPARATOR.'hitlist_ARQuery.xml');

