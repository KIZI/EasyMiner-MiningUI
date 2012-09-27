<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Parser\DataParser;
use IZI\Serializer\ETreeSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = $request->query->get('id_dm');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$lang = $request->query->get('lang');
$sleep = (int) $request->query->get('sleep') ?: 0;

if ($id === 'TEST') {
    sleep($sleep); // simulates time required for mining
    $responseContent = [
        'recommendation' => [
            'Age' => 1,
            "Repayment" => 0.6,
        ],
        'status' => 'ok'
    ];
} else { // KBI
    $DDPath = APP_PATH.'/web/temp/DD_'.$id.'.pmml';
    if (!file_exists($DDPath)) {
        if (FB_ENABLED) { // log into console
            FB::error(['error' => 'data description does not exist']);
        }
        $responseContent = ['status' => 'error'];
        goto sendResponse;
    }

    $serializer = new ETreeSerializer($DDPath, FAPath);
    $requestData = array('source' => $id, 'query' => $serializer->serialize($data), 'template' => 'ETreeMiner.Task.Template.PMML');

    // save LM task
    $LM_import_path = './temp/etree_task_'.date('md_His').'.pmml';
    file_put_contents($LM_import_path, $requestData['query']);

    // run task
    $encoder = new URLEncoder();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=query&format=raw');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    if (FB_ENABLED) { // log into console
        FB::info(['curl request' => $requestData]);
        FB::info(['curl response' => $response]);
        FB::info(['curl info' => $info]);
    }

    if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response)) {
        // save LM result
        $LM_export_path = './temp/etree_result_'.date('md_His').'.pmml';
        file_put_contents($LM_export_path, $response);

        $DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, null, $response, $lang);
        $DP->loadData();
        $DP->parseData();
        $responseContent = [
            'recommendation' => $DP->getRecommendedAttributes(),
            'status' => 'ok',
        ];
    } else {
        $responseContent = ['status' => 'error'];
    }
}

sendResponse:
$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

