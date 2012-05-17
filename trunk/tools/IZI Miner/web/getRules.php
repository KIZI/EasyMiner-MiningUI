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

// LM task
$data = isset($_POST['data']) ? $_POST['data'] : $_GET['data'];
$data = str_replace("\\\"", "\"", $data);
$serializer = new SerializeRulesTaskSetting();

if (!DEV_MODE) { // SewebarConnect
    $id = 'VdcuecAZZEa5MTVm6E7huA';
    $data = array('guid' => $id, 'content' => $serializer->serializeRules($data));

    // save LM task
    $LM_import_path = './temp/4ft_task_'.date('md_His').'.pmml';
    $LM_import = new DOMDocument('1.0', 'UTF-8');
    $LM_import->loadXML($data['content'], LIBXML_NOBLANKS);
    $LM_import->save($LM_import_path);
    
    // run task
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://lmcloud.vse.cz/SewebarConnect/Task/Pool");
    curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($data));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    // save LM result
    $LM_export_path = './temp/4ft_result_'.date('md_His').'.pmml';
    $LM_export = new DOMDocument('1.0', 'UTF-8');
    $LM_export->loadXML($response, LIBXML_NOBLANKS);
    $LM_export->save($LM_export_path);
} else { // localhost dev env
    $LM_import_path = './temp/4ft_task_'.date('md_His').'.pmml';
    $LM_import = new DOMDocument('1.0', 'UTF-8');
    $LM_import->loadXML($serializer->serializeRules($data), LIBXML_NOBLANKS);
    $LM_import->save($LM_import_path);

    // import LM task
    exec(DEV_LM_PATH.DS.'LMSwbImporter.exe /DSN:"LM Barbora.mdb MB" /Input:"'.$LM_import_path.'" /Alias:"'.DEV_LM_PATH.DS.'Sewebar'.DS.'Template'.DS.'LM.PMML.Alias.txt" /Quiet /NoProgress /AppLog:"./temp/_LM_log.dat"');

    // run LM task
    $XPath = new DOMXPath($LM_import);
    $taskName = $XPath->evaluate('//*[@modelName]/@modelName')->item(0)->value;
    exec(DEV_LM_PATH.DS.'LMTaskPooler.exe /DSN:"LM Barbora.mdb MB" /TaskName:"'.$taskName.'" /Quiet /NoProgress /AppLog:"./temp/_LM_log.dat"');

    // export LM task
    $LM_export_path = './temp/4ft_result_'.date('md_His').'.pmml';
    exec(DEV_LM_PATH.DS.'LMSwbExporter.exe /DSN:"LM Barbora.mdb MB" /TaskName:"'.$taskName.'" /Template:"'.DEV_LM_PATH.DS.'/Sewebar/Template/4ftMiner.Task.ARD.Template.PMML" /Alias:"'.DEV_LM_PATH.DS.'Sewebar'.DS.'Template'.DS.'LM.PMML.Alias.txt" /Output:"'.$LM_export_path.'" /Quiet /NoProgress /AppLog:"./temp/_LM_log.dat"');
    $response = file_get_contents($LM_export_path);
    //$response = preg_replace('/[^(\x20-\x7F)]*/','', $response);
}

$DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, $response, null, LANG);
$DP->loadData();
$DP->parseData();
echo $DP->getER();

