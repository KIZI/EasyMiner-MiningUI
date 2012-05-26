<?php

require_once '../config/Config.php';
require_once '../lib/Bootstrap.php';

// data encoding
function encodeData($array) {
    $data = "";
    foreach ($array as $key => $value) {
        $data .= "{$key}=".urlencode($value).'&';
    }

    return $data;
}

$data = isset($_POST['data']) ? $_POST['data'] : $_GET['data'];
$data = str_replace("\\\"", "\"", $data);

if (!DEV_MODE) { // KBI
    $id = intval($_GET['id_dm']);
    $DDPath = APP_PATH.DS.'web'.DS.'temp'.DS.'DD_'.$id.'.pmml';
} else {
    $DDPath = DDPath;
}

$id = intval($_GET['id_kb']);
$action = $_GET['action'];
if ($action === 'saveInteresting' || $action === 'saveNotInteresting') {
    if ($action === 'saveInteresting') {
        $serializer = new SerializeRulesAnnotatedAR($DDPath, 'interesting');
    } else if ($action === 'saveNotInteresting') {
        $serializer = new SerializeRulesAnnotatedAR($DDPath, 'not interesting');
    }

    $requestData = array('source' => $id, 'content' => $serializer->serializeRules($data));

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=storeDocument&format=raw');
    curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    // save XML
    $AARPath = './temp/KB_'.date('md_His').'.pmml';
    $AAR = new DOMDocument('1.0', 'UTF-8');
    @$AAR->loadXML($requestData['content'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
    $AAR->save($AARPath);
} else {
    // confirmation
    $serializer = new SerializeRulesQueryByAR(DDPath);
    $requestData = array('source' => $id, 'query' => KB_CONF_ID, 'parameters' => $serializer->serializeRules($data));

    // save XML
    $AARPath = './temp/KB_conf_'.date('md_His').'.pmml';
    $AAR = new DOMDocument('1.0', 'UTF-8');
    @$AAR->loadXML($requestData['parameters'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
    $AAR->save($AARPath);

    // run task
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=query&format=raw");
    curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    
    if ($response === '' || $info['http_code'] !== 200) { // XQuery is down
        echo json_encode(false);
        die;
    }
    
    $KBParser = new KnowledgeBaseParser($response);
    $confirmation = $KBParser->parse();

    if ($confirmation['hits'] > 0) {
        $arr = array(
            'confirmation' => $confirmation, 
            'exception' => array('hits' => 0),
        );
        
        echo json_encode($arr);
        die;
    }
    
    // exception
    $serializer = new SerializeRulesQueryByAR(DDPath);
    $requestData = array('source' => $id, 'query' => KB_EXC_ID, 'parameters' => $serializer->serializeRules($data));
    
    // save XML
    $AARPath = './temp/KB_exc_'.date('md_His').'.pmml';
    $AAR = new DOMDocument('1.0', 'UTF-8');
    @$AAR->loadXML($requestData['parameters'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
    $AAR->save($AARPath);

    // run task
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=query&format=raw");
    curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $KBParser = new KnowledgeBaseParser($response);
    $exception = $KBParser->parse();

    $arr = array(
        'confirmation' => $confirmation, 
        'exception' => $exception
    );
    
    if (function_exists('json_encode')) {
        echo json_encode($arr);
    } else {
        $JSON = new Services_JSON();
        echo $JSON->encode($arr);
    }
}




