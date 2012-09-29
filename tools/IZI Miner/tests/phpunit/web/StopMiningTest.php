<?php

require_once 'Bootstrap.php';

class StopMiningTest extends PHPUnit_Framework_TestCase
{

    protected $data = [
        "limitHits" => 250,
        "rule0" => [
            "antecedent" => [
                "type" => "cedent",
                "connective" => ["name" => "AND", "type" => "and"],
                "level" => 1,
                "children" => [["name" => "District", "category" => "One category", "fields" => [["name" => "category", "value" => "Praha"]], "sign" => "positive"]],
            ],
            "IMs" => [["name" => "FUI", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]]],
            "succedent" => [
                "type" => "cedent",
                "connective" => ["name" => "AND", "type" => "and"],
                "level" => 1,
                "children" => [["name" => "Quality", "category" => "One category", "fields" => [["name" => "category", "value" => "good"]], "sign" => "positive"]],
            ],
        ],
        "rules" => 1,
    ];

    public function testStopMining()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'stopMining.php?id_dm=TEST&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->data));
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
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'stopMining.php?id_dm=INVALID&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->data));
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