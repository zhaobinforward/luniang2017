DROP TABLE IF EXISTS `luniang_2017_prize`;
create table `luniang_2017_prize`(
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `prize_name` varchar(100) NOT NULL DEFAULT '' COMMENT '奖品名称',
  `prize_type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '奖品类型',
  `prize_date` varchar(100) NOT NULL DEFAULT '' COMMENT '奖品哪天发放',
  `uuid` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖用户uuid',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '中奖状态 0:未中奖，1:中奖未填中奖信息，2：中奖已填中奖信息',
  `lottery_time` int(11) NOT NULL DEFAULT '0' COMMENT '中奖时间',
  PRIMARY  KEY (`id`),
  KEY `idx_uuid`(`uuid`),
  KEY `idx_prize_status_type_date`(`status`,`prize_type`,`prize_date`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '鹿娘奖品表';

DROP TABLE IF EXISTS `luniang_2017_user`;
create table `luniang_2017_user`(
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户自增uid',
  `uuid` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖用户唯一的uuid',
  `residue_times` tinyint(3) NOT NULL DEFAULT '0' COMMENT '当日拥有抽奖次数',
  `max_times` tinyint(3) NOT NULL DEFAULT '0' COMMENT '当日还可以抽多少奖',
  `user_phone` varchar(11) NOT NULL DEFAULT '' COMMENT '中奖用户手机号',
  `user_name` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖用户名字',
  `user_email` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖用户邮箱',
  `user_addr` varchar(100)  NOT NULL DEFAULT '' COMMENT '中奖用户邮寄地址',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `idx_uuid`(`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '鹿娘用户表';

DROP TABLE IF EXISTS `luniang_2017_log`;
CREATE TABLE `luniang_2017_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reward_id` int(10) unsigned NOT NULL DEFAULT '0',
  `reward_name` varchar(100) NOT NULL DEFAULT '',
  `uuid` varchar(100) NOT NULL DEFAULT '',
  `ratio` varchar(12) NOT NULL default '',
  `return_info` varchar(255) NOT NULL DEFAULT '',
  `return_code` tinyint(3) NOT NULL DEFAULT '0',
  `prize_type` int(11) NOT NULL DEFAULT '0',
  `area` varchar(100) NOT NULL DEFAULT '',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into luniang_2017_prize (`prize_name`,`prize_type`,`prize_date`)values('网易漫画一个月VIP(10元)',1,'20170521'),('网易漫画一个月VIP(10元)',1,'20170521'),('网易漫画一个月VIP(10元)',1,'20170521'),('网易漫画一个月VIP(10元)',1,'20170521'),('网易漫画三个月VIP(30元)',2,'20170521'),('网易漫画三个月VIP(30元)',2,'20170521'),('网易漫画三个月VIP(30元)',2,'20170521'),('网易漫画三个月VIP(30元)',2,'20170521'),('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),('动漫抱枕(66元)',4,'20170521'),('动漫抱枕(66元)',4,'20170521'),('动漫抱枕(66元)',4,'20170521'),('动漫抱枕(66元)',4,'20170521'),('动漫抱枕(66元)',4,'20170521'),('动漫抱枕(66元)',4,'20170521'),('《中国怪谈》单行本(68元)',5,'20170521'),('《中国怪谈》单行本(68元)',5,'20170521'),('《中国怪谈》单行本(68元)',5,'20170521'),('《中国怪谈》单行本(68元)',5,'20170521'),('《中国怪谈》单行本(68元)',5,'20170521'),('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),('鹿娘保温杯(128元)',7,'20170521'),('鹿娘保温杯(128元)',7,'20170521'),('鹿娘保温杯(128元)',7,'20170521'),('鹿娘保温杯(128元)',7,'20170521'),('鹿娘保温杯(128元)',7,'20170521'),('《中国怪谈》T恤(138元)',8,'20170521'),('《中国怪谈》T恤(138元)',8,'20170521'),('《中国怪谈》T恤(138元)',8,'20170521'),('《中国怪谈》T恤(138元)',8,'20170521'),('《中国怪谈》T恤(138元)',8,'20170521')

insert into luniang_2017_prize (`prize_name`,`prize_type`,`prize_date`)values
('网易漫画一个月VIP(10元)',1,'20170521'),
('网易漫画一个月VIP(10元)',1,'20170521'),
('网易漫画一个月VIP(10元)',1,'20170521'),
('网易漫画一个月VIP(10元)',1,'20170521'),
('网易漫画三个月VIP(30元)',2,'20170521'),
('网易漫画三个月VIP(30元)',2,'20170521'),
('网易漫画三个月VIP(30元)',2,'20170521'),
('网易漫画三个月VIP(30元)',2,'20170521'),
('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),
('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),
('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),
('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),
('鹿娘春日福袋：鹿娘钥匙扣+动漫卡贴(50元)',3,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('动漫抱枕(66元)',4,'20170521'),
('《中国怪谈》单行本(68元)',5,'20170521'),
('《中国怪谈》单行本(68元)',5,'20170521'),
('《中国怪谈》单行本(68元)',5,'20170521'),
('《中国怪谈》单行本(68元)',5,'20170521'),
('《中国怪谈》单行本(68元)',5,'20170521'),
('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),
('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),
('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),
('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),
('《中国怪谈》趣味福袋：卷纸+钥匙扣(78元)',6,'20170521'),
('鹿娘保温杯(128元)',7,'20170521'),
('鹿娘保温杯(128元)',7,'20170521'),
('鹿娘保温杯(128元)',7,'20170521'),
('鹿娘保温杯(128元)',7,'20170521'),
('鹿娘保温杯(128元)',7,'20170521'),
('《中国怪谈》T恤(138元)',8,'20170521'),
('《中国怪谈》T恤(138元)',8,'20170521'),
('《中国怪谈》T恤(138元)',8,'20170521'),
('《中国怪谈》T恤(138元)',8,'20170521'),
('《中国怪谈》T恤(138元)',8,'20170521')
