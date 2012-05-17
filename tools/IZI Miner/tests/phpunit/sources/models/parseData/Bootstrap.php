<?php

define('APP_PATH', realpath(realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'));

$path = APP_PATH.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'parseData';
$pathExceptions = APP_PATH.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'exceptions';
$pathXML = realpath(dirname(__FILE__));

define('DD', $pathXML.DIRECTORY_SEPARATOR.'datadescription_0.2.xml');
define('FL', $pathXML.DIRECTORY_SEPARATOR.'featurelistQueryByAr.xml');
define('FGC', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfig.xml');
define('FGCInvalidRootConfigID', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidRootConfigID.xml');
define('FGCInvalidStructure', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidStructure.xml');
define('FGCInvalidAttribute', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidAttribute.xml');
define('FGCInvalidCoefficientType', $pathXML.DIRECTORY_SEPARATOR.'fieldGroupConfigInvalidCoefficientType.xml');
define('ERXQuery', $pathXML.DIRECTORY_SEPARATOR.'hitlist_XQuery.xml');
define('ERTaskSetting', $pathXML.DIRECTORY_SEPARATOR.'hitlist_TaskSetting.xml');
define('ERARQuery', $pathXML.DIRECTORY_SEPARATOR.'hitlist_ARQuery.xml');

require_once $path.DIRECTORY_SEPARATOR.'DataParser.php';

// DD
require_once $path.DIRECTORY_SEPARATOR.'Attribute.php';
require_once $path.DIRECTORY_SEPARATOR.'DataDescriptionParser.php';

// FL
require_once $path.DIRECTORY_SEPARATOR.'FeatureListParser.php';
require_once $path.DIRECTORY_SEPARATOR.'FLInterestMeasure.php';
require_once $path.DIRECTORY_SEPARATOR.'Coefficient.php';
require_once $path.DIRECTORY_SEPARATOR.'NestingConstraint.php';

// FGC
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidFieldGroupConfigException.php';
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidCoefficientException.php';
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidAttributeException.php';
require_once $path.DIRECTORY_SEPARATOR.'CoefficientType.php';
require_once $path.DIRECTORY_SEPARATOR.'FieldGroup.php';
require_once $path.DIRECTORY_SEPARATOR.'FieldGroupConfigCoefficient.php';
require_once $path.DIRECTORY_SEPARATOR.'FieldGroupConfigParser.php';

// ER
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidConnectiveException.php';
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidBBAException.php';
require_once $pathExceptions.DIRECTORY_SEPARATOR.'InvalidDBAException.php';
require_once $path.DIRECTORY_SEPARATOR.'Connective.php';
require_once $path.DIRECTORY_SEPARATOR.'ConnectiveParser.php';
require_once $path.DIRECTORY_SEPARATOR.'BBA.php';
require_once $path.DIRECTORY_SEPARATOR.'BBAParser.php';
require_once $path.DIRECTORY_SEPARATOR.'DBA.php';
require_once $path.DIRECTORY_SEPARATOR.'DBAParser.php';
require_once $path.DIRECTORY_SEPARATOR.'ERInterestMeasure.php';
require_once $path.DIRECTORY_SEPARATOR.'ARQueryRule.php';
require_once $path.DIRECTORY_SEPARATOR.'ARQueryRulesParser.php';
require_once $path.DIRECTORY_SEPARATOR.'AssociationRule.php';
require_once $path.DIRECTORY_SEPARATOR.'AssociationRulesParser.php';
require_once $path.DIRECTORY_SEPARATOR.'TaskSettingRule.php';
require_once $path.DIRECTORY_SEPARATOR.'TaskSettingRulesParser.php';
require_once $path.DIRECTORY_SEPARATOR.'ExistingRulesParser.php';
