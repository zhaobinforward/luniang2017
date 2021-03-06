<?php
/**
 *	mysql相关操作
 */
class nMysql { 
	var $m_host; 
	var $m_port; 
	var $m_user; 
	var $m_password; 
	var $m_name; 
	var $m_link; 
	var $m_charset;
	
	function Err($sql = "") {
//		echo "db error!";exit;
		$host 			= $_SERVER['HTTP_HOST'];
		$remote_addr 	= $_SERVER['REMOTE_ADDR'];
//		echo "db error!";exit;
		if (!isset($remote_addr) || $remote_addr == "127.0.0.1") {
			echo "error sql : $sql\n";
			echo "error number : ".$this->GetErrno()."\n";
			echo "error information : ".$this->GetError()."\n";
		} else {
			echo "db error!".$this->GetError()."\n";
		}
		return false;
	} 
	
	/**	实例化方法
	 *	@param $dbname String 要使用数据库名(非数据库服务器)
	 *	@param $args Array 额外参数(键值对, 键名为参数名, 键值为参数值)
	 *	@teturn Array
	 */
	function nMysql()
	{
		$args = func_num_args();
		$argv = func_get_args();
		
		$db = $argv[0];
		$opt = isset($argv[1]) ? $argv[1]: array(); 
		$charset = isset($opt['charset'])? $opt['charset']: 'utf8';  // 默认为utf8
		
		if(!PRODUCT_MODEL) {
			$this->m_name     = "sogou_shoujiyunying";
			$this->m_host     = "localhost";
			$this->m_port     = "3306";
			$this->m_user     = "root";
			$this->m_password = "123456";
			$this->m_charset = $charset;
		} else {
			$this->m_name     = "sogou_shoujiyunying";
			$this->m_host     = "shoujiyunying.minput.rds.sogou";
			$this->m_port     = "3306";
			$this->m_user     = "shoujiyunying";
			$this->m_password = "sjyunying2017";
			$this->m_charset = $charset;
		}

		$this->m_charset = $charset;
	}
	
	function _initconnection() {
		if($this->m_link==0) {
			$real_host = $this->m_host.":".$this->m_port;
			if(!$this->m_link = mysql_connect($real_host,$this->m_user,$this->m_password)) {
				//die('Could not connect: ' . mysql_error());
				die($this->Err("mysql connect"));
			}
			mysql_query("SET NAMES '". $this->m_charset ."'");
			if ('' != $this->m_name) {
				mysql_select_db($this->m_name, $this->m_link) or die($this->Err("use $this->m_name"));
			}             
		}
	}

	function SelectDb($database) {
		$this->m_name = $database;
		if('' != $this->m_name) {
			if ($this->m_link == 0) {
				$this->_initconnection();
			}
			mysql_select_db($this->m_name, $this->m_link) or die($this->Err("use $database"));
		}
	}

	function Query($SQL, $phs = array()) { 
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		$result=mysql_query($SQL,$this->m_link) or die($this->Err($SQL)); 
		return $result; 
	} 
	
	/*
	 *   此函数可以在$SQL语句中携带?号, 
	 *   后面的数组将依次把值放到相应的问号处;
	 *   如: $mysql->Query_arg("select * from user where id=?", array($id));
	 *   Add By xiao-liang, 2009-02-18 
	 */
	function Query_arg($SQL, $phs = array()) 
	{
		if ($this->m_link == 0)
		{
			$this->_initconnection();
		}
		
		if ($phs != '')
		{
			foreach ($phs as $ph) 
			{
				$ph = "'" . mysql_real_escape_string($ph) . "'";
				$SQL = substr_replace(
					$SQL, $ph, strpos($SQL, '?'), 1
				);
			}
		}

		$result=mysql_query($SQL, $this->m_link) or die($this->Err($SQL)); 
		
		return $result; 
	}
	
