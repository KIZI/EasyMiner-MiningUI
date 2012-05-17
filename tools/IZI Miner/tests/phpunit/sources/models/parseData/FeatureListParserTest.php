<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class FeatureListParserTest extends PHPUnit_Framework_TestCase {

    private $FL;

    protected function setUp()
    {
        $this->FL = new DOMDocument('1.0', 'UTF-8');
        $this->FL->load(FL, LIBXML_NOBLANKS);
    }

    public function testParseData() {
        $FLP = new FeatureListParser($this->FL, 'en');
        $data = $FLP->parseData();

        // user interface
        // display mode
        $this->assertEquals(true, $data['miningMode']);


        // rule pattern
        // rule patterns
        $this->assertEquals(4, count($data['rulePattern']));

        // rule pattern name
        $this->assertTrue(isset($data['rulePattern']['Antecedent']));

        // rule pattern minimal number of BBAs
        $this->assertEquals(1, $data['rulePattern']['Antecedent']['minNumberOfBBAs']);

        // rule pattern maximal number of BBAs
        $this->assertEquals(99999, $data['rulePattern']['Antecedent']['maxNumberOfBBAs']);


        // interest measures
        // interest measures treshold
        $this->assertEquals('required', $data['interestMeasures']['treshold']);

        // interest measure types
        $this->assertEquals(3, count($data['interestMeasures']['types']));

        // interest measure name
        $this->assertTrue(isset($data['interestMeasures']['types']['Support']));

        // interest measure localized name
        $this->assertEquals('Support', $data['interestMeasures']['types']['Support']['localizedName']);

        // interest measure explanation
        $this->assertEquals('Relative support of the rule', $data['interestMeasures']['types']['Support']['explanation']);

        // interest measure field name
        $this->assertEquals('prahovaHodnota', $data['interestMeasures']['types']['Support']['field']['name']);

        // interest measure field localized name
        $this->assertEquals('threshold value', $data['interestMeasures']['types']['Support']['field']['localizedName']);

        // interest measure field validation min value
        $this->assertEquals(0, $data['interestMeasures']['types']['Support']['field']['minValue']);

        // interest measure field validation min value inclusive
        $this->assertEquals(false, $data['interestMeasures']['types']['Support']['field']['minValueInclusive']);

        // interest measure field validation max value
        $this->assertEquals(1, $data['interestMeasures']['types']['Support']['field']['maxValue']);

        // interest measure field validation max value inclusive
        $this->assertEquals(true, $data['interestMeasures']['types']['Support']['field']['maxValueInclusive']);

        // interest measure field validation datatype
        $this->assertEquals('double', $data['interestMeasures']['types']['Support']['field']['dataType']);

        // interest measure combinations
        $this->assertEquals(5, count($data['interestMeasures']['combinations']));

        // interest measure combination
        $this->assertEquals(array('Confidence', 'Support'), $data['interestMeasures']['combinations'][0]);


        // BBAs
        // BBA coefficient
        $this->assertEquals('required', $data['BBA']['coefficient']);

        // BBA name
        $this->assertTrue(isset($data['BBA']['coefficients']['One category']));

        // BBA localized name
        $this->assertEquals('One category', $data['BBA']['coefficients']['One category']['localizedName']);

        // BBA explanation
        $this->assertEquals('One category can be selected', $data['BBA']['coefficients']['One category']['explanation']);

        // BBA field name
        $this->assertTrue(isset($data['BBA']['coefficients']['One category']['fields']['category']));

        // BBA field localized name
        $this->assertEquals('category', $data['BBA']['coefficients']['One category']['fields']['category']['localizedName']);

        // BBA field validation datatype
        $this->assertEquals('string', $data['BBA']['coefficients']['One category']['fields']['category']['dataType']);

        // BBA field validation min value
        $this->assertEquals(1, $data['BBA']['coefficients']['Subset']['fields']['maxLength']['minValue']);

        // BBA field validation min value inclusive
        $this->assertEquals(true, $data['BBA']['coefficients']['Subset']['fields']['maxLength']['minValueInclusive']);

        // BBA field validation max value
        $this->assertEquals(5, $data['BBA']['coefficients']['Subset']['fields']['maxLength']['maxValue']);

        // BBA field validation max value inclusive
        $this->assertEquals(true, $data['BBA']['coefficients']['Subset']['fields']['maxLength']['maxValueInclusive']);

        // BBA field validation previous
        $this->assertEquals('isSmallerOrEqual', $data['BBA']['coefficients']['Subset']['fields']['maxLength']['previous']);


        // DBAs
        // DBA max number of levels
        $this->assertEquals(3, $data['DBA']['maxLevels']);

        // DBA constraints
        $this->assertEquals(3, count($data['DBA']['constraints']));

        // DBA level1
        $this->assertTrue(isset($data['DBA']['constraints']['level1']));

        // DBA level2
        $this->assertTrue(isset($data['DBA']['constraints']['level2']));

        // DBA level3
        $this->assertTrue(isset($data['DBA']['constraints']['level2']));

        // DBA level1 constraint
        $this->assertTrue(isset($data['DBA']['constraints']['level1']['Conjunction']));

        // DBA level1 constraints
        $this->assertEquals(4, count($data['DBA']['constraints']['level1']));

        // DBA level1 constraint allowed
        $this->assertEquals(true, $data['DBA']['constraints']['level1']['Conjunction']['allowed']);
    }

}