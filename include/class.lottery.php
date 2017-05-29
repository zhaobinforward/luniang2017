<?php

interface LotteryIf
{
    /*
     * 获取抽奖机会
     * @param $sUuid string 用户唯一的uuid
     * return array
     * */
    public function genLotteryTimes($sUuid);

    /*
     * 执行抽奖
     * @param $sUuid string 用户唯一的uuid
     * return array('errno'=>Integer, 'errmsg'=>String, 'data'=>String/Array);
     * */
    public function doLottery($sUuid);

    /*
   * 更新抽奖次数，隔天重置
   * @param $sUuid string 用户唯一的uuid
   * @param $iType int 1代表增加抽奖机会，2使用抽奖机会
   * return int  现有抽奖次数
   * */
    public function updateLotteryTimes($sUuid,$iType=1);

    /*
     * 提交中奖信息
     * @param $sUuid  string  用户唯一的uuid
     * @param $sName  String 中奖用户名字
     * @param $iPhone int    中奖用户手机号
     * @param $sAddr  String 中奖用户地址
     * @param $sEmail String 中奖用户邮箱
     * return bool
     * */
    public function insertLotteryInfo($sUuid, $sName, $iPhone, $sAddr, $sEmail);


    /*
     * 获取中奖信息
     * @param $iOffset int 前端偏移量
     * return array
     * */
    public function genRewardInfo($iOffset);
}

class Lottery implements LotteryIf{

    const LUCK_PROBABILITY = 10000;//中奖基数
    const UNPRIZE = 0;//未中奖
    const PRIZED_NO_USERINFO = 1;//中奖还没填中奖信息
    const PRIZED_HAS_USERINFO = 2;//中奖已填中奖信息
    const ADD_CHANCES = 1;
    const USE_CHANGES = 2;
    const LOG_ON = TRUE;



    public static $prizeTypeArr = array(
        '1' => '网易漫画1个月VIP',
        '2' => '网易漫画3个月VIP',
        '3' => '鹿娘春日福袋（鹿娘钥匙扣+动漫卡贴）',
        '4' => '《中国怪谈》趣味福袋（卷纸+钥匙扣）',
        '5' => '动漫抱枕',
        '6' => '《中国怪谈》单行本',
        '7' => '鹿娘保温杯',
        '8' => '《中国怪谈》T恤',
    );

    public static $prizeStatusMessage  = array(
        '0' => '未中奖',
        '1' => '中奖还未填写中奖信息',
        '2' => '中奖已填写中奖信息',
        '3' => '没有抽奖机会，请分享或下载皮肤获取抽奖机会',
        '4' => '今日抽奖机会已用完，明天再来哦^.^',
        '5' => '今日奖品已抽完,明天再来哦^.^',
    );

    //中奖率
    public static $prizeRatioArr = array(
//        '1' => '0.0015',
//        '2' => '0.0003',
//        '3' => '0.0002',
//        '4' => '0.0003',
//        '5' => '0.0001',
//        '6' => '0.0002',
//        '7' => '0.0001',
//        '8' => '0.0001',
       '1' => '0.15',
       '2' => '0.03',
       '3' => '0.02',
       '4' => '0.03',
       '5' => '0.01',
       '6' => '0.02',
       '7' => '0.01',
       '8' => '0.01',
    );

    private $_MDB;

    public function __construct(){
        if(PHP7){
            require_once(R_ROOT.'/include/class.mysql7.php');
        }else{
            require_once(R_ROOT.'/include/class.mysql.php');
        }
        $this->_MDB = new nMysql('sogou_shoujiwap', array('charset'=>'utf8'));
        $this->_MDB->_initconnection();
    }

    /*
    * 获取抽奖机会
    * @param $sUuid string 用户唯一的uuid
    * return array
    * */
    public function genLotteryTimes($sUuid){
        $sUuid = $this->_escape_string($sUuid);
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        //先检查有没有这个用户
        if(isset($aRes['residue_times'])) {
            //隔天重置
            if ( date("Y-m-d") > date("Y-m-d", $aRes['update_time']) && !empty($aRes['update_time'])) {
                $sSql = "update luniang_2017_user set max_times=12,residue_times=0,update_time='" . time() . "' where uuid='" . $sUuid . "'";
                if($this->_MDB->Query($sSql)){
                    $aRes['max_times'] = 12;
                    $aRes['residue_times'] = 0;
                }
            }
        }
        return $aRes;
    }

