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
$id = 'VdcuecAZZEa5MTVm6E7huA';
$data = encodeData(array('guid' => $id, 'content' => file_get_contents('./barboraForLMImport.pmml')));

// register MB
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://lmcloud.vse.cz/SewebarConnect/DataDictionary/Import');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_VERBOSE, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo $response;
