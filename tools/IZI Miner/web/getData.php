<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Parser\DataParser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = $request->query->get('id_dm');
$lang = $request->query->get('lang');

if ($id === 'TEST') {
    $DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, null, null, $lang);
    $DP->loadData();
    $responseContent = $DP->parseData();
} else { // KBI
    $requestData = array();

    // run export
    $encoder = new URLEncoder();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=dataDescription&format=raw&source='.$id);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    if (FB_ENABLED) { // log into console
        FB::info(['curl response' => $response]);
        FB::info(['curl info' => $info]);
    }

    if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false) {
        $DDPath = APP_PATH.'/web/temp/DD_'.$id.'.pmml';
        file_put_contents($DDPath, $response);

        $DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, null, null, $lang);
        $DP->loadData();
        $responseContent = $DP->parseData();
    } else {
        $responseContent = json_encode(['failure' => true]);
    }
}

$response = new Response($responseContent, 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();