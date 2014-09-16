<?php

require_once 'Bootstrap.php';

/**
 *  Remove attribute
 */

class UI_Navigation_003_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=#attribute-nav-district")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
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

    $this->click("css=.mark");
    $this->click("css=#attribute-remove-district");
    $this->getEval("this.browserbot.getUserWindow().localStorage.removeItem(\"hiddenAttributes\")");
  }
}