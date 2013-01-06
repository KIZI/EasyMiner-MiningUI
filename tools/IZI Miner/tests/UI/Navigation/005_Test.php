<?php

require_once 'Bootstrap.php';

/**
 *  New task window
 */

class UI_Navigation_005_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("");
    $this->assertTrue($this->isElementPresent("css=#new-task-window"));
  }
}