<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class FLInterestMeasureTest extends PHPUnit_Framework_TestCase {

    protected function setUp() {}

    public function testToArray() {
        $array = array('Support' => array(
                     'localizedName' => 'Support',
                     'explanation' => 'Relative support of the rule',
                     'field' => array('name' => 'prahovaHodnota',
                       'localizedName' => 'treshold value',
                       'minValue' => 0,
                       'minValueInclusive' => false,
    				   'maxValue' => 1,
                       'maxValueInclusive' => false,
                       'dataType' => 'double')));
        $IM = new FLInterestMeasure('Support', 'Support', 'Relative support of the rule');
        $IM->setField('prahovaHodnota', 'treshold value', 0, false, 1, false, 'double');

        $this->assertEquals($array, $IM->toArray());
    }

}
