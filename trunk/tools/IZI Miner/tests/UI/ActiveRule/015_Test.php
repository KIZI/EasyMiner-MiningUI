<?php

require_once 'Bootstrap.php';

/**
 *  Edit coefficient - Interval
 */

class UI_ActiveRule_015_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->select("id=add-coefficient-select", "value=Interval");
    $this->type("id=add-coefficient-minlength", "1");
    $this->type("id=add-coefficient-maxlength", "3");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->click("css=a#edit-coefficient-1");
    try {
        $this->assertEquals("1", $this->getValue("edit-coefficient-minlength"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertEquals("3", $this->getValue("edit-coefficient-maxlength"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->select("id=edit-coefficient-select", "value=One category");
    $this->click("css=#edit-coefficient-form input[type=\"submit\"]");
    $this->verifyText("css=div.field span", "Age<21;31\)");
  }
}