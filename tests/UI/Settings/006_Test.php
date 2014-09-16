<?php

require_once 'Bootstrap.php';

/**
 *  Change attribute suggestion
 */

class UI_Settings_006_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#as.autosuggest-off"));
    $this->click("css=#as");
    $this->assertTrue($this->isElementPresent("css=#as.autosuggest-on"));
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#as.autosuggest-on"));
  }
}