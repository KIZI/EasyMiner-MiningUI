<?php

require_once 'Bootstrap.php';

class GetBKTest extends PHPUnit_Framework_TestCase
{

    protected $askData = [
        "limitHits" => 250,
        "rule0" => [
            ["name" => "District", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]],
            ["name" => "FUI", "type" => "oper", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]],
            ["name" => "Quality", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]]
        ],
        "rules" => 1];
    protected $saveData = [
        "limitHits" => 250,
        "rule0" => [
            ["name" => "District", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]],
            ["name" => "FUI", "type" => "oper", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]],
            ["name" => "Quality", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]]
        ],
        "rules" => 1];

    public function testSaveInteresting()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=TEST&id_kb=TEST&action=saveInteresting&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('ok', $json->status);
    }

    public function testSaveInterestingInvalidDm()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=INVALID&id_kb=TEST&action=saveInteresting&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

    public function testSaveInterestingInvalidKb()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=TEST&id_kb=INVALID&action=saveInteresting&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

    public function testSaveNotInterestingInvalidDm()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=INVALID&id_kb=TEST&action=saveNotInteresting&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

    public function testSaveNotInterestingInvalidKb()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=TEST&id_kb=INVALID&action=saveNotInteresting&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

    public function testAsk()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=TEST&id_kb=TEST&action=ask&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->askData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('ok', $json->status);
        $this->assertObjectHasAttribute('confirmation', $json);
        $this->assertObjectHasAttribute('hits', $json->confirmation);
        $this->assertObjectHasAttribute('numInteresting', $json->confirmation);
        $this->assertObjectHasAttribute('numNotInteresting', $json->confirmation);
        $this->assertObjectHasAttribute('exception', $json);
        $this->assertObjectHasAttribute('hits', $json->exception);
        $this->assertObjectHasAttribute('numInteresting', $json->exception);
        $this->assertObjectHasAttribute('numNotInteresting', $json->exception);
    }

    public function testAskInvalidDm()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=INVALID&id_kb=TEST&action=ask&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

    public function testAskInvalidKb()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getBK.php?id_dm=TEST&id_kb=INVALID&action=ask&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->saveData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals('application/json; charset=UTF-8', $info['content_type']);
        $this->assertEquals(200, $info['http_code']);
        $this->assertSame('error', $json->status);
    }

}
