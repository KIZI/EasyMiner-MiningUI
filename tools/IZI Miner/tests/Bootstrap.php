<?php

use Symfony\Component\ClassLoader\UniversalClassLoader;

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', __DIR__.'/..');
define('WEB_PATH', 'http://localhost/izi-miner/web/');

require_once APP_PATH . '/vendor/autoload.php';

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'IZI' => APP_PATH.'/src',
    'PHPUnit' => APP_PATH.'/vendor',
));
$loader->register();

$pathXML = realpath(dirname(__FILE__)).'/Unit/_data';
define('DD', $pathXML.DS.'datadescription_0.2.xml');
define('FL', $pathXML.DS.'featurelistQueryByAr.xml');
define('FGC', $pathXML.DS.'fieldGroupConfig.xml');
define('FA', $pathXML.DS.'frequencyAnalysis.xml');
define('FGCINVALIDROOTCONFIGID', $pathXML.DS.'fieldGroupConfigInvalidRootConfigID.xml');
define('FGCINVALIDSTRUCTURE', $pathXML.DS.'fieldGroupConfigInvalidStructure.xml');
define('FGCINVALIDATTRIBUTE', $pathXML.DS.'fieldGroupConfigInvalidAttribute.xml');
define('FGCINVALIDCOEFFICIENTTYPE', $pathXML.DS.'fieldGroupConfigInvalidCoefficientType.xml');
define('ERASSOCIATIONRULES', $pathXML.DS.'hitlist_AssociationRules.pmml');
define('ERASSOCIATIONRULES2', $pathXML.DS.'hitlist_AssociationRules2.pmml');
define('ERTASKSETTING', $pathXML.DS.'hitlist_TaskSetting.xml');
define('ERARQUERY', $pathXML.DS.'hitlist_ARQuery.xml');

define('DATA_PATH', $pathXML.'/');
