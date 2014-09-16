<?php

require_once '../../config/Config.php';
require_once '../../lib/Bootstrap.php';

// data encoding
function encodeData($array) {
    $data = "";
    foreach ($array as $key => $value) {
        $data .= "{$key}=".urlencode($value).'&';
    }

    return $data;
}

// prepare data
$id = '4WL03U8z4Ue6OvifkqAKiA';
$data = array('guid' => $id, 'content' => file_get_contents('./etreetask.pmml'));

// run task
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://lmcloud.vse.cz/SewebarConnect/Task/Pool");
curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($data));
curl_setopt($ch, CURLOPT_VERBOSE, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo $response; die;

$DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, $response, null, LANG);
$DP->loadData();
$DP->parseData();
echo $DP->getER();

