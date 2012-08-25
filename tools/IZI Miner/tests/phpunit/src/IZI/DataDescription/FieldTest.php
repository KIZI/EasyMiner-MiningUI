<?php

require_once 'Bootstrap.php';

use IZI\DataDescription\Field;

class FieldTest extends PHPUnit_Framework_TestCase
{

    public function testToArray()
    {
        $field = new Field('payments', 'Long integer');
        $arr = array('payments' => 'Long integer');

        $this->assertEquals($arr, $field->toArray());
    }

}
