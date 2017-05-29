<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 16:35
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$oLottery = new Lottery();
$aRes = $oLottery->genLotteryTimes($_G['uid']);
$iStatus = $oLottery->isRewarded($_G['uid']);
$sPrizeName = $oLottery->getPrizeInfoByUid($_G['uid'], 'prize_name');
$aRes = array(
    'errno' => '0',
    'errmsg' => '',
    'data' => array(
        'residue_times'=> $aRes['residue_times'],
        'status' => $iStatus,
        'prize_name' => $sPrizeName,
    ),
);

echo json_encode($aRes);
