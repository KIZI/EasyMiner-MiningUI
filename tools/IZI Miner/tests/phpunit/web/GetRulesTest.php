<?php

require_once 'Bootstrap.php';

class GetRulesTest extends PHPUnit_Framework_TestCase
{

    public function testGetRules()
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
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getRules.php?id_dm=TEST&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
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
        $this->assertTrue(array_key_exists('4ft_task', $json));
        $this->assertTrue(array_key_exists('4ft_result', $json));
    }

    public function testGetRulesInvalid()
    {
        $this->markTestSkipped();
        $data = ['data' => [
            "limitHits" => 250,
            "rule0" => [
                ["name" => "District", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]],
                ["name" => "FUI", "type" => "oper", "thresholdType" => "% of all", "compareType" => "Greater than or equal", "fields" => [["name" => "threshold", "value" => "0.70"]]],
                ["name" => "Quality", "type" => "attr", "category" => "Subset", "fields" => [["name" => "minLength", "value" => "1"], ["name" => "maxLength", "value" => "1"]]]
            ],
            "rules" => 1]];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getRules.php?id_dm=INVALID&lang=en');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, false);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals($info['content_type'], 'application/json; charset=UTF-8');
        $this->assertEquals($info['http_code'], 200);
        $this->assertTrue($json->failure);
        $this->assertTrue(array_key_exists('4ft_task', $json));
    }

}
