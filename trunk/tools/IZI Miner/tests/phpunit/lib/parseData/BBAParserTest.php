<?php

require_once 'Bootstrap.php';

class BBAParserTest extends PHPUnit_Framework_TestCase
{

    private $ER;
    private $XPath;

    protected function setUp()
    {
        $this->ER = new \DOMDocument();
        $this->ER->load(ERASSOCIATIONRULES);
        $this->XPath = new DOMXPath($this->ER);
    }

    public function testParseBBAs()
    {
        $BBAP = new BBAParser($this->ER, $this->XPath);

        $this->assertEquals(140, $BBAP->parseBBAs());
    }

}
