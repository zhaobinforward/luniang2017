<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 16:22
 */
require_once("../config.php");
require_once(R_ROOT.'/include/class.lottery.php');

$oLottery = new Lottery();
$aRes = $oLottery->doLottery($_G['uid']);

$aRes = array(
    'errno' => $aRes['errno'],
    'errmsg' => $aRes['errmsg'],
    'data' => $aRes['data'],
);


echo json_encode($aRes);
