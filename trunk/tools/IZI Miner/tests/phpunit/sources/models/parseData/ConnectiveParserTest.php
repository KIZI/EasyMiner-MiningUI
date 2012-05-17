<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class ConnectiveParserTest extends PHPUnit_Framework_TestCase {

    private $ERXQuery;
    private $ERXQueryXPath;

    protected function setUp()
    {
        $this->ERXQuery = new DOMDocument();
        $this->ERXQuery->load(ERXQuery);
        $this->ERXQueryXPath = new DOMXPath($this->ERXQuery);
    }

    public function testParseConnective1() {
        $CP = new ConnectiveParser($this->ERXQuery, $this->ERXQueryXPath);

        $connectiveConj = new Connective('Conjunction');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Conjunction'));
    }

    public function testParseConnective2() {
        $CP = new ConnectiveParser($this->ERXQuery, $this->ERXQueryXPath);

        $connectiveConj = new Connective('Disjunction');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Disjunction'));
    }

    public function testParseConnective3() {
        $CP = new ConnectiveParser($this->ERXQuery, $this->ERXQueryXPath);

        $connectiveConj = new Connective('Negation');
        $this->assertEquals($connectiveConj, $CP->parseConnective('Negation'));
    }

}
