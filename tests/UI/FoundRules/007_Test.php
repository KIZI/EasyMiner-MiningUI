<?php

require_once 'Bootstrap.php';

/**
 *  Mining indicator - not started
 */

class UI_FoundRules_007_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if (!$this->isElementPresent("css=#loading-data")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->assertTrue($this->isElementPresent("css=.mining-not-started"));
  }
}