<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 16:42
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$oLottery = new Lottery();
$aRes = $oLottery->updateLotteryTimes($_G['uid']);
$aRes = array(
    'errno' => '0',
    'errmsg' => '',
    'data' => array(
        'residue_times'=> $aRes,
    ),
);

echo json_encode($aRes);
