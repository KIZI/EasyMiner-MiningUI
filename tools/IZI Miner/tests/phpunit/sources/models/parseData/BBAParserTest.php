<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class BBAParserTest extends PHPUnit_Framework_TestCase {

    private $ERXQuery;
    private $ERXQueryXPath;

    protected function setUp()
    {
        $this->ERXQuery = new DOMDocument();
        $this->ERXQuery->load(ERXQuery);
        $this->ERXQueryXPath = new DOMXPath($this->ERXQuery);
    }

    public function testParseBBAs() {
        $BBAP = new BBAParser($this->ERXQuery, $this->ERXQueryXPath);

        $this->assertEquals(24, $BBAP->parseBBAs());
    }

}
