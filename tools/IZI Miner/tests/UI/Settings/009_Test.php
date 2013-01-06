<?php

require_once 'Bootstrap.php';

/**
 *  Change strict match
 */

class UI_Settings_009_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#strict.strict-off"));
    $this->click("css=#strict");
    $this->assertTrue($this->isElementPresent("css=#strict.strict-on"));
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#strict.strict-on"));
  }
}