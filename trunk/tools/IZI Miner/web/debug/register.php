<?php

// data encoding
function encodeData($array) {
    $data = "";
    foreach ($array as $key => $value) {
        $data .= "{$key}=".urlencode($value).'&';
    }

    return $data;
}

// prepare data
$data = encodeData(array('type' => 'AccessConnection'));

// register MB
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://lmcloud.vse.cz/SewebarConnect/Application/Register');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_VERBOSE, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

preg_match('*id="([a-zA-Z0-9_]{1,})"*', $response, $matches);
$id = $matches[1];

echo $id;