<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataParser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = (int)$request->query->get('id_dm');

if (DEV_MODE) {
    $path = APP_PATH.'/data/datadescription_0.2.xml';
} else { // KBI
    $requestData = array();

    // run export
    $encoder = new URLEncoder();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=dataDescription&format=raw&source='.$id);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $path = APP_PATH.'/web/temp/DD_'.$id.'.pmml';
    $loader = new XMLLoader();
    $DD = $loader->load($response);
    $DD->save($path);
}

$DP = new DataParser($path, unserialize(FLPath), FGCPath, null, null, LANG);
$DP->loadData();

$response = new Response($DP->parseData(), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();