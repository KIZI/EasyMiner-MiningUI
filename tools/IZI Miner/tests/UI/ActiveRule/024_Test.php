<?php

require_once 'Bootstrap.php';

/**
 *  BUG: Drag add IM knob (category)
 */

class UI_ActiveRule_024_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("id=add-im");
    $this->select("css=#add-im-select", "value=CHI");
    $this->dragAndDrop("css=.knob", "50,0");
    try {
        $this->assertEquals("0.1", $this->getValue("css=#add-im-alpha-value"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}