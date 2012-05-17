<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class DataDescriptionParserTest extends PHPUnit_Framework_TestCase {

  private $DD;

  protected function setUp()
  {
    $this->DD = new DOMDocument('1.0', 'UTF-8');
    $this->DD->load(DD, LIBXML_NOBLANKS);
  }

  public function testParseData() {
    $DDP = new DataDescriptionParser($this->DD);
    $data = $DDP->parseData();
    
    // all attributes parsed
    $this->assertEquals(5, count($data['attributes']));
    
    // correct attribute name
    $this->assertTrue(isset($data['attributes']['Age']));
    
    // all attribute choices parsed
    $this->assertEquals(47, count($data['attributes']['Age']['choices']));
    
    // correct attribute choice value
    $this->assertEquals('21', $data['attributes']['Age']['choices'][0]);
  }

}
