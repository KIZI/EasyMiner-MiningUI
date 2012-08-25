<?php

require_once 'Bootstrap.php';

class BBATest extends PHPUnit_Framework_TestCase
{
    private $BBA;

    protected function setUp()
    {
        $this->BBA = new BBA('ant_001', 'Sex', array('F'));
    }

    /**
     * @expectedException InvalidBBAException
     */
    public function testConstructException()
    {
        new BBA('ant_001', null, array('M'));
    }

    /**
     * @expectedException InvalidBBAException
     */
    public function testConstructException2()
    {
        new BBA('ant_001', array('fieldRef'), array('M'));
    }

    /**
     * @expectedException InvalidBBAException
     */
    public function testConstructException3()
    {
        new BBA('ant_001', 'Sex', null);
    }

    /**
     * @expectedException InvalidBBAException
     */
    public function testConstructException4()
    {
        new BBA('ant_001', 'Sex', array());
    }

    /**
     * @expectedException InvalidBBAException
     */
    public function testConstructException5()
    {
        new BBA('ant_001', 'Sex', 'M');
    }

    public function testActiveToArray()
    {
        $array = array(array('name' => 'Sex',
            'type' => 'attr',
            'category' => 'One category',
            'active' => true,
            'fields' => array(array('name' => 'coef',
                'value' => 'F'))));
        $this->assertEquals($array, $this->BBA->toArray());
    }

    public function testInactiveToArray()
    {
        $array = array(array('name' => 'Sex',
            'type' => 'attr',
            'category' => 'One category',
            'active' => false,
            'fields' => array(array('name' => 'coef',
                'value' => 'F'))));
        $this->BBA->setActive(false);
        $this->assertEquals($array, $this->BBA->toArray());
    }

}
