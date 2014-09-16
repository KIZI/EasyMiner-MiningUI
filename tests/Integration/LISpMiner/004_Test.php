<?php

require_once 'Bootstrap.php';

/**
 *  A and (neg B or C) => D
 */

class Integration_LISpMiner_004_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=102");
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
    $this->dragAndDropToObject("css=#attribute-nav-salary", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=avg");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=#change-field-sign-2");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Interval");
    $this->type("css=#add-coefficient-maxlength", "2");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=#mark-field-3");
    $this->click("css=#mark-field-2");
    $this->click("css=.group-fields");
    $this->click("css=#connective-3 .edit-connective");
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