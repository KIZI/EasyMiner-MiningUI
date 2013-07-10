<?php

require_once 'Bootstrap.php';

/**
 *  A or B => C
 */

class Integration_LISpMiner_001_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=5");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if (!$this->isElementPresent("css=#loading-data")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=Praha");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=Brno");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=.edit-connective");
    $this->select("css=#edit-connective-select", "value=Disjunction");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=#succedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=#mine-rules-confirm");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.found-rule")) break;
        } catch (Exception $e) {}
        sleep(1);
    }
    $this->click("css=#stop-mining");
  }
}