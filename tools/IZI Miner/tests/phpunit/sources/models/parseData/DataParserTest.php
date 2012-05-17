<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class DataParserTest extends PHPUnit_Framework_TestCase {

    private $lang;

    protected function setUp() {}
    
    public function testParseDataXQuery() {
        $DP = new DataParser(DD, FL, null, ERXQuery, $this->lang);
        $DP->loadData();
        $data = (array) json_decode($DP->parseData());

        $this->assertTrue(isset($data['attributes']));
        $this->assertEquals(7, count($data));
    }

    public function testParseDataTaskSetting() {
        $DP = new DataParser(DD, FL, null, ERTaskSetting, $this->lang);
        $DP->loadData();
        $data = (array) json_decode($DP->parseData());

        $this->assertTrue(isset($data['attributes']));
        $this->assertEquals(7, count($data));
    }

    public function testParseDataARQuery() {
        $DP = new DataParser(DD, FL, null, ERARQuery, $this->lang);
        $DP->loadData();
        $data = (array) json_decode($DP->parseData());

        $this->assertTrue(isset($data['attributes']));
        $this->assertEquals(7, count($data));
    }

    public function testParseFGC() {
        $DP = new DataParser(DD, FL, FGC, null, $this->lang);
        $DP->loadData();
        $data = (array) json_decode($DP->parseData());

        $this->assertTrue(isset($data['fieldGroups']));
    }

}
