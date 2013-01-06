<?php

require_once 'Bootstrap.php';

/**
 *  Add IM - enumeration
 */

class UI_ActiveRule_002_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("id=add-im");
    $this->select("css=#add-im-select", "value=CHI");
    $this->type("css=#add-im-alpha-value", "0.025");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("id=add-im-window"));
    $this->assertTrue($this->isElementPresent("id=im-chi"));
    $this->verifyText("css=#im-chi .alpha", "α 0.025");
  }
}