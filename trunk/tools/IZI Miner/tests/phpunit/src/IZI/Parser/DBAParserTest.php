<?php

require_once 'Bootstrap.php';

use IZI\Parser\DBAParser;

class DBAParserTest extends PHPUnit_Framework_TestCase
{
    private $ER;
    private $XPath;

    protected function setUp()
    {
        $this->ER = new \DOMDocument();
        $this->ER->load(ERASSOCIATIONRULES);
        $this->XPath = new \DOMXPath($this->ER);
    }

    public function testParseDBAs()
    {
        $CMock = $this->getMock('IZI\AssociationRule\Connective', array(), array('Conjunction'));
        $CPMock = $this->getMock('IZI\Parser\ConnectiveParser', array('parseConnective'), array($this->ER, $this->XPath));
        $CPMock->expects($this->exactly(426))
            ->method("parseConnective")
            ->will($this->returnValue($CMock));
        $DBAP = new DBAParser($this->ER, $this->XPath, $CPMock);

        $this->assertEquals(426, $DBAP->parseDBAs());
    }

}
