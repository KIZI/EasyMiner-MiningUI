<?php

require_once 'Bootstrap.php';

class CoefficientTest extends PHPUnit_Framework_TestCase
{
    protected function setUp()
    {
    }

    public function testToArray1()
    {
        $array = array('One category' => array(
            'localizedName' => 'One category',
            'explanation' => 'One value can be chosen',
            'fields' => array('category' => array(
                'localizedName' => 'category',
                'minValue' => null,
                'minValueInclusive' => true,
                'maxValue' => null,
                'maxValueInclusive' => true,
                'dataType' => 'string',
                'previous' => null))));
        $C = new Coefficient('One category', 'One category', 'One value can be chosen');
        $C->addField('category', 'category', null, true, null, true, 'string', null);
        $this->assertEquals($array, $C->toArray());
    }

    public function testToArray2()
    {
        $array = array('Subset' => array(
            'localizedName' => 'Subset',
            'explanation' => 'Subset of values can be chosen',
            'fields' => array('minLength' => array(
                'localizedName' => 'minimum length',
                'minValue' => 1,
                'minValueInclusive' => true,
                'maxValue' => 1,
                'maxValueInclusive' => true,
                'dataType' => 'integer',
                'previous' => null),
                'maxLength' => array(
                    'localizedName' => 'maximum length',
                    'minValue' => 1,
                    'minValueInclusive' => true,
                    'maxValue' => 5,
                    'maxValueInclusive' => true,
                    'dataType' => 'integer',
                    'previous' => 'isSmallerOrEqual'))));
        $C = new Coefficient('Subset', 'Subset', 'Subset of values can be chosen');
        $C->addField('minLength', 'minimum length', 1, true, 1, true, 'integer', null);
        $C->addField('maxLength', 'maximum length', 1, true, 5, true, 'integer', 'isSmallerOrEqual');
        $this->assertEquals($array, $C->toArray());
    }

}