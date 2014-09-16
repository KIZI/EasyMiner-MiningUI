<?php

require_once 'Bootstrap.php';

class QUnitTest extends IZI\Selenium\QUnitTestCase
{
    public function testMyTestCase()
    {
        $this->open('');
        $this->waitForElementPresent('css=#qunit-testresult');
        $this->assertText('css=.failed', '0');
    }
}