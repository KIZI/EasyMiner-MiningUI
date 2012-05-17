<?php
// wait
sleep(rand(1, 5)); 

// value
$val = rand(1, 10);
if ($val < 6) {
    echo json_encode(false);   
} else {
    echo json_encode(true);  
}

die;
 
require_once '../config/Config.php';
require_once '../lib/Bootstrap.php';

// KBI task
$data = isset($_POST['data']) ? $_POST['data'] : $_GET['data'];
$data = str_replace("\\\"", "\"", $data);
$serializer = new SerializeRulesQueryByAR(DDPath);
echo $serializer->serializeRules($data);