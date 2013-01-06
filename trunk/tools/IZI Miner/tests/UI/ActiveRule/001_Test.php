<?php

require_once 'Bootstrap.php';

/**
 *  Add IM - Interval
 */

class UI_ActiveRule_001_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    $this->select("id=add-im-select", "value=FUI");
    $this->type("css=#add-im-threshold-value", "0.50");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("id=add-im-window"));
    $this->assertTrue($this->isElementPresent("id=im-fui"));
    $this->verifyText("css=#im-fui .threshold", "0.50");
  }
}