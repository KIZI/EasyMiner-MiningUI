<?php

require_once 'Bootstrap.php';

use IZI\FeatureList\NestingConstraint;

class NestingConstraintTest extends PHPUnit_Framework_TestCase
{

    public function testToArray()
    {
        $array = array(
            'Conjunction' => true,
            'Disjunction' => false,
            'Any' => false,
            'Negation' => true);
        $NC = new NestingConstraint();
        $NC->addConnective('Conjunction', true);
        $NC->addConnective('Disjunction', false);
        $NC->addConnective('Any', false);
        $NC->addConnective('Negation', true);

        $this->assertEquals($array, $NC->toArray());
    }

}