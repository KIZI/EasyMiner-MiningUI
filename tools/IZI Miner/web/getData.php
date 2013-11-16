<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\Parser\DataParser;
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
    $config = array(
        'source' => $id,
        'query' => '',
        'xslt' => NULL,
        'parameters' => NULL
    );

    $model = new KbiModelTransformator($config);

    $document = $model->getDataDescription();
    var_dump($document);
    die;

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