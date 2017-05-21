<?php
/**
 * Created by PhpStorm.
 * User: didi
 * Date: 17/5/21
 * Time: 13:51
 */
class user
{
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

    public function initUuid($sUuid){
        if(PHP7){
            $sUuid = mysqli_real_escape_string($this->_MDB->m_link, $sUuid);
        }else{
            $sUuid = mysql_real_escape_string($sUuid);
        }
        $sUuid = trim($sUuid);
        preg_match('/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i', $sUuid, $aMatch);
        if(empty($aMatch)){
            return false;
        }
        $sSql = "select * from luniang_2017_user where uuid='".$sUuid."'";
        $oQuery = $this->_MDB->Query($sSql);
        $aRes = $this->_MDB->FetchAll($oQuery);
        if(!isset($aRes[0]['uuid'])){
            $sSql = "insert into luniang_2017_user (`uuid`,`residue_times`,`max_times`,`create_time`)values('".$sUuid."','0','12','".time()."')";
            if($this->_MDB->Query($sSql)){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }

    }
}