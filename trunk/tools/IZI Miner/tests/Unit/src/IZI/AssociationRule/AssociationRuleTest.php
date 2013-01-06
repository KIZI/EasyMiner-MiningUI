<?php


require_once 'Bootstrap.php';

use IZI\AssociationRule\AssociationRule;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\ConnectiveParser;
use IZI\Parser\BBAParser;
use IZI\Parser\DataDescriptionParser;
use IZI\Parser\DBAParser;
use IZI\Parser\FeatureListParser;

class AssociationRuleTest extends PHPUnit_Framework_TestCase
{

    private $ER;
    private $ERXPath;
    private $attributes;
    private $IMs;
    private $DBAP;
    private $BBAP;

    protected function setUp()
    {
        $loader = new XMLLoader();
        $this->ER = $loader->load(ERASSOCIATIONRULES);
        $this->ERXPath = new \DOMXPath($this->ER);
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
        $ARNode = $this->ERXPath->evaluate('//AssociationRule')->item(0);
        $AR = new AssociationRule($ARNode, $this->ER, $this->attributes, $this->IMs, $this->DBAP, $this->BBAP);
        $AR->parse();
        $data = $AR->toArray();

        $this->assertEquals(1, count($data['antecedent']));
        $this->assertEquals(1, count($data['IM']));
        $this->assertEquals(1, count($data['consequent']));
    }

}
