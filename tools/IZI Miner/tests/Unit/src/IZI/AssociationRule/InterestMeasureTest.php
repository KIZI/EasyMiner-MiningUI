<?php

require_once 'Bootstrap.php';

use IZI\AssociationRule\InterestMeasure;

class InterestMeasureTest extends PHPUnit_Framework_TestCase
{
    private $IM;

    protected function setUp()
    {
        $this->IM = new InterestMeasure('Support', 0.91);
    }

    public function testToArray()
    {
        $array = array('name' => 'Support',
            'type' => 'im',
            'category' => '',
            'fields' => array('name' => 'threshold',
                'value' => 0.91));
        $this->assertEquals($array, $this->IM->toArray());
        $this->assertNotEquals(array(), $this->IM->toArray());
    }

}
