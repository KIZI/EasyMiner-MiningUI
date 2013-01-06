<?php

require_once 'Bootstrap.php';

/**
 *  Ask background knowledge manually
 */

class UI_FoundRules_001_Test extends IZI\Selenium\UITestCase
{

  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST&id_kb=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if (!$this->isElementPresent("css=#loading-data")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=Benesov");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=#succedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=#mine-rules-confirm");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.found-rule")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=.found-rule .bk");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ("1" == $this->getXpathCount("//li[@class='found-rule' and @style]")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

  }
}