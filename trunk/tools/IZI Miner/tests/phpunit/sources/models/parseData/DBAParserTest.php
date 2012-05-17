<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class DBAParserTest extends PHPUnit_Framework_TestCase {

    private $ERXQuery;
    private $ERXQueryXPath;

    protected function setUp()
    {
        $this->ERXQuery = new DOMDocument();
        $this->ERXQuery->load(ERXQuery);
        $this->ERXQueryXPath = new DOMXPath($this->ERXQuery);
    }

    public function testParseDBAs() {
        $CMock = $this->getMock('Connective', array(), array('Conjunction'));
        $CPMock = $this->getMock('ConnectiveParser', array('parseConnective'), array($this->ERXQuery, $this->ERXQueryXPath));
        $CPMock->expects($this->exactly(44))
        ->method("parseConnective")
        ->will($this->returnValue($CMock));
        $DBAP = new DBAParser($this->ERXQuery, $this->ERXQueryXPath, $CPMock);

        $this->assertEquals(44, $DBAP->parseDBAs());
    }

}
