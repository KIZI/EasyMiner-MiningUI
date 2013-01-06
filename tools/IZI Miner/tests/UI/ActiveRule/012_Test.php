<?php

require_once 'Bootstrap.php';

/**
 *  Add coefficient - One category
 */

class UI_ActiveRule_012_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("id=add-coefficient-select", "value=One category");
    $this->select("id=add-coefficient-category", "label=<21;31)");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("id=add-coefficient-window"));
    $this->verifyText("css=#field-drag-1", "Age<21;31\)");
    $this->assertTrue($this->isElementPresent("id=edit-coefficient-1"));
  }
}