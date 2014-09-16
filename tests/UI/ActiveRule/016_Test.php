<?php

require_once 'Bootstrap.php';

/**
 *  Close add coefficient window
 */

class UI_ActiveRule_016_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-close");
    $this->assertFalse($this->isElementPresent("css=div.field"));
  }
}