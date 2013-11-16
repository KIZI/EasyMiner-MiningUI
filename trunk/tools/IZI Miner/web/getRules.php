<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Parser\DataParser;
use IZI\Serializer\TaskSettingSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$joomla = '/home/sewebar/code.google.com/trunk/joomla25/www';

define('_JEXEC', 1);
define('JPATH_BASE', $joomla);

require_once JPATH_BASE .'/configuration.php';
require_once JPATH_BASE .'/includes/defines.php';
require_once JPATH_BASE .'/includes/framework.php';
require_once JPATH_BASE .'/libraries/joomla/factory.php';
require_once JPATH_BASE .'/includes/framework.php';

$app = JFactory::getApplication('site');

require_once JPATH_BASE . '/components/com_kbi/models/transformator.php';

$request = Request::createFromGlobals();
$id = $request->query->get('id_dm');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$debug = json_decode($data)->debug;
$joomlaUrl = json_decode($data)->joomlaUrl;
$taskMode = json_decode($data)->taskMode;
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
        if (FB_ENABLED && $debug) { // log into console
            FB::error(['error' => 'data description does not exist']);
        }
        $responseContent = ['status' => 'error'];
        goto sendResponse;
    }

    $serializer = new TaskSettingSerializer($DDPath);

    $requestData = array('source' => $id, 'query' => $serializer->serialize($data), 'template' => $debug ? '4ftMiner.Task.Template.PMML' : '4ftMiner.Task.ARD.Template.PMML', 'pooler' => $taskMode);
    $numRequests = 0;

    // save LM task
    $taskPath = 'temp/4ft_task_'.date('md_His').'.pmml';
    file_put_contents($taskPath, $requestData['query']);

    // run task
    sendRequest:
    $config = array(
        'source' => intval($id),
        'query' => '',
        'xslt' => NULL,
        'parameters' => NULL
    );

    $model = new KbiModelTransformator($config);
    $document = $model->transform();

    $ok = (strpos($document, 'kbierror') === false && !preg_match('/status=\"failure\"/', $document));
    if ((++$numRequests < MAX_MINING_REQUESTS) && !$ok) { sleep(REQUEST_DELAY); goto sendRequest; }

    if (FB_ENABLED && $debug) { // log into console
        FB::info(['num requests' => $numRequests, 'request' => $requestData, 'response' => $document]);
    }

    if ($ok) {
        // save LM result
        $resultPath = 'temp/4ft_result_'.date('md_His').'.pmml';
        file_put_contents($resultPath, $document);

        $DP = new DataParser($DDPath, unserialize(FLPath), FGCPath, $response, null, $lang);
        $DP->loadData();
        $DP->parseData();
        $responseContent = $DP->getER();
        $responseContent['task'] = $taskPath;
        $responseContent['result'] = $resultPath;
        $responseContent['status'] = 'ok';
    } else {
        $responseContent = ['status' => 'error', 'response' => $document];
    }
}

sendResponse:
$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

