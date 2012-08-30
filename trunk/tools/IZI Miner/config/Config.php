<?php

$config = [
    'DDPath' => APP_PATH.'/data/datadescription_0.2.xml',
    'FLPath' => [
        APP_PATH.'/data/featureList_beginner.xml',
        APP_PATH.'/data/featureList_exploration.xml'
    ],
    'FGCPath' => APP_PATH.'/data/fieldGroupConfig.xml',
    'ERPath' => null,
    'ETreePath' => null,
    'FAPath' => APP_PATH.'/data/frequencyAnalysis.xml',
    'KB_CONF_ID' => 6, // KBI query ID - confirmation
    'KB_EXC_ID' => 7, // KBI query ID - exception
];

foreach ($config as $k => $c) {
    is_array($c) ? define($k, serialize($c)) : define($k, $c);
}