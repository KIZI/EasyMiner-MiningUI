<?php

require_once 'Bootstrap.php';

/**
 *  Add IM - no slider
 */

class UI_ActiveRule_003_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("id=add-im");
    $this->select("id=add-im-select", "value=a");
    $this->type("css=#add-im-threshold-value", "100");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("id=add-im-window"));
    $this->assertTrue($this->isElementPresent("id=im-a"));
    $this->verifyText("css=#im-a .threshold", "100");
  }
}