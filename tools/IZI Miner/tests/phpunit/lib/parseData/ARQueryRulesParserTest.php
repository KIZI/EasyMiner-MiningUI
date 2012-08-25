<?php

require_once 'Bootstrap.php';

class ARQueryRulesParserTest extends PHPUnit_Framework_TestCase
{

    private $ER;
    private $attributes;
    private $IMs;

    protected function setUp()
    {
        $loader = new XMLFileLoader();
        $this->ER = $loader->load(ERARQUERY);

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
        $ARQP = new ARQueryRulesParser($this->ER, $this->attributes, $this->IMs);
        $data = $ARQP->parseRules();

        $this->assertEquals(1, count($data));
    }

}
