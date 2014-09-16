<?php

require_once 'Bootstrap.php';

/**
 *  Show feedback module
 */

class UI_Feedback_001_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("");
    $this->click("css=#uvTabLabel");
    $this->assertTrue($this->isElementPresent("css=.uvw-dialog-open"));
  }
}