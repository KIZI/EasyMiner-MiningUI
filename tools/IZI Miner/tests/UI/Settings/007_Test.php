<?php

require_once 'Bootstrap.php';

/**
 *  Change caching
 */

class UI_Settings_007_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#cache.cache-off"));
    $this->click("css=#cache");
    $this->assertTrue($this->isElementPresent("css=#cache.cache-on"));
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertTrue($this->isElementPresent("css=#cache.cache-on"));
  }
}