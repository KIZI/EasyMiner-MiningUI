<?php

require_once 'Bootstrap.php';

use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataDescriptionParser;

class DataDescriptionParserTest extends PHPUnit_Framework_TestCase
{
    private $DD;

    protected function setUp()
    {
        $loader = new XMLLoader();
        $this->DD = $loader->load(DD);
    }

    public function testParseTransformationDictionary()
    {
        $DDP = new DataDescriptionParser($this->DD);
        $data = $DDP->parseData();
        $data = $data['DD']['transformationDictionary'];

        // all attributes parsed
        $this->assertEquals(8, count($data));

        // correct attribute name
        $this->assertTrue(isset($data['Age']));

        // all attribute choices parsed
        $this->assertEquals(5, count($data['Age']['choices']));

        // correct attribute choice value
        $this->assertEquals('<21;31)', $data['Age']['choices'][0]);
    }

    public function testParseDataDictionary()
    {
        $DDP = new DataDescriptionParser($this->DD);
        $data = $DDP->parseData();
        $data = $data['DD']['dataDictionary'];

        // all fields parsed
        $this->assertEquals(10, count($data));

        // correct field name
        $this->assertTrue(isset($data['amount']));

        // correct field data type
        $this->assertEquals('Long integer', $data['amount']);
    }

}
