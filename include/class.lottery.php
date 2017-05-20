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
     * 初始化或者更新抽奖次数
     * @param $sUuid string 用户唯一的uuid
     * return bool  成功或者失败
     * */
    public function initLotteryTimes($sUuid);

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
     * */
    public function genRewardInfo();
}

class Lottery implements LotteryIf{

    const LUCK_PROBABILITY = 1000;//中奖概率
    const UNPRIZE = 0;//未中奖
    const PRIZED_NO_USERINFO = 1;//中奖还没填中奖信息
    const PRIZED_HAS_USERINFO = 2;//中奖已填中奖信息

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
        '3' => '没有抽奖机会，请分享/下载皮肤获取抽奖机会',
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

    public function genLotteryTimes($sUuid){
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        return $aRes;
    }

    public function initLotteryTimes($sUuid){
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchArray($oQuery);
        //先检查有没有这个用户
        if(isset($aRes['residue_times'])){
            $sSql = "update luniang_2017_user set max_times=max_times-1,residue_times=residue_times+1,update_time='".time()."' where uuid='".$sUuid."' and max_times>=1";
        }else{
            $sSql = "insert into luniang_2017_user(`uuid`,`residue_times`,`max_times`,`create_time`)values
                    ('".$sUuid."',0,12,'".time()."')";
        }
        $oQuery = $this->_MDB->Query($sSql);
        if($oQuery){
            return true;
        }
        return false;
    }

    public function doLottery($sUuid){
        if($this->_isRewarded($sUuid)){//该用户已经中过奖
            $sStatus = 2;
        }
        $aRes = array();
        $aData = array();
        $aLotteryTimes = $this->genLotteryTimes($sUuid);
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
                    $sStatus = 1 ;
                    $aPrize = $this->_genPrizeByPrizeType($iRand);
                    break;
                default:
                    $sStatus = 0;
                    break;
            }
            if(!empty($aPrize)){
                $sSql = "update luniang_2017_prize set uid='".$sUuid."',status='".$sStatus."',lottery_time='".time()."' where id=".$aPrize[''];
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
        $aRes['status'] = $sStatus;
        $aRes['message'] = self::$prizeStatusMessage[$sStatus];
        $aRes['data'] = $aData;
        return $aRes;
    }

    public function insertLotteryInfo($sUuid, $sName, $iPhone, $sAddr, $sEmail){
        $sSql = "update luniang_2017_user set user_phone='".$iPhone."',user_name='".$sName."',user_email='".$sEmail."',user_addr='".$sAddr."' where uuid='".$sUuid."'";
        if($this->_MDB->Query($sSql)){
            $sSql = "update luniang_2017_prize set status='".self::PRIZED_HAS_USERINFO."' where uuid='".$sUuid."'";
            if($this->_MDB->Query($sSql)){
                return true;
            }
        }
        return false;
    }

    public function genRewardInfo(){

    }


    /*
     * 根据奖品类型获取一条对应的奖品
     * @param $iType int 奖品类型
     * return mixed
     * */
    private function _genPrizeByPrizeType($iType){
        $sSql = "select * from luniang_2017_prize where prize_type='".$iType."' and status='".self::UNPRIZE.
            "' and prize_date='".date("Y-m-d H:i:s")."' limit 1";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchAll($oQuery);
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
            $sSql = "select count(*) as num from luniang_2017_prize where uid='".$aRes['uid']."' and status='".self::PRIZED_HAS_USERINFO."'";
            $oQuery = $this->_MDB->Query($sSql);
            $aRes = $this->_MDB->FetchArray($oQuery);
            if($aRes['num'] == 1){
                return true;
            }
        }else{
            return false;
        }
    }


}