<?php


/**	设置storage cookie
 *	@param $info Array 数据
 *	@return Boolean
 */
function set_storage($info) {
	return ssetcookie('storage', @json_encode($info));
}

function create_guid($namespace = '') {
	static $guid = '';
	$uid = uniqid('', true);
	$data = $namespace;
	$data .= isset($_SERVER['REQUEST_TIME']) ? $_SERVER['REQUEST_TIME'] : '';
	$data .= isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
	$data .= isset($_SERVER['LOCAL_ADDR']) ? $_SERVER['LOCAL_ADDR'] : '';
	$data .= isset($_SERVER['LOCAL_PORT']) ? $_SERVER['LOCAL_PORT'] : '';
	$data .= isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
	$data .= isset($_SERVER['REMOTE_PORT']) ? $_SERVER['REMOTE_PORT'] : '';
	$hash = strtolower(hash('ripemd128', $uid . $guid . md5($data)));
	$guid = substr($hash, 0, 8) . '-' . substr($hash, 8, 4) . '-' . substr($hash, 12, 4) . '-' . substr($hash, 16, 4) . '-' . substr($hash, 20, 12);
	return $guid;
}

//获取或生成唯一uid
function gen_uuid() {
	if(isset($_COOKIE['uuid']) && strlen($_COOKIE['uuid']) > 0) {
		$uuid = $_COOKIE['uuid'];
	} else if(isset($_SESSION['uuid']) && strlen($_SESSION['uuid']) > 0) {
		$uuid = $_SESSION['uuid'];
		ssetcookie('uuid', $uuid);
	} else {
		$uuid = create_guid();
		$_SESSION['uuid'] = $uuid;
		ssetcookie('uuid', $uuid);
	}
	return $uuid;
}

?>