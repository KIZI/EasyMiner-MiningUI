<?php

require_once 'Bootstrap.php';

use IZI\Parser\DataParser;

class DataParserTest extends PHPUnit_Framework_TestCase
{
    private $lang = 'en';

    public function testParseDataAssociationRules()
    {
        $DP = new DataParser(DD, FL, FGC, ERASSOCIATIONRULES, null, $this->lang);
        $DP->loadData();
        $data = (array)json_decode($DP->parseData());

        $this->assertTrue(isset($data['DD']));
        $this->assertEquals(5, count($data));
    }

    public function testParseDataTaskSetting()
    {
        $this->markTestSkipped();
        $DP = new DataParser(DD, FL, FGC, ERTASKSETTING, null, $this->lang);
        $DP->loadData();
        $data = (array)json_decode($DP->parseData());

        $this->assertTrue(isset($data['DD']));
        $this->assertEquals(5, count($data));
    }

    public function testParseDataARQuery()
    {
        $this->markTestSkipped();
        $DP = new DataParser(DD, FL, FGC, ERARQUERY, null, $this->lang);
        $DP->loadData();
        $data = (array)json_decode($DP->parseData());

        $this->assertTrue(isset($data['DD']));
        $this->assertEquals(5, count($data));
    }

    public function testParseFGC()
    {
        $DP = new DataParser(DD, FL, FGC, null, null, $this->lang);
        $DP->loadData();
        $data = (array)json_decode($DP->parseData());

        $this->assertTrue(isset($data['FGC']));
    }

}
