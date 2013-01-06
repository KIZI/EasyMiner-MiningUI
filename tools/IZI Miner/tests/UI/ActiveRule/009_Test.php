<?php

require_once 'Bootstrap.php';

/**
 *  Hide add IM button
 */

class UI_ActiveRule_009_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->select("css=#fl-select", "value=Beginner");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("css=#add-im"));
  }
}