	function db_query($SQL, $phs = array()) 
	{
		if ($this->m_link == 0)
		{
			$this->_initconnection();
		}
		
		if (strtoupper(substr($SQL, 0, 3)) != 'SEL') {
			return $this->Query($SQL, $phs);
		}
		
		if ($phs != '')
		{
			foreach ($phs as $ph) 
			{
				$ph = "'" . mysql_real_escape_string($ph) . "'";
				$SQL = substr_replace(
					$SQL, $ph, strpos($SQL, '?'), 1
				);
			}
		}

		$result=mysql_query($SQL, $this->m_link) or die($this->Err($SQL)); 
		return $this->FetchAll($result);
	}
	
	function GetErrno() {
		return $this->m_link ? mysql_errno($this->m_link) : mysql_errno();
	}
	
	function GetError() {
		return $this->m_link ? mysql_error($this->m_link) : mysql_error();
	}
	
	function FetchArray($result) { 
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		$row = mysql_fetch_array($result, MYSQL_ASSOC);
		return $row;
	}

	// 此函数可以获取整个数据集, 并能根据字段名获取字段值,解决只能凭id查询.
	// Add By xiao-liang, 2009-02-18
	function FetchAll($result) {
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		$rows = array();
		while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$rows[] = $row;
		}
		return $rows;
	}

	function FetchArrays($result) {//取多行记录
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		$rowno=@mysql_num_rows($result);
		if($rowno>0) {
			for($i=0;$i<$rowno;$i++) {
				$rows[$i] = @mysql_fetch_row($result);
			}
		}
		return $rows; 
	}
	
	/**	功能 更新数据表数据
	 *	@param $table String 表名 必须
	 *	@param $data Array 要更新的数据 如array('field1'=>$value1,'field2'=>$value2, ...)
	 *	@param $condition String 条件 如"`uid`=1"
	 *	@param $limit 限制更新条数 [true:是, false:否]
	 *	@return Integer
			1:更新成功
			0:更新失败
			-1:sql语句为空
	 */
	function update_table($table, $data, $condition, $limit = false) {
		$sql = parse_update_sql($table, $data, $condition, $limit);
		if(empty($sql)) {
			return -1;
		}
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		return @mysql_query($sql, $this->m_link) ? 1 : 0;
	}

	/**	功能 写入数据至表
	 *	@param $table String 表名 必须
	 *	@param $data Array 要写入的数据 如array('field1'=>$value1,'field2'=>$value2, ...)
	 *	@param $return_insert_id Boolean 写入成功是否返回主键id(数字) [true:是, false:否]
	 *	@return Integer
			自增ID:写入成功
			1:写入成功
			0:写入失败
			-1:sql语句为空
	 */
	function insert_table($table, $data, $return_insert_id = true) {
		$sql = parse_insert_sql($table, $data);
		if(empty($sql)) {
			return -1;
		}
		if($this->m_link == 0) {
			$this->_initconnection();
		}
		return @mysql_query($sql, $this->m_link) ? ($return_insert_id ? @mysql_insert_id($this->m_link) : 1) : 0;
	}
	
	function FreeResult(&$result) { 
		if ($this->m_link == 0) {
			$this->_initconnection();
		}
		return mysql_free_result($result) or die($this->Err()); 
	} 

	function close() {
		if ($this->m_link == 0) {
			$this->_initconnection();
		}
		mysql_close($this->m_link) or die($this->Err());
	}

	function getInsertID() {
		if ($this->m_link == 0) {
			$this->_initconnection();
		}
		return mysql_insert_id($this->m_link);
	}
}
	
function mdb_query($db, $sql, $opt = array('charset'=>'utf8')) {
	$mysql = new nMysql($db, $opt);
	$list = $mysql->db_query($sql);
	$mysql->close();
	return $list;
}

function mdb_query_latin($db, $sql)
{
	$opt = array('charset'=>'latin1');
	$mysql = new nMysql($db, $opt);
	$list = $mysql->db_query($sql);
	$mysql->close();
	return $list;
}

function mdb_query_gbk($db, $sql)
{
	$opt = array('charset'=>'gbk');
	$mysql = new nMysql($db, $opt);
	$list = $mysql->db_query($sql);
	$mysql->close();
	return $list;
}
?>