<?php

require_once 'Bootstrap.php';

/**
 *  Add coefficient - Subset
 */

class UI_ActiveRule_014_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->verifyText("css=div.field span", "Age");
    $this->select("id=add-coefficient-select", "value=Subset");
    $this->type("id=add-coefficient-minlength", "1");
    $this->type("id=add-coefficient-maxlength", "2");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->assertFalse($this->isElementPresent("id=add-coefficient-window"));
    try {
        $this->assertTrue((bool)preg_match('/^Age\([\s\S]*Any one value 1-2\)$/',$this->getText("css=div.field span")));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}