    /*
    * 更新抽奖次数，隔天重置
    * @param $sUuid string 用户唯一的uuid
    * @param $iType int 1代表增加抽奖机会，2使用抽奖机会
    * return bool  成功或者失败
    * */
    public function updateLotteryTimes($sUuid, $iType=1){
        $sUuid = $this->_escape_string($sUuid);
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        //先检查有没有这个用户
        if(isset($aRes['residue_times'])){
            //隔天重置
            if(date("Y-m-d") > date("Y-m-d",$aRes['update_time'])){
                $sSql = "update luniang_2017_user set max_times=11,residue_times=1,update_time='".time()."' where uuid='".$sUuid."'";
            }else{
                if($iType == self::ADD_CHANCES){//增加抽奖机会
                    if($aRes['max_times'] > 0){//如果还有机会可以增加
                        $sSql = "update luniang_2017_user set max_times=max_times-1,residue_times=residue_times+1,update_time='".time()."' where uuid='".$sUuid."'";
                    }
                }else{//使用抽奖次数
                    if($aRes['residue_times'] > 0){
                        $sSql = "update luniang_2017_user set residue_times=residue_times-1,update_time='".time()."' where uuid='".$sUuid."'";
                    }
                }
            }
        }else{//新用户
            $sSql = "insert into luniang_2017_user(`uuid`,`residue_times`,`max_times`,`create_time`)values
                    ('".$sUuid."',0,12,'".time()."')";
        }
        $oQuery = $this->_MDB->Query($sSql);
        if($oQuery){
            $sSql = "select residue_times from luniang_2017_user where uuid='".$sUuid."'";
            $oQuery = $this->_MDB->Query($sSql);
            $aRes = $this->_MDB->FetchArray($oQuery);
            if(!empty($aRes)){
                return $aRes['residue_times'];
            }
        }
    }

