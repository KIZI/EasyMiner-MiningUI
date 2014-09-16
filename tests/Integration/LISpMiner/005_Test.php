<?php

require_once 'Bootstrap.php';

/**
 *  (A and B) or C => D
 */

class Integration_LISpMiner_005_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-salary", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=.edit-connective");
    $this->select("css=#edit-connective-select", "value=Disjunction");
    $this->click("css=input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("css=.mark-field"));
      $this->click("css=#stop-mining");
  }
}