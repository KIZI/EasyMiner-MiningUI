<?php

require_once '../config/Config.php';
require_once '../lib/Bootstrap.php';

// data encoding
function encodeData($array) {
    $data = "";
    foreach ($array as $key => $value) {
        $data .= "{$key}=".urlencode($value).'&';
    }

    return $data;
}

if (!DEV_MODE) { // KBI
    $id = intval($_GET['id_dm']);
    $DDPath = APP_PATH.DS.'web'.DS.'temp'.DS.'DD_'.$id.'.pmml';
    if (!file_exists($DDPath)) {
        $id = $_GET['id_dm'];
        $requestData = array();
        
        // run export
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=dataDescription&format=raw&source='.$id);
        curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
    
        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);
        
        $DD = new DOMDocument('1.0', 'UTF-8');
        @$DD->loadXML($response, LIBXML_NOBLANKS); // throws notice due to the PI declaration
        $DD->save($DDPath);
    }
} else {
    $DDPath = DDPath;
}

$DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, null, null, LANG);
$DP->loadData();
echo $DP->parseData();