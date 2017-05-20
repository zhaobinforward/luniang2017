create table `luniang_2017_prize`(
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `prize_name` varchar(100) NOT NULL DEFAULT '' COMMENT '奖品名称',
  `prize_type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '奖品类型',
  `prize_date` varchar(100) NOT NULL DEFAULT '' COMMENT '奖品哪天发放',
  `uid` varchar(10) NOT NULL DEFAULT '' COMMENT '中奖用户uid',
  `lottery_time` int(11) NOT NULL DEFAULT '0' COMMENT '中奖时间',
  PRIMARY  KEY (`id`),
  KEY `idx_uid`(`uid`),
  KEY `idx_prize_type_date`(`prize_type`,`prize_date`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '鹿娘奖品表';

create table `luniang_2017_user`(
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户自增uid',
  `uuid` varchar(10) NOT NULL DEFAULT '' COMMENT '中奖用户唯一的uuid',
  `residue_times` tinyint(3) NOT NULL DEFAULT '0' COMMENT '当日拥有抽奖次数',
  `max_times` tinyint(3) NOT NULL DEFAULT '0' COMMENT '当日还可以抽多少奖',
  `user_phone` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '中奖用户手机号',
  `user_name` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖用户名字',
  `user_email` varchar(100) NOT NULL DEFAULT '' COMMENT '中奖邮箱',
  `user_addr` varchar(100)  NOT NULL DEFAULT '' COMMENT '中奖手机号',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`uid`),
  KEY `idx_uuid`(`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '鹿娘用户表';
