<?php

require_once 'Bootstrap.php';

class TaskSettingRuleTest extends PHPUnit_Framework_TestCase
{
    private $ER;
    private $ERXPath;
    private $attributes;
    private $IMs;
    private $DBAP;
    private $BBAP;

    protected function setUp()
    {
        $loader = new XMLFileLoader();
        $this->ER = $loader->load(ERTASKSETTING);
        $this->ERXPath = new DOMXPath($this->ER);
        $CP = new ConnectiveParser($this->ER, $this->ERXPath);

        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->IMs = $data['interestMeasures'];

        $this->DBAP = new DBAParser($this->ER, $this->ERXPath, $CP);
        $this->DBAP->parseDBAs();

        $this->BBAP = new BBAParser($this->ER, $this->ERXPath);
        $this->BBAP->parseBBAs();
    }

    public function testParse()
    {
        $this->markTestSkipped();
        $TSRNode = $this->ERXPath->evaluate('//TaskSetting')->item(0);
        $TSR = new TaskSettingRule($TSRNode, $this->ER, $this->attributes, $this->IMs, $this->DBAP, $this->BBAP);
        $TSR->parse();
        $data = $TSR->toArray();

        $this->assertEquals(1, count($data['antecedent']));
        $this->assertEquals(2, count($data['IM']));
        $this->assertEquals(1, count($data['consequent']));
    }

}
