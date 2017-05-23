<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 18:19
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$iUserPhone = $_POST['telnumber'];
$sUserName = $_POST['realname'];
$sUserEmail = $_POST['email'];
$sUserAddr = $_POST['addr'];
$sUuid = $_G['uid'];
//$iUserPhone = 13578126493;
//$sUserName = '测试';
//$sUserEmail = '3128475@qq.com';
//$sUserAddr = '北京';

$sPhonePattern = "/^1[34578]{1}\d{9}$/";

$errmsg = '';
if(!preg_match($sPhonePattern, $iUserPhone)){
    $errmsg = '手机号格式有误,请重新填写';
}elseif(!isemail($sUserEmail)){
    $errmsg = '邮箱格式有误,请重新填写';
}


$oLottery = new Lottery();
$bRes = $oLottery->insertLotteryInfo($sUuid, $sUserName, $iUserPhone, $sUserAddr, $sUserEmail);
$iErrno = 1;
$errmsg = '不能重复提交^.^';
if($bRes){
    $errmsg = '保存成功';
    $iErrno = 0;
}
$aRes = array(
    'errno' => $iErrno,
    'errmsg' => $errmsg,
    'data' => array(),
);

echo json_encode($aRes);