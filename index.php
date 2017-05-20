<?php

require 'config.php';
require_once('include/class.lottery.php');

$test = new Lottery();
var_dump($test->genLotteryTimes('xxxxx'));
var_dump($test->initLotteryTimes('abcd'));

include template('index');

?>
