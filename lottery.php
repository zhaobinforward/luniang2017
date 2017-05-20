<?php
/**
 *    抽奖
 */

/**
 *    return json 结构的数据
 *    $return = array('status'=>Integer, 'message'=>String, 'data'=>String/Array);
 * status 释义
 * 0: 无效的请求
 * 1: 满足抽条件,且抽了奖,且中了奖
 * 2: 未登录
 * 3: 活动未开始
 * 4: 活动已结束
 * 5: 无效的IP
 * 6: 禁止抽奖的用户或黑名单用户
 * 7: 还没有抽奖资格(剩余抽奖次数为0)
 * 8: 没有达到阈值
 * 9: 没有奖品(奖品数据为空)
 * 10: 重复中奖(中奖失败)
 * 11: 没有中奖(事务回滚)(写入中奖纪录失败)
 * 12: 奖品对应奖池为空
 * 13: 扣除中奖机会失败(事务回滚)
 * 14: 标记奖池奖品为已抽出失败(事务回滚)
 * message 释义
 * [0]invalid_request: 无效的请求
 * [1]success: 恭喜中奖
 * [2]need_login 未登录
 * [3]waiting_start: 活动未开始
 * [4]has_end: 活动已结束
 * [5]ip_invalid: 无效的IP
 * [6]user_invalid: 禁止抽奖的用户或黑名单用户
 * [7]try_left_empty: 还没有抽奖资格(剩余抽奖次数为0)
 * [8]under_threshold 没有达到阈值
 * [9]no_awards: 没有奖品(奖品数据为空)
 * [10]award_repeat: 重复中奖(中奖失败)
 * [11]hit_fail: 没有中奖(事务回滚)(写入中奖纪录失败)
 * [12]apool_empty: 奖品对应奖池为空
 * [13]tryleft_fail: 扣除中奖机会失败(事务回滚)
 * [14]poolflag_fail: 标记奖池奖品为已抽出失败(事务回滚)
 */

require 'common.php';
require APP_ROOT . '/include/inc.session.php';

define('LOG_ON', true);//开启记录抽奖日志

if (!submitcheck('dosubmit')) {
    apimessage('invalid_request', 0);//无效的请求
}

if ((R_DATE_START > 0 && TIMESTAMP < R_DATE_START) && !is_tester() && !is_whiter()) {
    apimessage('waiting_start', 3);//活动未开始
}

if ((R_DATE_END > 0 && TIMESTAMP > R_DATE_END) && !is_tester() && !is_whiter()) {
    apimessage('has_end', 4);//活动已结束
}

if ($_G['uid'] < 1) {
    apimessage('need_login', 2);//未登录
}

$user = get_login_user();
if (empty($user)) {
    apimessage('need_login', 2);//未登录
}

if (!isip($_G['onlineip'])) {
    apimessage('ip_invalid', 5);//无效的IP
}

//检查黑名单
if (is_blacker()) {
    apimessage('user_invalid', 6);//禁止抽奖的用户或黑名单用户
}

//检查抽奖次数(测试人员不受次数限制)
if ($user['try_left'] < 1 && !is_tester()) {
    apimessage('try_left_empty', 7);//还没有抽奖资格(剩余抽奖次数为0)
}

//获取抽奖随机值
$random_code = mt_rand(1, 100000) / 100000;
if (is_tester() || is_whiter()) {
    if(is_tester()) {
        $random_code = $random_code / 100;
    } else {
        $random_code = $random_code / 10;
    }
}


/**    抽奖日志数据
 *    return_code
 *    0: 中奖
 *    1: 没有达到阈值
 *    2: 奖品列表为空(已达到阈值)
 *    3: 重复中奖(已达到阈值)
 *    4: 奖品对应奖池为空(已达到阈值)
 *    5: 写入中奖纪录失败(事务回滚)(已达到阈值)(已抽到奖池奖品,但中奖失败)
 *    6: 扣除中奖机会失败(事务回滚)
 *    7: 标记奖池奖品为已抽出失败(事务回滚)
 */
$log = array(//抽奖日志
    'pool_id' => 0,
    'award_id' => 0,
    'uid' => addslashes($user['uid']),
    'ip' => addslashes($_G['onlineip']),
    'ratio' => sprintf('%f', $random_code),
    'threshold' => sprintf('%f', R_GAILV),
    'return_info' => '',
    'return_code' => 0,
    'create_time' => TIMESTAMP,
);

//开启事务
$MDB->query('START TRANSACTION');

