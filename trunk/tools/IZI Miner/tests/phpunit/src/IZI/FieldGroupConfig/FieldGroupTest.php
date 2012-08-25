<?php

require_once 'Bootstrap.php';

use IZI\FieldGroupConfig\FieldGroup;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataDescriptionParser;
use IZI\Parser\FeatureListParser;

class FieldGroupTestTest extends PHPUnit_Framework_TestCase
{
    private $attributes;
    private $coefficients;

    protected function setUp()
    {
        $loader = new XMLLoader();
        $DD = $loader->load(DD);
        $DDP = new DataDescriptionParser($DD);
        $data = $DDP->parseData();
        $this->attributes = $data['DD']['transformationDictionary'];

        $FL = $loader->load(FL);
        $FLP = new FeatureListParser($FL, 'en');
        $data = $FLP->parseData();
        $this->coefficients = $data['BBA']['coefficients'];
    }

    public function testToArray1()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);
        $FGCXPath = new DOMXPath($FGC);
        $FGCXPath->registerNamespace('fg', 'http://keg.vse.cz/ns/fieldgroupconfig0_1');

        $FGCNode = $FGCXPath->evaluate('//FieldGroupConfig[1]')->item(0);
        $FG = new FieldGroup($FGCNode, $FGCXPath, 'en', true, $this->attributes, $this->coefficients);
        $FG->parse();

        $array = array(0 => array('id' => 1,
            'name' => 'Root',
            'localizedName' => 'Root',
            'explanation' => 'Root attribute group.',
            'fieldConfig' => array('District' => array('coefficient' => array('type' => 'Subset',
                'minimalLength' => 1,
                'maximalLength' => 1))),
            'childGroups' => array(2),
            'connective' => 'Conjunction'));
        $data = $FG->toArray();

        $this->assertEquals($array, $data);
    }

    public function testToArray2()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGC, LIBXML_NOBLANKS);
        $FGCXPath = new DOMXPath($FGC);
        $FGCXPath->registerNamespace('fg', 'http://keg.vse.cz/ns/fieldgroupconfig0_1');

        $FGCNode = $FGCXPath->evaluate('//FieldGroupConfig[2]')->item(0);
        $FG = new FieldGroup($FGCNode, $FGCXPath, 'en', false, $this->attributes, $this->coefficients);
        $FG->parse();

        $array = array(0 => array('id' => 2,
            'name' => 'Personal characteristics',
            'localizedName' => 'Personal characteristics',
            'explanation' => 'Personal characteristics of a client.',
            'fieldConfig' => array('Salary' => array('coefficient' => array('type' => 'Subset',
                'minimalLength' => 1,
                'maximalLength' => 1)),
                'Sex' => array('coefficient' => array('type' => 'One category',
                    'category' => 'M')),
                'Age' => array('coefficient' => array('type' => 'Subset',
                    'minimalLength' => 1,
                    'maximalLength' => 1))),
            'childGroups' => array(),
            'connective' => 'Conjunction'));
        $data = $FG->toArray();

        $this->assertEquals($array, $data);
    }

    public function testInvalidAttribute()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCINVALIDATTRIBUTE, LIBXML_NOBLANKS);
        $FGCXPath = new DOMXPath($FGC);
        $FGCXPath->registerNamespace('fg', 'http://keg.vse.cz/ns/fieldgroupconfig0_1');

        $FGCNode = $FGCXPath->evaluate('//FieldGroupConfig[1]')->item(0);
        $FG = new FieldGroup($FGCNode, $FGCXPath, 'en', true, $this->attributes, $this->coefficients);
        $this->assertNull($FG->parse());
    }

    public function testInvalidCoefficientType()
    {
        $FGC = new \DOMDocument('1.0', 'UTF-8');
        $FGC->load(FGCINVALIDCOEFFICIENTTYPE, LIBXML_NOBLANKS);
        $FGCXPath = new DOMXPath($FGC);
        $FGCXPath->registerNamespace('fg', 'http://keg.vse.cz/ns/fieldgroupconfig0_1');

        $FGCNode = $FGCXPath->evaluate('//FieldGroupConfig[1]')->item(0);
        $FG = new FieldGroup($FGCNode, $FGCXPath, 'en', true, $this->attributes, $this->coefficients);
        $this->assertNull($FG->parse());
    }

}
