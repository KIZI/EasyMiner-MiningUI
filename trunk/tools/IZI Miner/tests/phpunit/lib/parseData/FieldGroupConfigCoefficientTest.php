<?php

require_once 'Bootstrap.php';

class FieldGroupConfigCoefficientTest extends PHPUnit_Framework_TestCase
{
    private $attributes;
    private $coefficients;

    protected function setUp()
    {
        $loader = new XMLFileLoader();
        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->coefficients = $data['BBA']['coefficients'];
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testInvalidCoefficientMinimalLength1()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('Subset'), 0, 2, null, $this->attributes, $this->coefficients);
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testInvalidCoefficientMinimalLength2()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('Subset'), 2, 2, null, $this->attributes, $this->coefficients);
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testInvalidCoefficientMaximalLength1()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('Subset'), 1, 0, null, $this->attributes, $this->coefficients);
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testInvalidCoefficientMaximalLength2()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('Subset'), 1, 6, null, $this->attributes, $this->coefficients);
    }

    /**
     * @expectedException InvalidCoefficientException
     */
    public function testInvalidCoefficientCategory()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('One category'), null, null, 'Invalid', $this->attributes, $this->coefficients);
        ;
    }

    public function testToArray1()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('One category'), null, null,
            'Praha', $this->attributes, $this->coefficients);
        $array = array('District' => array('coefficient' => array('type' => 'One category',
            'category' => 'Praha')));

        $this->assertEquals($array, $coefficient->toArray());
    }

    public function testToArray2()
    {
        $coefficient = new FieldGroupConfigCoefficient('District', new CoefficientType('Subset'), 1, 3,
            null, $this->attributes, $this->coefficients);
        $array = array('District' => array('coefficient' => array('type' => 'Subset',
            'minimalLength' => 1,
            'maximalLength' => 3)));

        $this->assertEquals($array, $coefficient->toArray());
    }

}
