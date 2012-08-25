<?php

require_once "Bootstrap.php";

use IZI\FileLoader\XMLStringLoader;

class XMLStringLoaderTest extends PHPUnit_Framework_TestCase
{

    private $loader;

    public function setUp()
    {
        $this->loader = new XMLStringLoader();
    }

    public function testLoad()
    {
        $xml = '<?xml version="1.0"?>
                <note>
                    <to>Tove</to>
                    <from>Jani</from>
                    <heading>Reminder</heading>
                    <body>Do not forget me this weekend!</body>
                </note>';
        $document = $this->loader->load($xml);
        $this->assertInstanceOf('DOMDocument', $document);
    }

}