<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Parser\DataParser;
use IZI\Parser\KnowledgeBaseParser;
use IZI\Serializer\AnnotatedAssociationRulesSerializer;
use IZI\Serializer\QueryByARSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$idDm = $request->query->get('id_dm');
$idKb = $request->query->get('id_kb');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$lang = $request->query->get('lang');
$sleep = (int) $request->query->get('sleep') ?: 0;
$action = $request->query->get('action');
$encoder = new URLEncoder();

if ($idDm === 'TEST' && $idKb === 'TEST') {
    sleep($sleep); // simulates time required for document saving
    $responseContent['status'] = 'ok';
} else { // KBI
    $DDPath = APP_PATH.'/web/temp/DD_'.$idDm.'.pmml';
    if (!file_exists($DDPath)) {
        goto returnError;
    }

    if ($action === 'saveInteresting' || $action === 'saveNotInteresting') {
        if ($action === 'saveInteresting') {
            $serializer = new AnnotatedAssociationRulesSerializer($DDPath);
            $requestData = array('source' => $idKb, 'content' => $serializer->serialize($data, 'interesting'));
        } else if ($action === 'saveNotInteresting') {
            $serializer = new AnnotatedAssociationRulesSerializer($DDPath);
            $requestData = array('source' => $idKb, 'content' => $serializer->serialize($data, 'not interesting'));
        }

        $requestPath = './temp/KB_'.date('md_His').'.pmml';
        file_put_contents($requestPath, $requestData['content']);

        // run task
        $encoder = new URLEncoder();
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=storeDocument&format=raw');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $response = iconv("utf-8", "utf-8//IGNORE", $response);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if (FB_ENABLED) { // log into console
            FB::info(['curl request' => $requestData]);
            FB::info(['curl response' => $response]);
            FB::info(['curl info' => $info]);
        }

        if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response)) {
            $responseContent = ['status' => 'ok'];
        } else {
            returnError:
            $responseContent = ['status' => 'error'];
        }
    } else { // $action === 'ask'
        // confirmation
        $serializer = new QueryByARSerializer($DDPath);
        $requestData = array('source' => $idKb, 'query' => KB_CONF_ID, 'parameters' => $serializer->serialize($data));

        // save XQuery task
        $requestPath = './temp/KB_conf_task_'.date('md_His').'.pmml';
        file_put_contents($requestPath, $requestData['parameters']);

        // run task
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=query&format=raw");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $response = iconv("utf-8", "utf-8//IGNORE", $response);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if (FB_ENABLED) { // log into console
            FB::info(['curl request' => $requestData]);
            FB::info(['curl response' => $response]);
            FB::info(['curl info' => $info]);
        }

        if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response)) {
            // save XQuery result
            $responsePath = './temp/KB_conf_response_'.date('md_His').'.pmml';
            file_put_contents($responsePath, $response);

            $KBParser = new KnowledgeBaseParser($response);
            $confirmation = $KBParser->parse();

            if ($confirmation['hits'] > 0) {
                $responseContent = [
                    'confirmation' => $confirmation,
                    'exception' => ['hits' => 0],
                    'status' => 'ok',
                ];

                goto sendResponse; // rule is successfully confirmed
            }
        } else {
            $responseContent = ['status' => 'error'];
            goto sendResponse;
        }

        // exception
        $serializer = new QueryByARSerializer($DDPath);
        $requestData = array('source' => $idKb, 'query' => KB_EXC_ID, 'parameters' => $serializer->serialize($data));

        // save XQuery task
        $requestPath = './temp/KB_exc_task_'.date('md_His').'.pmml';
        file_put_contents($requestPath, $requestData['parameters']);

        // run task
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=query&format=raw");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $response = iconv("utf-8", "utf-8//IGNORE", $response);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if (FB_ENABLED) { // log into console
            FB::info(['curl request' => $requestData]);
            FB::info(['curl response' => $response]);
            FB::info(['curl info' => $info]);
        }

        if ($info['http_code'] === 200 && strpos($response, 'kbierror') === false && !preg_match('/status=\"failure\"/', $response)) {
            // save XQuery result
            $responsePath = './temp/KB_exc_response_'.date('md_His').'.pmml';
            file_put_contents($responsePath, $response);

            $KBParser = new KnowledgeBaseParser($response);
            $exception = $KBParser->parse();

            $responseContent = [
                'confirmation' => $confirmation,
                'exception' => $exception,
                'status' => 'ok',
            ];
        } else {
            $responseContent = ['status' => 'error'];
        }
    }
}

sendResponse:
$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();



