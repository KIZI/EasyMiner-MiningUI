<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Serializer\TaskSettingSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = $request->query->get('id_dm');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$taskId = json_decode($data)->taskId;
$rulesIds = json_decode($data)->rulesIds;
$debug = json_decode($data)->debug;
$joomlaUrl = json_decode($data)->joomlaUrl;
$lang = $request->query->get('lang');
$taskName = json_decode($data)->taskName;

//if ($id === 'TEST') {
//    $responseContent = ['status' => 'ok'];
//} else { // KBI
    $requestData = [
        'kbi' => $id,
        'lmtask' => $taskId,
        'rules' => implode(',', $rulesIds),
        'taskName' => $taskName
    ];

    // run task
    $encoder = new URLEncoder();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $joomlaUrl.'index.php?option=com_dbconnect&controller=data&task=savePMMLArticle&format=raw');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    $response = curl_exec($ch);
    $response = iconv("utf-8", "utf-8//IGNORE", $response);
    $info = curl_getinfo($ch);
    curl_close($ch);

    if (FB_ENABLED && $debug) { // log into console
        FB::info(['curl request' => $requestData]);
        FB::info(['curl response' => $response]);
        FB::info(['curl info' => $info]);
    }

    if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response)) {
        $result = json_decode($response);
        if ($result->result === 'ok') {
            $responseContent = [
                'status' => 'ok',
                'reportId' => $result->article
            ];
        } else {
            $responseContent = [
                'status' => 'error',
                'message' => $result->message
            ];
        }
    } else {
        returnError:
        $responseContent = ['status' => 'error'];
    }
//}

$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

