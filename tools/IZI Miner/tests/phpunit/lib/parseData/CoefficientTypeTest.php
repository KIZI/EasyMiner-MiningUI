<?php

require_once 'Bootstrap.php';

class CoefficientTypeTest extends PHPUnit_Framework_TestCase
{
    protected function setUp()
    {
        $this->connectiveConj = new Connective('Conjunction');
        $this->connectiveDisj = new Connective('Disjunction');
        $this->connectiveNeg = new Connective('Negation');
    }

    public function coefficientTypeDataSource()
    {
        return array(
            array(array('type' => 'Interval'), 'Interval'),
            array(array('type' => 'Cyclic interval'), 'Cyclic interval'),
            array(array('type' => 'Subset'), 'Subset'),
            array(array('type' => 'Cut'), 'Cut'),
            array(array('type' => 'Left cut'), 'Left cut'),
            array(array('type' => 'Right cut'), 'Right cut'),
            array(array('type' => 'One category'), 'One category'),
            array(array('type' => 'Both boolean'), 'Both boolean'),
            array(array('type' => 'Boolean true'), 'Boolean true'),
            array(array('type' => 'Boolean false'), 'Boolean false')
        );
    }

    /**
     * @dataProvider coefficientTypeDataSource
     */
    public function testCoefficientType($output, $input)
    {
        $coefficient = new CoefficientType($input);

        $this->assertEquals($output, $coefficient->toArray());
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testCoefficientTypeException()
    {
        $coefficient = new CoefficientType('Invalid');
    }
}
