<?php

require_once 'Bootstrap.php';

/**
 *  Remove IM
 */

class UI_ActiveRule_005_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    $this->click("css=input[type=\"submit\"]");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.remove-im")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=.remove-im");
    $this->assertFalse($this->isElementPresent("css=.remove-im"));
  }
}