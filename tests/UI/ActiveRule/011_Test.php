<?php

require_once 'Bootstrap.php';

/**
 *  Add attribute
 */

class UI_ActiveRule_011_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->assertTrue($this->isElementPresent("css=div#cedent-1 div#field-1"));
    $this->click("css=input[type=\"submit\"]");
  }
}