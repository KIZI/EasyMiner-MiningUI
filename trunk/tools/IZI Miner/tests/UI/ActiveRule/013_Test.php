<?php

require_once 'Bootstrap.php';

/**
 *  Edit coefficient - One category
 */

class UI_ActiveRule_013_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("id=add-coefficient-select", "value=One category");
    $this->select("id=add-coefficient-category", "label=<31;41)");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->click("css=a#edit-coefficient-1");
    $this->assertEquals("<31;41)", $this->getSelectedLabel("id=edit-coefficient-category"));
    $this->select("id=edit-coefficient-select", "value=Subset");
    $this->click("css=#edit-coefficient-form input[type=\"submit\"]");
    try {
        $this->assertTrue((bool)preg_match('/^Age\([\s\S]*\)$/',$this->getText("css=div.field span")));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}