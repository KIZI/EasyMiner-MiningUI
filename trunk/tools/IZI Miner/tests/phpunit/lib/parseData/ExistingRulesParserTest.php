<?php

require_once 'Bootstrap.php';

class ExistingRulesParserTest extends PHPUnit_Framework_TestCase
{
    private $ERAssociationRules;
    private $ERTaskSettingRules;
    private $ERARQueryRules;
    private $attributes;
    private $IMs;

    protected function setUp()
    {
        $loader = new XMLFileLoader();
        $this->ERAssociationRules = $loader->load(ERASSOCIATIONRULES);
        $this->ERTaskSettingRules = $loader->load(ERTASKSETTING);
        $this->ERARQueryRules = $loader->load(ERARQUERY);

        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->IMs = $data['interestMeasures'];
    }

    public function testParseDataAssociationRules()
    {
        $ERP = new ExistingRulesParser($this->ERAssociationRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(70, count($data['existingRules']['rules']));
    }

    public function testParseDataTaskSettingRules()
    {
        $this->markTestSkipped();
        $ERP = new ExistingRulesParser($this->ERTaskSettingRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(1, count($data['existingRules']['rules']));
    }

    public function testParseDataARQueryRules()
    {
        $this->markTestSkipped();
        $ERP = new ExistingRulesParser($this->ERARQueryRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(1, count($data['existingRules']['rules']));
    }

}
