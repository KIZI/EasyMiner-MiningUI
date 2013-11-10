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
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$debug = json_decode($data)->debug;
$joomlaUrl = json_decode($data)->joomlaUrl;
$sleep = (int) $request->query->get('sleep') ?: 0;

if ($id === 'TEST') {
    sleep($sleep); // simulates time required for remote request
    $DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, null, null, $lang);
    $DP->loadData();
    $responseContent = $DP->parseData();
    $responseContent['status'] = 'ok';
} else { // KBI
    $requestData = [];
    $numRequests = 0;

    $encoder = new URLEncoder();

    // run export
    sendRequest:
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $joomlaUrl.'index.php?option=com_kbi&task=dataDescription&format=raw&source='.$id);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_COOKIE, session_name() . '=' . session_id());

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $ok = ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response));
    if ((++$numRequests < MAX_INITIALIZATION_REQUESTS) && !$ok) { sleep(REQUEST_DELAY); goto sendRequest; }

    if (FB_ENABLED && $debug) { // log into console
        FB::info(['num requests' => $numRequests, 'curl response' => $response, 'curl info' => $info]);
    }

    if ($ok) {
        $DDPath = APP_PATH.'/web/temp/DD_'.$id.'.pmml';
        file_put_contents($DDPath, $response);

        $DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, null, null, $lang);
        $DP->loadData();
        $responseContent = $DP->parseData();
        $responseContent['status'] = 'ok';
    } else {
        $responseContent = ['status' => 'error'];
    }
}

$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();