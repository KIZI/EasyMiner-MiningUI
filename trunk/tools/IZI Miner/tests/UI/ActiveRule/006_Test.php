<?php

require_once 'Bootstrap.php';

/**
 *  Close add IM window
 */

class UI_ActiveRule_006_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("id=add-im");
    $this->assertTrue($this->isElementPresent("id=add-im-window"));
    $this->click("css=#add-im-close");
    $this->assertFalse($this->isElementPresent("id=add-im-window"));
  }
}