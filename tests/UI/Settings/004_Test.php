<?php

require_once 'Bootstrap.php';

/**
 *  Change maximal number of rules
 */

class UI_Settings_004_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->type("css=#rules-cnt", "10");
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertEquals("10", $this->getValue("css=#rules-cnt"));
  }
}