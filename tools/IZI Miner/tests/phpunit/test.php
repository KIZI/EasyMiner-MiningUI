<?php

//require_once 'Bootstrap.php';

class Example extends PHPUnit_Extensions_SeleniumTestCase
{
    protected function setUp()
    {
        $this->setBrowser("*firefox");
        $this->setBrowserUrl("http://localhost/");
    }

    public function testMyTestCase()
    {
        $this->open("");
        $this->verifyTextPresent("It works!");
    }
}
?>