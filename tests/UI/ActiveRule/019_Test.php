<?php

require_once 'Bootstrap.php';

/**
 *  Remove attribute
 */

class UI_ActiveRule_019_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->click("css=#remove-field-1");
    $this->assertFalse($this->isElementPresent("css=div.cedent  div.field"));
  }
}