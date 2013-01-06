<?php

require_once 'Bootstrap.php';

/**
 *  Edit attribute
 */

class UI_Navigation_002_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
      $this->markTestSkipped();
    $this->open("?id_dm=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=#attribute-edit-district")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=#attribute-edit-district");
    $this->assertTrue($this->isElementPresent("css=#edit-attribute-window"));
    $this->runScript("reload();");
  }
}