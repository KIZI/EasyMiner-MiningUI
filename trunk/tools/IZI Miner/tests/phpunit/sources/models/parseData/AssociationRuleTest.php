<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class AssociationRuleTest extends PHPUnit_Framework_TestCase {

    private $ER;
    private $ERXPath;
    private $attributes;
    private $IMs;
    private $DBAP;
    private $BBAP;

    protected function setUp() {
        $this->ER = new DOMDocument('1.0', 'UTF-8');
        $this->ER->load(ERXQuery, LIBXML_NOBLANKS);
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
        $ARNode = $this->ERXPath->evaluate('//Hit[1]/AssociationRule')->item(0);
        $AR = new AssociationRule($ARNode, $this->ER, $this->attributes, $this->IMs, $this->DBAP, $this->BBAP);
        $AR->parse();
        $data = $AR->toArray();

        $this->assertEquals(5, count($data['antecedent']));
        $this->assertEquals(1, count($data['IM']));
        $this->assertEquals(1, count($data['consequent']));
    }

}
