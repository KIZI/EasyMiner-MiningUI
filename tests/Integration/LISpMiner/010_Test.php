<?php

require_once 'Bootstrap.php';

/**
 *  Create new task from demo data source, add attribute & mine rules
 */

class Integration_LISpMiner_010_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("/izi-miner/web/?id_dm=102");
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
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=One category");
    $this->select("css=#add-coefficient-category", "value=Praha");
    $this->click("css=input[type=\"submit\"]");
    $this->click("css=div.cedent a.change-sign");
    try {
        $this->assertEquals("0", $this->getXpathCount("//a[@class='change-sign positive']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->dragAndDropToObject("css=#attribute-nav-salary", "css=#antecedent .cedent");
    $this->select("css=#add-coefficient-select", "value=Right cut");
    $this->type("css=#add-coefficient-maxlength", "2");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->select("css=#add-im-select", "value=FUI");
    $this->type("css=#add-im-threshold-value", "0.7");
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