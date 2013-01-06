<?php

require_once 'Bootstrap.php';

/**
 *  Change auto filter
 */

class UI_Settings_005_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#autofilter.autofilter-off"));
    $this->click("css=#autofilter");
    $this->assertTrue($this->isElementPresent("css=#autofilter.autofilter-on"));
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#autofilter.autofilter-on"));
  }
}