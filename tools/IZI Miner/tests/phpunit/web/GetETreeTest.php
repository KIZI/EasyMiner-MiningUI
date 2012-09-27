<?php

require_once 'Bootstrap.php';

class ETreeTest extends PHPUnit_Framework_TestCase
{

    protected $data = [
        "attributes" => [
            "Age", "Age ", "Age_in_years", "Amount", "Duration", "Repayment", "Salary", "Sex",
        ],
        "rule0" => [
            "antecedent" => [
                "type" => "cedent",
                "connective" => ["name" => "AND", "type" => "and"],
                "level" => 1,
                "children" => [["name" => "District", "category" => "One category", "fields" => [["name" => "category", "value" => "Praha"]], "sign" => "positive"]],
            ],
            "IMs" => [["name" => "CHI", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "alpha", "value" => "0.01"]]]],
            "succedent" => [
                "type" => "cedent",
                "connective" => ["name" => "AND", "type" => "and"],
                "level" => 1,
                "children" => [["name" => "Quality", "category" => "One category", "fields" => [["name" => "category", "value" => "good"]], "sign" => "positive"]],
            ],
        ],
        "rules" => 1,
    ];

    public function testGetETree()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getETree.php?id_dm=TEST&lang=en');
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
        $this->assertObjectHasAttribute('recommendation', $json);
    }

    public function testGetETreeInvalidDm()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getETree.php?id_dm=INVALID&lang=en');
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
