<?php

require_once 'Bootstrap.php';

/**
 *  Change attribute sign
 */

class UI_ActiveRule_021_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    try {
        $this->assertEquals("1", $this->getXpathCount("//a[@class='change-sign positive']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->click("css=div.cedent a.change-sign");
    try {
        $this->assertEquals("1", $this->getXpathCount("//a[@class='change-sign negative']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}