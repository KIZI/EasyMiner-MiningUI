<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
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
$taskId = json_decode($data)->taskId;
$debug = json_decode($data)->debug;
$joomlaUrl = json_decode($data)->joomlaUrl;
$taskMode = json_decode($data)->taskMode;
$lang = $request->query->get('lang');

if ($id === 'TEST') {
    $responseContent = ['status' => 'ok'];
} else { // KBI
    $requestData = ['pooler' => $taskMode];

    // run task
    $config = array(
        'source' => intval($id),
        'query' => '',
        'xslt' => NULL,
        'parameters' => NULL
    );

    $model = new KbiModelTransformator($config);
    $document = $model->cancelQuery($taskId);

    var_dump($document);
    die;

    $ok = (strpos($document, 'kbierror') === false && !preg_match('/status=\"failure\"/', $document));

    if (FB_ENABLED && $debug) { // log into console
        FB::info(['curl request' => $requestData]);
        FB::info(['response' => $document]);
    }

    if ($info['http_code'] === 200 && strpos($document, 'kbierror') === false && !preg_match('/status=\"failure\"/', $document)) {
        $success = preg_match('/status=\"success\"/', $document);
        if ($success) {
            $responseContent = ['status' => 'ok'];
        } else {
            $responseContent = ['status' => 'error'];
        }
    } else {
        returnError:
        $responseContent = ['status' => 'error'];
    }
}

$response = new Response(json_encode($responseContent), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