//消耗抽奖次数(测试人员不消耗抽奖次数)
if (!is_tester()) {
    $extrsql = $user['try_left'] == 1 ? ", `update_time`=" . TIMESTAMP : "";
    $sql = "UPDATE `lucky2017_user`
		SET `try_left`=`try_left`-1{$extrsql}
		WHERE `uid`={$user['uid']} AND `try_left`>0 LIMIT 1";
    if ($MDB->query($sql)) {
        $user['try_left'] = $user['try_left'] - 1;
    } else {
        $MDB->query('ROLLBACK');
        $log['return_code'] = 6;
        write_log($log);
        set_storage($user);
        apimessage('tryleft_fail', 13, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//没有中奖
    }
}

if ($random_code > R_GAILV) {
    $MDB->query('COMMIT');
    $log['return_code'] = 1;
    write_log($log);
    set_storage($user);
    apimessage('under_threshold', 8, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//没有中奖
    exit;
}
//载入奖品数据
$awards = load_awards(true);
$awards = empty($awards) ? array() : $awards;
foreach ($awards as $key => $value) {
    if (intval($value['total']) < 1) {
        unset($awards[$key]);
    }
}
if (empty($awards)) {
    $MDB->query('COMMIT');
    $log['return_code'] = 2;
    write_log($log);
    set_storage($user);
    apimessage('no_awards', 9, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//没有奖品
}

$factors = 0;//奖品总因子
foreach ($awards as $key => $value) {
    $awards[$key]['factor'] = $value['factor'] = intval($value['factor']);
    $factors += $value['factor'];
}

//分配奖品
$log['return_info'] = array(
    'factor' => '',
    'factors' => $factors,
    'list' => array()
);
$factor = mt_rand(0, $factors);
$log['return_info']['factor'] = $factor;
$awards = array_merge($awards);//产生连续索引
$hit_key = null;
$k1 = $k2 = 0;
$_length = count($awards);
for ($ii = 0; $ii < $_length; $ii++) {
    $k1 += $ii < 1 ? 0 : $awards[$ii - 1]['factor'];
    $k2 += $awards[$ii]['factor'];
    $log['return_info']['list'][$awards[$ii]['id']] = $k2;
    if ($factor >= $k1 && $factor < $k2) {
        $hit_key = $ii;
        break;
    }
}
$log['return_info'] = addslashes(serialize($log['return_info']));
if ($hit_key === null) {
    $hit_key = $_length - 1;
}
$award = $awards[$hit_key];

$log['award_id'] = $award['id'];

//检查先前是否抽中过,抽中过就不能再中了(测试员除外)
if (!is_tester()) {
    $sql = "SELECT `id` FROM `lucky2017_hits`
		WHERE `uid`={$user['uid']} LIMIT 1";
    $query = $MDB->query($sql);
    if ($MDB->fetch_array($query)) {
        $MDB->query('COMMIT');
        $log['return_code'] = 3;
        write_log($log);
        set_storage($user);
        apimessage('award_repeat', 10, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//重复中奖
    }
}

//检查是否还有余量
$sql = "SELECT * FROM `lucky2017_pool`
	WHERE `award_id`={$award['id']} AND `flag`=1 AND `num`>0 AND (`day`='' OR `day`='" . date('Ymd', R_TODY_START) . "') AND (`time`=0 OR `time`<=" . R_TODY_OFFSET . ") AND (`time2`=0 OR `time2`>=" . R_TODY_OFFSET . ") LIMIT 1";
$query = $MDB->query($sql);
if ($award_pool = $MDB->fetch_array($query)) {
    $award_data = array(
        'id' => $award['id'],
        'name' => $award['name'],
        'picurl' => $award['picurl'],
        'picurl2' => $award['picurl2'],
        'price' => $award['price'],
        'p_unit' => $award['p_unit'],
        'num' => $award_pool['num'],
        'unit' => $award['unit'],
        'type' => intval($award['type']),
        'code' => $award_pool['award_code'],
        'sponsor' => $award['sponsor'],
        'how_to_use' => $award['how_to_use'],
        'remark' => $award['remark'],
    );
    $newarr = array(
        'pool_id' => $award_pool['id'],
        'award_id' => $award['id'],
        'uid' => $user['uid'],
        'award_data' => addslashes(serialize($award_data)),
        'ratio' => $log['ratio'],
        'threshold' => $log['threshold'],
        'create_time' => TIMESTAMP,
    );

    $insert_id = $MDB->insert_table('lucky2017_hits', $newarr, true);
    if ($insert_id > 0) {//中奖成功
        //标记为已抽出
        if (1 > $MDB->update_table('lucky2017_pool', array('flag' => 0, 'update_time' => TIMESTAMP), "`id`={$award_pool['id']} AND `flag`>0", true)) {
            $MDB->query('ROLLBACK');
            $log['return_code'] = 7;
            write_log($log);
            set_storage($user);
            apimessage('poolflag_fail', 14, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//中奖失败
        }
        $MDB->query('COMMIT');
        $log['pool_id'] = $award_pool['id'];
        write_log($log);
        set_storage($user);
        apimessage('success', 1, array('uid' => $user['uid'], 'try_left' => $user['try_left'], 'hitid' => $insert_id, 'award' => $award_data));//恭喜中奖
    } else {//写入中奖纪录失败
        $MDB->query('ROLLBACK');
        $log['return_code'] = 5;
        write_log($log);
        set_storage($user);
        /*set_storage(array(
            'try_left' => $user['try_left']+1,
            'downloaded' => $user['downloaded'],
            'shared' => $user['shared'],
        ));*/
        apimessage('hit_fail', 11, array('uid' => $user['uid'], 'try_left' => $user['try_left'] + 1));//没有中奖
    }
    exit;
}

//奖池已经没有该奖品了
$MDB->query('COMMIT');
$log['return_code'] = 4;
write_log($log);
set_storage($user);
apimessage('apool_empty', 12, array('uid' => $user['uid'], 'try_left' => $user['try_left']));//没有中奖

/**    记录抽奖日志
 * @param $log Array 日志数据
 * @return Integer
1: 记录成功
 * <1: 记录失败
 */
function write_log($log)
{
    global $MDB;
    if ((defined('LOG_ON') ? LOG_ON : 0)) {
        return $MDB->insert_table('lucky2017_log', $log);
    }
    return -99;
}

?>
