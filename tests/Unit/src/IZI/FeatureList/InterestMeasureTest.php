<?php

require_once 'Bootstrap.php';

use IZI\FeatureList\InterestMeasure;

class FLInterestMeasureTest extends PHPUnit_Framework_TestCase
{

    public function testIntervalFieldToArray()
    {
        $array = array('Support' => array(
            'default' => true,
            'localizedName' => 'Support',
            'thresholdType' => '% of all',
            'compareType' => 'Greater than or equal',
            'explanation' => 'Relative support of the rule',
            'fields' => array(
                array(
                    'name' => 'threshold',
                    'defaultValue' => 0.05,
                    'localizedName' => 'threshold value',
                    'minValue' => 0,
                    'minValueInclusive' => true,
                    'maxValue' => 1,
                    'maxValueInclusive' => false,
                    'dataType' => 'double'))));
        $IM = new InterestMeasure('Support', 'Support', '% of all', 'Greater than or equal', 'Relative support of the rule', true);
        $IM->addIntervalField('threshold', 0.05, 'threshold value', 0, true, 1, false, 'double');

        $this->assertEquals($array, $IM->toArray());
    }

    public function testEnumerationFieldToArray()
    {
        $this->markTestIncomplete();
    }

}
