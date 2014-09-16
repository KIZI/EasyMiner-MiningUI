<?php

require_once 'Bootstrap.php';

/**
 *  Change Feature List
 */

class UI_Settings_002_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ("1" == $this->getXpathCount("//ul/li[@class='used']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=#settings-open");
    $this->select("css=#fl-select", "value=Beginner");
    $this->click("css=input[type='submit']");
    $this->assertFalse($this->isElementPresent("css=#settings-window"));
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ("0" == $this->getXpathCount("//ul/li[8][@id='attribute-nav-age' and @class='used']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->assertFalse($this->isElementPresent("css=#antecedent .field"));
  }
}