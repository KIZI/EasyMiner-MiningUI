<?php

require_once 'Bootstrap.php';

/**
 *  BUG: Selected Feature List
 */

class UI_Settings_010_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=#settings-open");
    $this->select("css=#fl-select", "value=Beginner");
    $this->click("css=input[type='submit']");
    $this->click("css=#settings-open");
    $this->assertEquals("1", $this->getSelectedIndex("css=#fl-select"));
  }
}