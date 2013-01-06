<?php

require_once 'Bootstrap.php';

/**
 *  Default IMs
 */

class UI_ActiveRule_010_Test extends IZI\Selenium\UITestCase
{
  public function testMyTestCase()
  {
    $this->open("?id_dm=TEST");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ("2" == $this->getXpathCount("//*[@id='interest-measures']/*/div")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

  }
}