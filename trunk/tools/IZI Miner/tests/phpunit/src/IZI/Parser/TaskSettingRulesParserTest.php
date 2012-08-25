<?php

require_once 'Bootstrap.php';

use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataDescriptionParser;
use IZI\Parser\FeatureListParser;
use IZI\Parser\TaskSettingRulesParser;

class TaskSettingRulesParserTest extends PHPUnit_Framework_TestCase
{
    private $ER;
    private $attributes;
    private $IMs;

    protected function setUp()
    {
        $loader = new XMLLoader();
        $this->ER = $loader->load(ERTASKSETTING);

        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->IMs = $data['interestMeasures'];
    }

    public function testParseRules()
    {
        $this->markTestSkipped();
        $ARP = new TaskSettingRulesParser($this->ER, $this->attributes, $this->IMs);
        $data = $ARP->parseRules();

        $this->assertEquals(1, count($data));
    }

}
