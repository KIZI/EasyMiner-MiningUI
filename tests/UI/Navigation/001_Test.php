<?php

require_once 'Bootstrap.php';

/**
 *  Add attribute
 */

class UI_Navigation_001_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=#field-nav-payments")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#field-nav-payments", "css=#attributes");
    $this->assertTrue($this->isElementPresent("css=#add-attribute-window"));
    $this->runScript("reload();");
  }
}