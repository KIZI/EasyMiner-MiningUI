<?php

require_once 'Bootstrap.php';

/**
 *  Group attributes
 */

class UI_ActiveRule_022_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    $this->dragAndDropToObject("css=#attribute-nav-age", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-district", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->dragAndDropToObject("css=#attribute-nav-quality", "css=#antecedent .cedent");
    $this->click("css=#add-coefficient-form input[type=\"submit\"]");
    $this->click("xpath=//a[@class='mark-field']");
    $this->click("xpath=//a[@class='mark-field']");
    $this->click("xpath=//a[@class='group-fields']");
    try {
        $this->assertEquals("1", $this->getXpathCount("//*[@class='fields']/*[position() = 1 and @class='cedent']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertEquals("1", $this->getXpathCount("//*[@class='fields']/*[position() = 2 and @class='connective']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertEquals("1", $this->getXpathCount("//*[@class='fields']/*[position() = 3 and @class='field']"));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}