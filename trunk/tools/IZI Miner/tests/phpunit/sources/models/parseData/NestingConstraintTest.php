<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class NestingConstraintTest extends PHPUnit_Framework_TestCase {

    protected function setUp() {}

    public function testToArray() {
        $array = array('level1' => array('Conjunction' => array('allowed' => true),
                     		   	 'Disjunction' => array('allowed' => false),
                                 'Any' => array('allowed' => false),
                                 'Negation' => array('allowed' => true)));
        $NC = new NestingConstraint();
        $NC->setLevel(1);
        $NC->addConnective('Conjunction', true);
        $NC->addConnective('Disjunction', false);
        $NC->addConnective('Any', false);
        $NC->addConnective('Negation', true);

        $this->assertEquals($array, $NC->toArray());
    }

}