<?php

require_once "Bootstrap.php";

use IZI\FileLoader\XMLFileLoader;
use IZI\Exception\FileNotFoundException;

class XMLFileLoaderTest extends PHPUnit_Framework_TestCase
{

    private $loader;

    public function setUp()
    {
        $this->loader = new XMLFileLoader();
    }

    public function testLoad()
    {
        $file = $this->loader->load(DD);
        $this->assertInstanceOf('DOMDocument', $file);
    }

    /**
     * @expectedException IZI\Exception\FileNotFoundException
     */
    public function testFileNotFound()
    {
        $this->loader->load('invalid-name.xml');
    }

}
