<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class FieldGroupConfigParserTest extends PHPUnit_Framework_TestCase {

    private $attributes;
    private $coefficients;

    protected function setUp() {
        $DD = new DOMDocument('1.0', 'UTF-8');
        $DD->load(DD, LIBXML_NOBLANKS);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['attributes'];

        $FL = new DOMDocument('1.0', 'UTF-8');
        $FL->load(FL, LIBXML_NOBLANKS);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->coefficients = $data['BBA']['coefficients'];
    }

    public function testParseRootConfigID() {
        $FGC = new DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);
        
        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();

        $this->assertEquals(1, $data['rootConfigID']);
    }

    public function testParseInvalidRootConfigID() {
        $FGC = new DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCInvalidRootConfigID, LIBXML_NOBLANKS);

        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();
        
        // root config ID
        $this->assertEquals(1, $data['rootConfigID']);
    }
    
    public function testParseInvalidStructure() {
        $FGC = new DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCInvalidStructure, LIBXML_NOBLANKS);

        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();
        
        // root group
        $this->assertTrue(array_key_exists(0, $data['groups']));

        // default attributes
        $this->assertTrue(array_key_exists('Age', $data['groups'][0]['fieldConfig']));
        $this->assertTrue(array_key_exists('District', $data['groups'][0]['fieldConfig']));
        
        // default attribute coefficient
        $this->assertEquals(null, $data['groups'][0]['fieldConfig']['Age']['coefficient']);
    }

    public function testParseConfig() {
        $FGC = new DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);
        
        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();

        $this->assertTrue(array_key_exists(0, $data['groups']));
        $this->assertTrue(array_key_exists(1, $data['groups']));
    }

}
