<?php

require_once 'Bootstrap.php';

use IZI\Parser\ETreeParser;
use IZI\FileLoader\XMLLoader;

class ETreeParserTest extends PHPUnit_Framework_TestCase
{
    protected $ETree;

    public function setUp()
    {
        $loader = new XMLLoader();
        $this->ETree = $loader->load(DATA_PATH.'etree_result.pmml');
    }

    public function testParseData()
    {
        $parser = new ETreeParser($this->ETree);

        $this->assertArrayHasKey('recommendedAttributes', $parser->parseData());
        $this->assertCount(5, $parser->parseData()['recommendedAttributes']);
    }

}
