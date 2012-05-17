<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class ARQueryRulesParserTest extends PHPUnit_Framework_TestCase {

    private $ER;
    private $attributes;
    private $IMs;

    protected function setUp() {
        $this->ER = new DOMDocument('1.0', 'UTF-8');
        $this->ER->load(ERARQuery, LIBXML_NOBLANKS);

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

    public function testParseRules() {
        $ARQP = new ARQueryRulesParser($this->ER, $this->attributes, $this->IMs);
        $data = $ARQP->parseRules();

        $this->assertEquals(1, count($data));
    }

}
