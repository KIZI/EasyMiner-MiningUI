<?php

require_once 'Bootstrap.php';

/**
 *  Edit IM
 */

class UI_ActiveRule_004_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    $this->select("css=#add-im-select", "value=SUPP");
    $this->type("css=#add-im-threshold-value", "0.10");
    $this->click("css=input[type=\"submit\"]");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("css=.edit-im")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("css=.edit-im");
    $this->assertEquals("SUPP", $this->getSelectedValue("css=#edit-im-select"));
    $this->assertEquals("0.10", $this->getValue("css=#edit-im-threshold-value"));
    $this->type("css=#edit-im-threshold-value", "0.20");
    $this->click("css=input[type=\"submit\"]");
    $this->assertEquals("0.20", $this->getText("css=#im-supp .threshold"));
  }
}