<?php

require_once 'Bootstrap.php';

/**
 *  Hide download icons
 */

class UI_FoundRules_015_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
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
            if ($this->isVisible("css=#view-task-setting")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isVisible("css=#view-task-result")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.found-rule")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=#pager-clear");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if (!$this->isVisible("css=#view-task-setting")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if (!$this->isVisible("css=#view-task-result")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

  }
}