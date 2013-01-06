<?php

require_once 'Bootstrap.php';

use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataDescriptionParser;
use IZI\Parser\FeatureListParser;
use IZI\Parser\FieldGroupConfigParser;

class FieldGroupConfigParserTest extends PHPUnit_Framework_TestCase
{
    private $attributes;
    private $coefficients;

    protected function setUp()
    {
        $loader = new XMLLoader();
        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->coefficients = $data['BBA']['coefficients'];
    }

    public function testParseRootConfigID()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);

        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();

        $this->assertEquals(1, $data['rootConfigID']);
    }

    public function testParseInvalidRootConfigID()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCINVALIDROOTCONFIGID, LIBXML_NOBLANKS);

        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();

        // root config ID
        $this->assertEquals(1, $data['rootConfigID']);
    }

    public function testParseInvalidStructure()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCINVALIDSTRUCTURE, LIBXML_NOBLANKS);

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

    public function testParseConfig()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);

        $FGCP = new FieldGroupConfigParser($FGC, $this->attributes, $this->coefficients, 'en');
        $data = $FGCP->parseConfig();

        $this->assertTrue(array_key_exists(0, $data['groups']));
        $this->assertTrue(array_key_exists(1, $data['groups']));
    }

}
