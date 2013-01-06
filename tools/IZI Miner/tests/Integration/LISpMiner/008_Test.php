<?php

require_once 'Bootstrap.php';

/**
 *  Create new task from demo data source, add attribute & mine rules
 */

class Integration_LISpMiner_008_Test extends IZI\Selenium\UITestCase
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

    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Subset");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->select("css=#add-im-select", "value=FUI");
    $this->type("css=#add-im-threshold-value", "0.95");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=#succedent .cedent");
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