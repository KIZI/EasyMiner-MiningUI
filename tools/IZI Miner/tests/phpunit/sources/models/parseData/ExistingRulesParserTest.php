<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class ExistingRulesParserTest extends PHPUnit_Framework_TestCase {

    private $ERAssociationRules;
    private $ERTaskSettingRules;
    private $ERARQueryRules;
    private $attributes;
    private $IMs;

    protected function setUp() {
        $this->ERAssociationRules = new DOMDocument('1.0', 'UTF-8');
        $this->ERAssociationRules->load(ERXQuery, LIBXML_NOBLANKS);

        $this->ERTaskSettingRules = new DOMDocument('1.0', 'UTF-8');
        $this->ERTaskSettingRules->load(ERTaskSetting, LIBXML_NOBLANKS);

        $this->ERARQueryRules = new DOMDocument('1.0', 'UTF-8');
        $this->ERARQueryRules->load(ERARQuery, LIBXML_NOBLANKS);

        $DD = new DOMDocument('1.0', 'UTF-8');
        $DD->load(DD, LIBXML_NOBLANKS);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['attributes'];

        $FL = new DOMDocument('1.0', 'UTF-8');
        $FL->load(FL, LIBXML_NOBLANKS);
        $FLP = new FeatureListParser($FL, $lang);
        $data = $FLP->parseData();
        $this->IMs = $data['interestMeasures'];
    }

    public function testParseDataAssociationRules() {
        $ERP = new ExistingRulesParser($this->ERAssociationRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(5, count($data['existingRules']['rules']));
    }

    public function testParseDataTaskSettingRules() {
        $ERP = new ExistingRulesParser($this->ERTaskSettingRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(1, count($data['existingRules']['rules']));
    }

    public function testParseDataARQueryRules() {
        $ERP = new ExistingRulesParser($this->ERARQueryRules, $this->attributes, $this->IMs);
        $data = $ERP->parseData();

        $this->assertEquals('Solved', $data['existingRules']['taskState']);
        $this->assertEquals(1, count($data['existingRules']['rules']));
    }

}
