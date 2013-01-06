<?php

require_once 'Bootstrap.php';

/**
 *  Move attribute between cedents
 */

class UI_ActiveRule_020_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=div.cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=div.cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=div.cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    try {
        $this->assertEquals("1", $this->getXpathCount("//div[@class='cedent']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->click("xpath=//a[@class='mark-field']");
    $this->click("xpath=//a[@class='mark-field']");
    $this->click("xpath=//a[@class='group-fields']");
    $this->dragAndDropToObject("css=#field-drag-3", "css=#cedent-3");
    try {
        $this->assertEquals("1", $this->getXpathCount("//div[@class='cedent']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}