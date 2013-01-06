<?php

require_once 'Bootstrap.php';

use IZI\FileLoader\XMLLoader;
use IZI\Parser\AssociationRulesParser;
use IZI\Parser\DataDescriptionParser;
use IZI\Parser\FeatureListParser;

class AssociationRulesParserTest extends PHPUnit_Framework_TestCase
{

    private $loader;
    private $attributes;
    private $IMs;

    protected function setUp()
    {
        $this->loader = new XMLLoader();
        $DD = $this->loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $this->loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->IMs = $data['interestMeasures'];
    }

    public function testParseRules()
    {
        $ER = $this->loader->load(ERASSOCIATIONRULES);
        $ARP = new AssociationRulesParser($ER, $this->attributes, $this->IMs);
        $data = $ARP->parseRules();

        $this->assertEquals(70, count($data));
    }

    public function testParseRules2()
    {
        $ER = $this->loader->load(ERASSOCIATIONRULES2);
        $ARP = new AssociationRulesParser($ER, $this->attributes, $this->IMs);
        $data = $ARP->parseRules();

        $this->assertEquals(1, count($data));
    }

}
