<?php

require_once 'Bootstrap.php';

use IZI\AssociationRule\Connective;
use IZI\Parser\ConnectiveParser;

class ConnectiveParserTest extends PHPUnit_Framework_TestCase
{
    private $ER;
    private $XPath;

    protected function setUp()
    {
        $this->ER = new \DOMDocument();
        $this->ER->load(ERASSOCIATIONRULES);
        $this->XPath = new \DOMXPath($this->ER);
    }

    public function testParseConnective1()
    {
        $CP = new ConnectiveParser($this->ER, $this->XPath);

        $connectiveConj = new Connective('Conjunction');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Conjunction'));
    }

    public function testParseConnective2()
    {
        $CP = new ConnectiveParser($this->ER, $this->XPath);

        $connectiveConj = new Connective('Disjunction');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Disjunction'));
    }

    public function testParseConnective3()
    {
        $CP = new ConnectiveParser($this->ER, $this->XPath);

        $connectiveConj = new Connective('Negation');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Negation'));
    }

}
