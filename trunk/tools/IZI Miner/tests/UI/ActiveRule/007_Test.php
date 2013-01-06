<?php

require_once 'Bootstrap.php';

/**
 *  Add IM window autocomplete
 */

class UI_ActiveRule_007_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    try {
        $this->assertEquals("Confidence", $this->getSelectedLabel("id=add-im-select"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->select("id=add-im-select", "label=Support");
    sleep(0.5);
    try {
        $this->assertEquals("Support", $this->getSelectedLabel("id=add-im-select"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}