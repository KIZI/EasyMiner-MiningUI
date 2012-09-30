<?php

require_once "Bootstrap.php";

use IZI\Encoder\URLEncoder;

class URLEncoderTestTest extends PHPUnit_Framework_TestCase
{

    private $encoder;

    public function setUp()
    {
        $this->encoder = new URLEncoder();
    }

    public function testEncodeArray()
    {
        $array = [];
        $result = '';
        $array2 = ['source' => 25, 'query' => '<?xml version="1.0" encoding="UTF-8"?><root>Content</root>', 'template' => '4ftMiner.Task.ARD.Template.PMML'];
        $result2 = 'source=25&query=%3C%3Fxml+version%3D%221.0%22+encoding%3D%22UTF-8%22%3F%3E%3Croot%3EContent%3C%2Froot%3E&template=4ftMiner.Task.ARD.Template.PMML&';

        $this->assertEquals($result, $this->encoder->encode($array));
        $this->assertEquals($result2, $this->encoder->encode($array2));
    }

    public function testEncodeString() {
        $string = 'my string';
        $expected = 'my+string';

        $this->assertEquals($expected, $this->encoder->encode($string));
    }

}