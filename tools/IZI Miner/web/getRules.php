<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataParser;
use IZI\Serializer\TaskSettingSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = $request->query->get('id_dm');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$lang = $request->query->get('lang');
$sleep = (int) $request->query->get('sleep') ?: 0;

if ($id === 'TEST') {
    sleep($sleep); // simulates time required for mining
    $taskPath = 'data/4ft_sample_task.pmml';
    $resultPath = 'data/4ft_sample_result.pmml';
    $DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, APP_PATH.'/web/'.$resultPath, null, $lang);
    $DP->loadData();
    $DP->parseData();
    $responseContent = $DP->getER();
    $responseContent['task'] = $taskPath;
    $responseContent['result'] = $resultPath;
    $responseContent['status'] = 'ok';
} else { // KBI
    $DDPath = APP_PATH.'/web/temp/DD_'.$id.'.pmml';
    if (!file_exists($DDPath)) {
        if (FB_ENABLED) { // log into console
            FB::error(['error' => 'data description does not exist']);
        }
        goto returnError;
    }

    $loader = new XMLLoader();
    $serializer = new TaskSettingSerializer($DDPath);
    $requestData = array('source' => $id, 'query' => $serializer->serialize($data), 'template' => '4ftMiner.Task.ARD.Template.PMML');

    // save LM task
    $taskPath = 'temp/4ft_task_'.date('md_His').'.pmml';
    $LM_import = $loader->load($requestData['query']);
    $LM_import->save($taskPath);

    // run task
    $encoder = new URLEncoder();
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
        // save LM result
        $resultPath = 'temp/4ft_result_'.date('md_His').'.pmml';
        file_put_contents($resultPath, $response);

        $DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, $response, null, $lang);
        $DP->loadData();
        $DP->parseData();
        $responseContent = $DP->getER();
        $responseContent['task'] = $taskPath;
        $responseContent['result'] = $resultPath;
        $responseContent['status'] = 'ok';
    } else {
        returnError:
        $responseContent = ['status' => 'error'];
    }
}

$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

