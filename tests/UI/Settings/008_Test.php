<?php

require_once 'Bootstrap.php';

/**
 *  Change debug mode
 */

class UI_Settings_008_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#debug.debug-off"));
    $this->click("css=#debug");
    $this->assertTrue($this->isElementPresent("css=#debug.debug-on"));
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#debug.debug-on"));
  }
}