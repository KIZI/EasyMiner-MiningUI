<?php

require_once 'Bootstrap.php';

/**
 *  Close edit connective window
 */

class UI_ActiveRule_018_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-salary", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->verifyText("css=.connective a", "and");
    $this->click("css=.mark-field");
    $this->click("css=.mark-field");
    $this->click("css=.group-fields");
    $this->click("css=#connective-3 a");
    $this->assertTrue($this->isElementPresent("css=#edit-connective-window"));
    $this->click("css=#edit-connective-close");
    $this->assertFalse($this->isElementPresent("css=#edit-connective-window"));
  }
}