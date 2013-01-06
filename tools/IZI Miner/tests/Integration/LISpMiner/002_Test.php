<?php

require_once 'Bootstrap.php';

/**
 *  A => neg B
 */

class Integration_LISpMiner_002_Test extends IZI\Selenium\UITestCase
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

    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=#succedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=bad");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=.change-sign.positive");
    $this->dragAndDropToObject("css=#attribute-nav-repayment", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
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