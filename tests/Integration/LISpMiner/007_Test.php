<?php

require_once 'Bootstrap.php';

/**
 *  Create new task from demo data source, add attribute & mine rules
 */

class Integration_LISpMiner_007_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("");
    $this->click("css=.bigButtonsDiv a");
    $this->waitForPageToLoad("30000");
    $this->click("css=input.bigButton");
    $this->waitForPageToLoad("30000");
    $this->click("link=Select all");
    sleep(0.5);
    $this->click("class=bigButton");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=#field-nav-amount")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#field-nav-amount", "css=#attributes ul");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.bigButtonsDiv a")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=.bigButtonsDiv a");
    $this->waitForPageToLoad("30000");
    $this->click("css=.formActionsDiv a");
    $this->waitForPageToLoad("30000");
    $this->click("css=.formActionsDiv input");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=#attribute-nav-amountequidistant-intervals")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->dragAndDropToObject("css=#attribute-nav-amountequidistant-intervals", "css=#antecedent .cedent");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->click("css=input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-status", "css=#succedent .cedent");
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