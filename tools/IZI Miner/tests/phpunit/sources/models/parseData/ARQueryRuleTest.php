<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class ARQueryRuleTest extends PHPUnit_Framework_TestCase {

    private $ER;
    private $ERXPath;
    private $attributes;
    private $IMs;
    private $DBAP;
    private $BBAP;

    protected function setUp() {
        $this->ER = new DOMDocument('1.0', 'UTF-8');
        $this->ER->load(ERARQuery, LIBXML_NOBLANKS);
        $this->ERXPath = new DOMXPath($this->ER);
        $CP = new ConnectiveParser($this->ER, $this->ERXPath);

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

        $this->DBAP = new DBAParser($this->ER, $this->ERXPath, $CP);
        $this->DBAP->parseDBAs();

        $this->BBAP = new BBAParser($this->ER, $this->ERXPath);
        $this->BBAP->parseBBAs();
    }

    public function testParse() {
        $ARQNode = $this->ERXPath->evaluate('//ARQuery')->item(0);
        $ARQR = new TaskSettingRule($ARQNode, $this->ER, $this->attributes, $this->IMs, $this->DBAP, $this->BBAP);
        $ARQR->parse();
        $data = $ARQR->toArray();

        $this->assertEquals(1, count($data['antecedent']));
        $this->assertEquals(2, count($data['IM']));
        $this->assertEquals(1, count($data['consequent']));
    }

}
