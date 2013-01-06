<?php

require_once 'Bootstrap.php';

/**
 *  Edit connective
 */

class UI_ActiveRule_017_Test extends IZI\Selenium\UITestCase
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
    $this->click("css=#connective-3 a.edit-connective");
    $this->select("css=#edit-connective-select", "label=Disjunction");
    $this->click("css=#edit-connective-form input[type=\"submit\"]");
    $this->verifyText("css=#connective-4 .connective", "or");
  }
}