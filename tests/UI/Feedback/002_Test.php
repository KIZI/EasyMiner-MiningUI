<?php

require_once 'Bootstrap.php';

/**
 *  Hide feedback module
 */

class UI_Feedback_002_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("");
    $this->click("css=#uvTabLabel");
    $this->assertTrue($this->isElementPresent("css=.uvw-dialog-open"));
    $this->click("css=#uvw-dialog-close button");
    $this->assertFalse($this->isElementPresent("css=.uvw-dialog-open"));
  }
}