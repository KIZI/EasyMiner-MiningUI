<?php

require_once 'Bootstrap.php';

/**
 *  3x add IM (supported combination)
 */

class UI_ActiveRule_008_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->click("css=.remove-im");
    $this->click("css=.remove-im");
    $this->click("id=add-im");
    $this->select("id=add-im-select", "value=DFUI");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->select("id=add-im-select", "value=DLCI");
    $this->click("css=input[type=\"submit\"]");
    $this->click("id=add-im");
    $this->select("id=add-im-select", "value=l");
    $this->click("css=input[type=\"submit\"]");
    try {
        $this->assertEquals("3", $this->getXpathCount("//div[@id='interest-measures']/div/div"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}