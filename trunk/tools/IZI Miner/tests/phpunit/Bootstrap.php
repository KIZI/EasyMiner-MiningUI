<?php

define('DS', DIRECTORY_SEPARATOR);
define('APP_PATH', __DIR__.'/../..');

// Symfony2 ClassLoader
require_once APP_PATH.'/vendor/Symfony/Component/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'Symfony' => APP_PATH.'/vendor',
    'IZI' => APP_PATH.'/src',
    'PHPUnit' => APP_PATH.'/vendor',
));
$loader->register();

$pathXML = realpath(dirname(__FILE__));
define('DD', $pathXML.DS.'datadescription_0.2.xml');
define('FL', $pathXML.DS.'featurelistQueryByAr.xml');
define('FGC', $pathXML.DS.'fieldGroupConfig.xml');
define('FGCINVALIDROOTCONFIGID', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidRootConfigID.xml');
define('FGCINVALIDSTRUCTURE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidStructure.xml');
define('FGCINVALIDATTRIBUTE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidAttribute.xml');
define('FGCINVALIDCOEFFICIENTTYPE', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidCoefficientType.xml');
define('ERASSOCIATIONRULES', $pathXML.DIRECTORY_SEPARATOR.'hitlist_AssociationRules.pmml');
define('ERTASKSETTING', $pathXML.DIRECTORY_SEPARATOR.'hitlist_TaskSetting.xml');
define('ERARQUERY', $pathXML.DIRECTORY_SEPARATOR.'hitlist_ARQuery.xml');

