<?php

require_once 'Bootstrap.php';

/**
 *  Close settings window
*/

class UI_Settings_001_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#settings-window"));
    $this->click("css=#settings-close");
    $this->assertFalse($this->isElementPresent("css=#settings-window"));
  }
}