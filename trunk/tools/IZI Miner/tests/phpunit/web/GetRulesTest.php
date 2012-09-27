<?php

require_once 'Bootstrap.php';

class GetRulesTest extends PHPUnit_Framework_TestCase
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

    public function testGetRules()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getRules.php?id_dm=TEST&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->data));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals($info['content_type'], 'application/json; charset=UTF-8');
        $this->assertEquals($info['http_code'], 200);
        $this->assertNotEmpty($json->rules);
        $this->assertTrue(array_key_exists('taskState', $json));
        $this->assertTrue(array_key_exists('task', $json));
        $this->assertTrue(array_key_exists('result', $json));
        $this->assertSame('ok', $json->status);
    }

    public function testGetRulesInvalid()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getRules.php?id_dm=INVALID&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->data));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals($info['content_type'], 'application/json; charset=UTF-8');
        $this->assertEquals($info['http_code'], 200);
        $this->assertSame('error', $json->status);
    }

}
