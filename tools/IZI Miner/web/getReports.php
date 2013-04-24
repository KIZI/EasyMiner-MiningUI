<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Serializer\TaskSettingSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');

    // run task
    $encoder = new URLEncoder();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, json_decode($data)->url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    $response = curl_exec($ch);
    $response = iconv("utf-8", "utf-8//IGNORE", $response);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $responseContent = ['status' => 'ok', 'articles' => json_decode($response)->articles];

$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

