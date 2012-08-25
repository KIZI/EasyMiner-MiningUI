<?php

require_once '../lib/Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataParser;
use IZI\Serializer\TaskSetting as SerializerTaskSetting;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$id = (int)$request->query->get('id_dm');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$serializer = new SerializerTaskSetting();
$loader = new XMLLoader();

$requestData = array('source' => $id, 'query' => $serializer->serialize($data), 'template' => '4ftMiner.Task.ARD.Template.PMML');

// save LM task
$LM_import = $loader->load($requestData['query']);
$LM_import->save('./temp/4ft_task_'.date('md_His').'.pmml');

// run task
$encoder = new URLEncoder();
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=query&format=raw");
curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
curl_setopt($ch, CURLOPT_VERBOSE, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// save LM result
$LM_export = $loader->load($response);
$LM_export->save('./temp/4ft_result_'.date('md_His').'.pmml');

$DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, $response, null, LANG);
$DP->loadData();
$DP->parseData();

$response = new Response($DP->getER(), 200, array('content-type' => 'application/json; charset=UTF-8'));
$response->send();

