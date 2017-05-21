<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 19:01
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$iOffset = intval($_POST['offset']) ? intval($_POST['offset']) : 0;
$oLottery = new Lottery();
$aResult = $oLottery->genRewardInfo($iOffset);
$errmsg = '';
$iErrno = 1;
if(!empty($aResult)){
    $iErrno = 0;
}

$aRes = array(
    'errno' => $iErrno,
    'errmsg' => $errmsg,
    'data' => $aResult,
);

echo json_encode($aRes);

