<?php

require_once 'Bootstrap.php';

class ConnectiveTest extends PHPUnit_Framework_TestCase
{
    private $connectiveConj;
    private $connectiveDisj;
    private $connectiveNeg;

    protected function setUp()
    {
        $this->connectiveConj = new Connective('Conjunction');
        $this->connectiveDisj = new Connective('Disjunction');
        $this->connectiveNeg = new Connective('Negation');
    }

    /**
     * @expectedException InvalidConnectiveException
     */
    public function testConstructException()
    {
        $connestive = new Connective('Invalid');
    }

    public function testIsUnary()
    {
        $this->assertFalse($this->connectiveConj->isUnary());
        $this->assertFalse($this->connectiveDisj->isUnary());
        $this->assertTrue($this->connectiveNeg->isUnary());
    }

    public function testIsBinary()
    {
        $this->assertTrue($this->connectiveConj->isBinary());
        $this->assertTrue($this->connectiveDisj->isBinary());
        $this->assertFalse($this->connectiveNeg->isBinary());
    }

    public function testGetLbrac()
    {
        $array = array('name' => '(',
            'type' => 'lbrac',
            'category' => '',
            'fields' => array());
        $this->assertEquals($array, $this->connectiveConj->getLbrac());
    }

    public function testGetRbrac()
    {
        $array = array('name' => ')',
            'type' => 'rbrac',
            'category' => '',
            'fields' => array());
        $this->assertEquals($array, $this->connectiveConj->getRbrac());
    }

    public function testToArray()
    {
        $array = array('name' => 'AND',
            'type' => 'and',
            'category' => '',
            'fields' => array());
        $this->assertEquals($array, $this->connectiveConj->toArray());

        $array = array('name' => 'OR',
            'type' => 'or',
            'category' => '',
            'fields' => array());
        $this->assertEquals($array, $this->connectiveDisj->toArray());

        $array = array('name' => 'NEG',
            'type' => 'neg',
            'category' => '',
            'fields' => array());
        $this->assertEquals($array, $this->connectiveNeg->toArray());
    }

}
