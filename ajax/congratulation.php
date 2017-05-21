<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 18:19
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$iUserPhone = intval($_POST['user_phone']);
$sUserName = $_POST['user_name'];
$sUserEmail = $_POST['user_email'];
$sUserAddr = $_POST['user_addr'];
$sUuid = $_G['uid'];

$sPhonePattern = "/^\+?[\d\-]{11,13}$/i";

$errmsg = '';
if(preg_match($sPhonePattern, $iUserPhone)){
    $errmsg = '手机号格式有误,请重新填写';
}elseif(!isemail($sUserEmail)){
    $errmsg = '邮箱格式有误,请重新填写';
}


$oLottery = new Lottery();
$bRes = $oLottery->insertLotteryInfo($sUuid, $sUserName, $iUserPhone, $sUserAddr, $sUserEmail);
$iErrno = 1;
if($bRes){
    $errmsg = 'success';
    $iErrno = 0;
}
$aRes = array(
    'errno' => $iErrno,
    'errmsg' => $errmsg,
    'data' => array(),
);

echo json_encode($aRes);