    /*
    * 执行抽奖
    * @param $sUuid string 用户唯一的uuid
    * return array('status'=>Integer, 'message'=>String, 'data'=>String/Array);
    * */
    public function doLottery($sUuid){
        $sUuid = $this->_escape_string($sUuid);
        $sStatus = 0;
        $sSql = "select count(*) as num from luniang_2017_prize where prize_date='".date("Ymd")."' and status=0 ";
        $oQuery = $this->_MDB->Query($sSql);
        $aResult = $this->_MDB->FetchArray($oQuery);
        if($aResult['num'] == 0 ){
            $sStatus = 5 ;
        }
        if( $this->isRewarded($sUuid) == 2){//该用户已经填过中过奖信息
            $sStatus = 2;
        }elseif( $this->isRewarded($sUuid) == 1){//中奖未填中奖信息
            $sStatus = 1;
        }
        $aRes = array();
        $aData = array();
        $aLog = array();
        $aLotteryTimes = $this->genLotteryTimes($sUuid);
        $iResidueTimes = 0;
        if($aLotteryTimes['residue_times'] > 0){//有抽奖机会
            $iRand = rand(0,self::LUCK_PROBABILITY);
            $aAreas = $this->_genPrizeArea(self::$prizeRatioArr);
            $iPrizeType = 0;
            $sArea = ($aAreas[8]['last']+1)."-".self::LUCK_PROBABILITY;
            if($iRand >= $aAreas[1]['first'] &&  $iRand <= $aAreas[1]['last']){
                $iPrizeType = 1;
                $sArea = $aAreas[1]['first']."-".$aAreas[1]['last'];
            }elseif($iRand >= $aAreas[2]['first'] &&  $iRand <= $aAreas[2]['last']){
                $iPrizeType = 2;
                $sArea = $aAreas[2]['first']."-".$aAreas[2]['last'];
            }elseif($iRand >= $aAreas[3]['first'] &&  $iRand <= $aAreas[3]['last']){
                $iPrizeType = 3;
                $sArea = $aAreas[3]['first']."-".$aAreas[3]['last'];
            }elseif($iRand >= $aAreas[4]['first'] &&  $iRand <= $aAreas[4]['last']){
                $iPrizeType = 4;
                $sArea = $aAreas[4]['first']."-".$aAreas[4]['last'];
            }elseif($iRand >= $aAreas[5]['first'] &&  $iRand <= $aAreas[5]['last']){
                $iPrizeType = 5;
                $sArea = $aAreas[5]['first']."-".$aAreas[5]['last'];
            }elseif($iRand >= $aAreas[6]['first'] &&  $iRand <= $aAreas[6]['last']){
                $iPrizeType = 6;
                $sArea = $aAreas[6]['first']."-".$aAreas[6]['last'];
            }elseif($iRand >= $aAreas[7]['first'] &&  $iRand <= $aAreas[7]['last']){
                $iPrizeType = 7;
                $sArea = $aAreas[7]['first']."-".$aAreas[7]['last'];
            }elseif($iRand >= $aAreas[8]['first'] &&  $iRand <= $aAreas[8]['last']){
                $iPrizeType = 8;
                $sArea = $aAreas[8]['first']."-".$aAreas[8]['last'];
            }

            if($sStatus != 2 && $iPrizeType!=0){
                $aPrize = $this->_genPrizeByPrizeType($iPrizeType);
            }

            $aLog['prize_type'] = $iPrizeType;
            $aLog['ratio'] = $iRand;
            $aLog['area'] = $sArea;

            $iResidueTimes = $this->updateLotteryTimes($sUuid, self::USE_CHANGES);
            if(!empty($aPrize)){
                $sStatus = 1 ;
                $sSql = "update luniang_2017_prize set uuid='".$sUuid."',status='1',lottery_time='".time()."' where id=".$aPrize['id'];
                $aData['prize_type'] = $iPrizeType;
                $aData['prize_name'] = $aPrize['prize_name'];

                $aLog['reward_name'] = $aPrize['prize_name'];
                $aLog['reward_id'] = $aPrize['id'];
                $this->_MDB->Query($sSql);
            }
        }else{
            if($aLotteryTimes['max_times'] > 0){//今天还有抽奖机会，可分享皮肤或者下载皮肤获取抽奖机会
                $sStatus = 3;
            }else{//今日抽奖机会已用完
                $sStatus = 4;
            }
        }
        if($aLotteryTimes['residue_times'] > 0) {//有抽奖机会才记录抽奖log
            $aLog['uuid'] = $sUuid;
            $aLog['return_code'] = $sStatus;
            $aLog['return_info'] = self::$prizeStatusMessage[$sStatus];
            $aLog['create_time'] = time();
            $this->_writeLog($aLog);
        }

        $aData['residue_times'] = $iResidueTimes;
        $aRes['errno'] = $sStatus;
        $aRes['errmsg'] = self::$prizeStatusMessage[$sStatus];
        $aRes['data'] = $aData;
        return $aRes;
    }

    /*
    * 提交中奖信息
    * @param $sUuid  string  用户唯一的uuid
    * @param $sName  String 中奖用户名字
    * @param $iPhone int    中奖用户手机号
    * @param $sAddr  String 中奖用户地址
    * @param $sEmail String 中奖用户邮箱
    * return bool
    * */
    public function insertLotteryInfo($sUuid, $sName, $iPhone, $sAddr, $sEmail){
        $sUuid = $this->_escape_string($sUuid);
        $sName = $this->_escape_string($sName);
        $sAddr = $this->_escape_string($sAddr);
        $sEmail = $this->_escape_string($sEmail);

        $sSql = "select * from luniang_2017_prize where uuid='".$sUuid."' and status='1'";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        if(!empty($aRes['uuid'])){//先确认是否真正中奖
            $sSql = "update luniang_2017_user set user_phone='".$iPhone."',user_name='".$sName."',user_email='".$sEmail."',user_addr='".$sAddr."' where uuid='".$sUuid."'";
            if($this->_MDB->Query($sSql)){//更新中奖状态
                $sSql = "update luniang_2017_prize set status='".self::PRIZED_HAS_USERINFO."' where uuid='".$sUuid."'";
                if($this->_MDB->Query($sSql)){
                    return true;
                }
            }
        }

        return false;
    }

