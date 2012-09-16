<?php

require_once '../Bootstrap.php';

use IZI\Encoder\URLEncoder;
use IZI\FileLoader\XMLLoader;

$encoder = new URLEncoder();
$requestData = array('action' => 'getDocsNames', 'content' => '', 'id' => '');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://nlp.vse.cz:8081/xquery_search/xquery_servlet');
curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
curl_setopt($ch, CURLOPT_VERBOSE, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$loader = new XMLLoader();
$result = $loader->load($response);
$xPath = new \DOMXPath($result);
$deletedCount = 0;
foreach ($xPath->evaluate('//doc') as $document) {
    $requestData = array('action' => 'deleteDocument', 'content' => '', 'id' => $document->nodeValue);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://nlp.vse.cz:8081/xquery_search/xquery_servlet');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);

    $deletedCount++;
}

echo 'Smazano '.$deletedCount.' dokumentu.';