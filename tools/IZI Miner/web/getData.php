<?php

require_once '../config/Config.php';
require_once '../lib/Bootstrap.php';

$DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, null, null, LANG);
$DP->loadData();
echo $DP->parseData();