    /*
     * 获取中奖信息
     * @param $iOffset int 前端偏移量
     * return array
    * */
    public function genRewardInfo($iOffset=0){
        $sSql = "select * from luniang_2017_prize where status='".self::PRIZED_HAS_USERINFO."' order by id desc limit $iOffset,200";
        $oQuery = $this->_MDB->Query($sSql);
        $aPrizes = $this->_MDB->FetchAll($oQuery);
        if(empty($aPrizes)){
            return array();
        }
        $sUuids = "('";
		$comma = '';
        foreach($aPrizes as $k=>$v){
			$sUuids .= "{$comma}{$v['uuid']}'";
			$comma = ",'";
        }
        $sUuids .= ")";
        $sSql = "select * from luniang_2017_user where uuid in ".$sUuids;
        $oQuery = $this->_MDB->Query($sSql);
        $aUidinfo = $this->_MDB->FetchAll($oQuery);
        $aUidArr = array();
        foreach($aUidinfo as $k=>$v){
            $aUidArr[$v['uuid']] = $v;
        }
        $aRes = array();
        foreach($aPrizes as $k=>$v){
            $aTmp = array();
            $aTmp['id'] = $v['id'];
            $aTmp['user_name'] = $aUidArr[$v['uuid']]['user_name'];
            $aTmp['user_phone'] = $aUidArr[$v['uuid']]['user_phone'];
            $aTmp['prize_name'] = $v['prize_name'];
            $aRes[] = $aTmp;
        }
        $aRes = $this->hiddenSecret($aRes);
        return $aRes;
    }


    /*
     * 隐藏用户信息
     * @param $aUserInfo array 中奖用户列表
     * return array
     * */
    private function hiddenSecret($aUserInfo){
        if(is_array($aUserInfo)){
            $sGrep = '/(\d{3})(\d{4})(\d{4})/';
            foreach($aUserInfo as $k=>&$v){
                $v['user_name'] = mb_substr($v['user_name'],0,1,'utf-8')."**";
                $v['user_phone'] = preg_replace($sGrep, "$1****$3",$v['user_phone']);
            }
        }else{
            $aUserInfo = array();
        }
        return $aUserInfo;
    }


    /*
     * 根据奖品类型获取一条对应的奖品
     * @param $iType int 奖品类型
     * return mixed
     * */
    private function _genPrizeByPrizeType($iType){
        $sSql = "select * from luniang_2017_prize where prize_type='".$iType."' and status='".self::UNPRIZE.
            "' and prize_date='".date("Ymd")."' order by id asc limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        if(isset($aRes['id'])){
            return $aRes;
        }
        return false;
    }


    /*
     * 根据uuid确认是否已中过奖
     * @param $sUuid string 用户的唯一uuid
     * return int
     * */
    public function isRewarded($sUuid){
        $sSql = "select uid from luniang_2017_user where uuid='".$sUuid."'";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        if(isset($aRes['uid'])){
            $sSql = "select status from luniang_2017_prize where uuid='".$sUuid."'";
            $oQuery = $this->_MDB->Query($sSql);
            if($aRes = $this->_MDB->FetchArray($oQuery)) {
				return $aRes['status'];
			} else {
				return 0;
			}
        }else{
            return 0;
        }
    }

    /*
     * 记录抽检log
     * @param $log Array 日志数据
     * @return Integer
     * 1: 记录成功
     * <1: 记录失败
    */
    private function _writeLog($log){
        if (self::LOG_ON) {
            return $this->_MDB->insert_table('luniang_2017_log', $log);
        }
        return -99;
    }

    /*
     * 防止sql注入
     * @param $sValue string 需要防注入的字符串
     * return string
     * */
    private function _escape_string($sValue){
        if(PHP7){
            $sValue = mysqli_real_escape_string($this->_MDB->m_link, $sValue);
        }else{
            $sValue = mysql_real_escape_string($sValue);
        }
        return $sValue;
    }


    /*
     * 返回中奖区间
     * @param $aPrizeRation array 各个产品的中奖率
     * @param $iBaseNum int 概率基数
     * return array
     * */
    private function _genPrizeArea($aPrizeRatio){
        $iTmp = 1;
        $aRes = array();
        foreach($aPrizeRatio as $k=>$v){
            $aTemp = array();
            $aTemp['first'] = $iTmp;
            $aTemp['last'] = $iTmp + $v * self::LUCK_PROBABILITY;
            $iTmp += $v * self::LUCK_PROBABILITY + 1;
            $aRes[$k] = $aTemp;
        }
        return $aRes;

    }

}