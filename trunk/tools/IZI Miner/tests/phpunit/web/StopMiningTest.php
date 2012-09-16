<?php

require_once 'Bootstrap.php';

class StopMiningTest extends PHPUnit_Framework_TestCase
{

    public function testStopMining()
    {
        $data = [
            "limitHits" => 250,
            "rule0" => [
                ["name" => "District", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]],
                ["name" => "FUI", "type" => "oper", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]],
                ["name" => "Quality", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]]
            ],
            "rules" => 1];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'stopMining.php?id_dm=TEST&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
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

    public function testStopMiningInvalid()
    {
        $data = [
            "limitHits" => 250,
            "rule0" => [
                ["name" => "District", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]],
                ["name" => "FUI", "type" => "oper", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]],
                ["name" => "Quality", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]]
            ],
            "rules" => 1];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'stopMining.php?id_dm=INVALID&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
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
