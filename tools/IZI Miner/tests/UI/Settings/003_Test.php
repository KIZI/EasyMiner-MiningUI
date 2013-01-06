<?php

require_once 'Bootstrap.php';

/**
*  Settings form autocomplete
*/

class UI_Settings_003_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->type("css=#rules-cnt", "10");
    $this->select("css=#fl-select", "value=Beginner");
    $this->assertEquals("10", $this->getValue("css=#rules-cnt"));
  }
}