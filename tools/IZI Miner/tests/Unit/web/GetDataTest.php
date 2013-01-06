<?php

require_once 'Bootstrap.php';

class GetDataTest extends PHPUnit_Framework_TestCase
{

    public function testGetData()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, WEB_PATH.'getData.php?id_dm=TEST&lang=en');
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, false);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $json = json_decode($response);

        $this->assertEquals($info['content_type'], 'application/json; charset=UTF-8');
        $this->assertEquals($info['http_code'], 200);

        $this->assertTrue(array_key_exists('DD', $json));
        $this->assertTrue(array_key_exists('FLs', $json));
        $this->assertTrue(array_key_exists('FGC', $json));
        $this->assertSame('ok', $json->status);
    }
}
