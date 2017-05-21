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
     * return array('status'=>Integer, 'message'=>String, 'data'=>String/Array);
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

    const LUCK_PROBABILITY = 10;//中奖概率
    const UNPRIZE = 0;//未中奖
    const PRIZED_NO_USERINFO = 1;//中奖还没填中奖信息
    const PRIZED_HAS_USERINFO = 2;//中奖已填中奖信息
    const ADD_CHANCES = 1;
    const USE_CHANGES = 2;

    public static $prizeTypeArr = array(
        '1' => '网易漫画一个月VIP(10元)',
        '2' => '网易漫画三个月VIP(30元)',
        '3' => '鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',
        '4' => '动漫抱枕(66元)',
        '5' => '《中国怪谈》单行本(68元)',
        '6' => '《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',
        '7' => '鹿娘保温杯(128元)',
        '8' => '《中国怪谈》T恤(138元)',
    );

    public static $prizeStatusMessage  = array(
        '0' => '未中奖',
        '1' => '中奖还未填写中奖信息',
        '2' => '中奖已填写中奖信息',
        '3' => '没有抽奖机会，请分享或下载皮肤获取抽奖机会',
        '4' => '今日抽奖机会已用完，明天再来哦^.^',
    );

    private $_MDB;

    public function __construct(){
        if(PHP7){
            require_once(R_ROOT.'/include/class.mysql7.php');
        }else{
            require_once(R_ROOT.'/include/class.mysql.php');
        }
        $this->_MDB = new nMysql('sogou_shoujiwap', array('charset'=>'utf8'));
    }

    /*
    * 获取抽奖机会
    * @param $sUuid string 用户唯一的uuid
    * return array
    * */
    public function genLotteryTimes($sUuid){
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        return $aRes;
    }

    /*
    * 更新抽奖次数，隔天重置
    * @param $sUuid string 用户唯一的uuid
    * @param $iType int 1代表增加抽奖机会，2使用抽奖机会
    * return bool  成功或者失败
    * */
    public function updateLotteryTimes($sUuid, $iType=1){
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        $iResidueTimes = $aRes['residue_times'];
        //先检查有没有这个用户
        if(isset($aRes['residue_times'])){
            //隔天重置
            if(date("Y-m-d") > date("Y-m-d",$aRes['update_time'])){
                $sSql = "update luniang_2017_user set max_times=12,residue_times=0,update_time='".time()."' where uuid='".$sUuid."'";
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
     * */


    /*
    * 执行抽奖
    * @param $sUuid string 用户唯一的uuid
    * return array('status'=>Integer, 'message'=>String, 'data'=>String/Array);
    * */
    public function doLottery($sUuid){
        if($this->_isRewarded($sUuid)){//该用户已经中过奖
            $sStatus = 2;
        }
        $aRes = array();
        $aData = array();
        $aLotteryTimes = $this->genLotteryTimes($sUuid);
        $iResidueTimes = 0;
        if($aLotteryTimes['residue_times'] > 0){//有抽奖机会
            $iRand = rand(0,self::LUCK_PROBABILITY);
            switch($iRand){//中奖
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    if($sStatus != 2){
                        $aPrize = $this->_genPrizeByPrizeType($iRand);
                    }
                    break;
                default:
                    $sStatus = 0;
                    break;
            }
            $iResidueTimes = $this->updateLotteryTimes($sUuid, self::USE_CHANGES);
            if(!empty($aPrize)){
                $sStatus = 1 ;
//                $iUid = $this->_genUidByUuid($sUuid);
                $sSql = "update luniang_2017_prize set uuid='".$sUuid."',status='1',lottery_time='".time()."' where id=".$aPrize['id'];
                $aData['prize_type'] = $iRand;
                $aData['prize_name'] = $aPrize['prize_name'];
                $this->_MDB->Query($sSql);
            }
        }else{
            if($aLotteryTimes['max_times'] > 0){//今天还有抽奖机会，可分享皮肤或者下载皮肤获取抽奖机会
                $sStatus = 3;
            }else{//今日抽奖机会已用完
                $sStatus = 4;
            }
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
        $sUuids = '(\'';
        foreach($aPrizes as $k=>$v){
            $sUuids .= $v['uuid'].'\',';
        }
        $sUuids = trim($sUuids,',').")";
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
     * return bool
     * */
    private function _isRewarded($sUuid){
        $sSql = "select uid from luniang_2017_user where uuid='".$sUuid."'";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        if(isset($aRes['uid'])){
            $sSql = "select count(*) as num from luniang_2017_prize where uuid='".$sUuid."' and status!='0'";
            $oQuery = $this->_MDB->Query($sSql);
            $aRes = $this->_MDB->FetchArray($oQuery);
            if($aRes['num'] == 1){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }


    /*
     * 通过uuid获取uid
     * @param $sUuid string
     * return uid
     * */
//    private function _genUidByUuid($sUuid){
//        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."'";
//        $oQuery = $this->_MDB->Query($sSql);
//        $aRes = $this->_MDB->FetchArray($oQuery);
//        return $aRes['uid'];
//    }



}