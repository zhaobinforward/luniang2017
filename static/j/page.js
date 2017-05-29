'use strict';
var roller,ajaxPollTimer=null,retrytime=10000,swiper,user={};
$(function(){
	$(document).on(touchSupport()?'touchstart':'mousedown', '*[clickbtn="true"]', function(){
		$(this).addClass('clickbtn');
	}).on(touchSupport()?'touchend':'mouseup', '*[clickbtn="true"]', function(){
		$(this).removeClass('clickbtn');
	});
	$('.s-download').click(function(){
		var idx = $('.s-download').index(this);
		try{MtaH5.clickStat(51+idx)}catch(e){}
		if($('.s-download').eq(idx).attr('ajaxing')) {
			return;
		}
		$('.s-download').eq(idx).attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.s-download').eq(idx).removeAttr('ajaxing')}
		});
	});
	$('.share-weibo').click(function(){
		var idx = $('.share-weibo').index(this);
		dataForShareTmp = $.extend(dataForShareTmp, skins_share[idx]);
		share_weibo();
		try{MtaH5.clickStat(71+idx)}catch(e){}
		if($('.share-weibo').eq(idx).attr('ajaxing')) {
			return;
		}
		$('.share-weibo').eq(idx).attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.share-weibo').eq(idx).removeAttr('ajaxing')}
		});
	});
	$('.share-qzone').click(function(){
		var idx = $('.share-qzone').index(this);
		dataForQzoneShareTmp = $.extend(dataForQzoneShareTmp, skins_share[idx]);
		share_qzone();
		try{MtaH5.clickStat(91+idx)}catch(e){}
		if($('.share-qzone').eq(idx).attr('ajaxing')) {
			return;
		}
		$('.share-qzone').eq(idx).attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.share-qzone').eq(idx).removeAttr('ajaxing')}
		});
	});
	$('#hited-share-weibo-btn').click(function(){
		try{MtaH5.clickStat('41')}catch(e){}
		share_weibo();
		if($('.hited-share-weibo-btn').attr('ajaxing')) {
			return;
		}
		$('.hited-share-weibo-btn').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.hited-share-weibo-btn').removeAttr('ajaxing')}
		});
	});
	$('#hited-share-qzone-btn').click(function(){
		try{MtaH5.clickStat('42')}catch(e){}
		share_qzone();
		if($('.hited-share-qzone-btn').attr('ajaxing')) {
			return;
		}
		$('.hited-share-qzone-btn').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.hited-share-qzone-btn').removeAttr('ajaxing')}
		});
	});
	$('#no-tryleft-share-weibo-btn').click(function(){
		try{MtaH5.clickStat('44')}catch(e){};
		share_weibo();
		if($('.no-tryleft-share-weibo-btn').attr('ajaxing')) {
			return;
		}
		$('.no-tryleft-share-weibo-btn').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.no-tryleft-share-weibo-btn').removeAttr('ajaxing')}
		});
	});
	$('#no-tryleft-share-qzone-btn').click(function(){
		try{MtaH5.clickStat('45')}catch(e){};
		share_qzone();
		if($('.no-tryleft-share-qzone-btn').attr('ajaxing')) {
			return;
		}
		$('.no-tryleft-share-qzone-btn').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.no-tryleft-share-qzone-btn').removeAttr('ajaxing')}
		});
	});
	$('.anchor-share-weibo').click(function(){
		dataForShareTmp = $.extend(dataForShareTmp, dataForShare);
		share_weibo();
		if($('.anchor-share-weibo').attr('ajaxing')) {
			return;
		}
		$('.anchor-share-weibo').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.anchor-share-weibo').removeAttr('ajaxing')}
		});
	});
	$('.anchor-share-qzone').click(function(){
		share_qzone();
		if($('.anchor-share-qzone').attr('ajaxing')) {
			return;
		}
		$('.anchor-share-qzone').attr('ajaxing', true);
		ajaxprocess({
			type: 'post',
			url: 'ajax/updateLotteryTimes.php',
			data: {},
			dataType: 'json',
			success: function(resp) {
				user.status==0&&$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.anchor-share-qzone').removeAttr('ajaxing')}
		});
	});
	getInitInfo(function(data){
		user.status = data.status;
		user.prize_name = data.prize_name;
		if(data.status == 0) {
			$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+data.residue_times+'\u6b21');
		} else {
			dataForShareTmp = $.extend(dataForShareTmp, hits_share_weibo);
//console.log(hits_share_weibo,dataForShareTmp);
			dataForQzoneShareTmp = $.extend(dataForQzoneShareTmp, hits_share_qzone);
			$('.tryleft-info').html('\u60a8\u5df2\u4e2d\u5956\u3002');/*您已中奖。*/
		}
	});
	roller = new iRoller({
		cycle: 1,
		hitpos: -1,
		speed: 150,
		speedEnd: 300,
		speedType: 'easing-in',
		rollerClass: 'roller',
		activeClass: 'active',
		count: 10
	});
	$('.anchor-download').click(function(){
		try{MtaH5.clickStat('5')}catch(e){}
		iScrollTo('download');
	});
	$('.anchor-lottery').click(function(){
		try{MtaH5.clickStat('6')}catch(e){}
		iScrollTo('lottery');
	});
	$('.anchor-manhua').mousedown(function(){
		try{MtaH5.clickStat('7')}catch(e){}
	});
	$('#lottery-btn').click(function(){
		try{MtaH5.clickStat('2')}catch(e){}
		lottery();
	});
	
	bindGetCounter();
	
	$('form[ajaxform="true"]').ajaxForm({
        dataType: 'json',
		timeout: 3000,
        beforeSubmit: function (data, form) {
            var realname, telnumber, email, addr;
			
			var isemail = function($email) {
				return $email.length > 6 && $email.length <= 32 && /^([A-Za-z0-9\-_.+]+)@([A-Za-z0-9\-]+[.][A-Za-z0-9\-.]+)$/i.test($email);
			}
			
            if($(form).find('input[name="realname"]').size() > 0) {
                realname = $.trim($(form).find('input[name="realname"]').val());
            } else {
				realname = '';
			}
			if (realname.length < 1) {
				alert('\u6ca1\u6709\u586b\u5199\u59d3\u540d');/*没有填写姓名*/
				return false;
			}
			
			if($(form).find('input[name="telnumber"]').size() > 0) {
                telnumber = $.trim($(form).find('input[name="telnumber"]').val());
            } else {
				telnumber = '';
			}
			if(telnumber.length < 1) {
				alert('\u6ca1\u6709\u586b\u5199\u7535\u8bdd');/*没有填写电话*/
				return false;
			} else if(!/^1[34578]{1}\d{9}$/i.test(telnumber)) {
				alert('\u65e0\u6548\u7684\u7535\u8bdd\u53f7\u7801');/*无效的电话号码*/
				return false;
			}
			
			if($(form).find('input[name="email"]').size() > 0) {
                email = $.trim($(form).find('input[name="email"]').val());
            } else {
				email = '';
			}
			if(email.length < 1) {
				alert('\u6ca1\u6709\u586b\u5199\u90ae\u7bb1');/*没有填写邮箱*/
				return false;
			} else if(!isemail(email)) {
				alert('\u90ae\u7bb1\u683c\u5f0f\u4e0d\u6b63\u786e');/*邮箱格式不正确*/
				return false;
			}
			
            if($(form).find('input[name="addr"]').size() > 0) {
                addr = $.trim($(form).find('input[name="addr"]').val());
            } else {
				addr = '';
			}
			if(addr.length < 1) {
				alert('\u6ca1\u6709\u586b\u5199\u5730\u5740');/*没有填写地址*/
				return false;
			}
        },
        success: function (resp) {
            if (typeof resp != 'object') {
                try {
                    resp = JSON.parse(resp);
                } catch (e) {
					alert('\u54cd\u5e94\u5931\u8d25');/*响应失败*/
                    return;
                }
            }
			resp.errno = parseInt(resp.errno);
            if(resp.errno == 0) {//save success
				user.status=2;
				unBindGetCounter();
				bindGetCounter();
				$(window).unbind('beforeunload');
				$('#hits .popbox-btn.popbox-btn-tryagain').unbind('click').bind('click', function(){
					$('#hits.popbox-wrap, .popbox-cover').hide();
					iScrollTo('lottery');
				});
				alert(resp.errmsg);
				/*是否需要关闭form表单*/
				$('#hits.popbox-wrap, .popbox-cover').hide();
                return;
            }
			alert(resp.errmsg);
        },
        error: function () {
            alert('\u54cd\u5e94\u5931\u8d25');/*响应失败*/
            return;
        },
        complete: function (XMLHttpRequest, status) {
            if(status == 'timeout') {
				alert('\u8bf7\u6c42\u8d85\u65f6');/*请求超时*/
				return;
            }
        }
    });
});

/*有一份儿童节礼物待领取！*/
var _stitle = '\u6709\u4e00\u4efd\u513f\u7ae5\u8282\u793c\u7269\u5f85\u9886\u53d6\uff01';
var skins_share = [
	{
		title:_stitle,
		/*这么精美的皮肤，不推不给力啊~【嗜谎之神 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u4e48\u7cbe\u7f8e\u7684\u76ae\u80a4\uff0c\u4e0d\u63a8\u4e0d\u7ed9\u529b\u554a\u007e\u3010\u55dc\u8c0e\u4e4b\u795e\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954593939682_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561735?f=luniang2017'
	},
	{
		title:_stitle,
		/*这款皮肤太给力了，推荐大家使用~O(∩_∩)O~ 【中国怪谈（动态）- 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u6b3e\u76ae\u80a4\u592a\u7ed9\u529b\u4e86\uff0c\u63a8\u8350\u5927\u5bb6\u4f7f\u7528\u007e\u004f\u0028\u2229\u005f\u2229\u0029\u004f\u007e\u0020\u3010\u4e2d\u56fd\u602a\u8c08\uff08\u52a8\u6001\uff09\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954598392117_former.gif',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561741?f=luniang2017'
	},
	{
		title:_stitle,
		/*换了一款不错的搜狗皮肤，大家试试 【青蛙王子快走开 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u6362\u4e86\u4e00\u6b3e\u4e0d\u9519\u7684\u641c\u72d7\u76ae\u80a4\uff0c\u5927\u5bb6\u8bd5\u8bd5\u0020\u3010\u9752\u86d9\u738b\u5b50\u5feb\u8d70\u5f00\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954568709235_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561731?f=luniang2017'
	},
	{
		title:_stitle,
		/*好喜欢这款皮肤，都来下载吧 【女友？日后再说 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u597d\u559c\u6b22\u8fd9\u6b3e\u76ae\u80a4\uff0c\u90fd\u6765\u4e0b\u8f7d\u5427\u0020\u3010\u5973\u53cb\uff1f\u65e5\u540e\u518d\u8bf4\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954556016459_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561729?f=luniang2017'
	},
	{
		title:_stitle,
		/*分享一款漂亮的搜狗皮肤~  【仙世录（动态 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u5206\u4eab\u4e00\u6b3e\u6f02\u4eae\u7684\u641c\u72d7\u76ae\u80a4\u007e\u0020\u0020\u3010\u4ed9\u4e16\u5f55\uff08\u52a8\u6001\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954596341891_former.gif',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561739?f=luniang2017'
	},
	{
		title:_stitle,
		/*分享一款漂亮的搜狗皮肤~ 【断袖皇上别碰我 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u5206\u4eab\u4e00\u6b3e\u6f02\u4eae\u7684\u641c\u72d7\u76ae\u80a4\u007e\u0020\u3010\u65ad\u8896\u7687\u4e0a\u522b\u78b0\u6211\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954541935660_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561717?f=luniang2017'
	},
	{
		title:_stitle,
		/*好喜欢这款皮肤，都来下载吧 【进化萌宠 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u597d\u559c\u6b22\u8fd9\u6b3e\u76ae\u80a4\uff0c\u90fd\u6765\u4e0b\u8f7d\u5427\u0020\u3010\u8fdb\u5316\u840c\u5ba0\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954544759496_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561719?f=luniang2017'
	},
	{
		title:_stitle,
		/*这款皮肤太给力了，推荐大家使用~O(∩_∩)O~ 【女生请止步 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u6b3e\u76ae\u80a4\u592a\u7ed9\u529b\u4e86\uff0c\u63a8\u8350\u5927\u5bb6\u4f7f\u7528\u007e\u004f\u0028\u2229\u005f\u2229\u0029\u004f\u007e\u0020\u3010\u5973\u751f\u8bf7\u6b62\u6b65\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954554007877_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561727?f=luniang2017'
	},
	{
		title:_stitle,
		/*这么精美的皮肤，不推不给力啊~【尸界 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u4e48\u7cbe\u7f8e\u7684\u76ae\u80a4\uff0c\u4e0d\u63a8\u4e0d\u7ed9\u529b\u554a\u007e\u3010\u5c38\u754c\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954592057723_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561733?f=luniang2017'
	},
	{
		title:_stitle,
		/*这么精美的皮肤，不推不给力啊~【我的食人女友 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u4e48\u7cbe\u7f8e\u7684\u76ae\u80a4\uff0c\u4e0d\u63a8\u4e0d\u7ed9\u529b\u554a\u007e\u3010\u6211\u7684\u98df\u4eba\u5973\u53cb\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954595354714_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561737?f=luniang2017'
	},
	{
		title:_stitle,
		/*这款皮肤太给力了，推荐大家使用~O(∩_∩)O~ 【妹力无穷 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u6b3e\u76ae\u80a4\u592a\u7ed9\u529b\u4e86\uff0c\u63a8\u8350\u5927\u5bb6\u4f7f\u7528\u007e\u004f\u0028\u2229\u005f\u2229\u0029\u004f\u007e\u0020\u3010\u59b9\u529b\u65e0\u7a77\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954549071600_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561725?f=luniang2017'
	},
	{
		title:_stitle,
		/*这款皮肤太给力了，推荐大家使用~O(∩_∩)O~ 【草莓狂战记 - 皮肤下载 - 搜狗拼音输入法】*/
		content:'\u8fd9\u6b3e\u76ae\u80a4\u592a\u7ed9\u529b\u4e86\uff0c\u63a8\u8350\u5927\u5bb6\u4f7f\u7528\u007e\u004f\u0028\u2229\u005f\u2229\u0029\u004f\u007e\u0020\u3010\u8349\u8393\u72c2\u6218\u8bb0\u0020\u002d\u0020\u76ae\u80a4\u4e0b\u8f7d\u0020\u002d\u0020\u641c\u72d7\u62fc\u97f3\u8f93\u5165\u6cd5\u3011',
		imgurl:'https://imedl.sogoucdn.com/cache/skins/uploadImage/2017/05/22/14954435615345_former.jpg',
		contenturl:'http://pinyin.sogou.com/skins/detail/view/info/561713?f=luniang2017'
	},
];
var hits_share_weibo = {
	title: '',
	/*#有一份儿童节礼物待领取# 啦啦啦~我刚刚抽中了一份儿童节礼物哟！每天共有12次抽奖机会，快来试试你能抽中什么吧！@搜狗输入法*/
    content: '\u0023\u6709\u4e00\u4efd\u513f\u7ae5\u8282\u793c\u7269\u5f85\u9886\u53d6\u0023 \u5566\u5566\u5566\u007e\u6211\u521a\u521a\u62bd\u4e2d\u4e86\u4e00\u4efd\u513f\u7ae5\u8282\u793c\u7269\u54df\uff01\u6bcf\u5929\u5171\u6709\u0031\u0032\u6b21\u62bd\u5956\u673a\u4f1a\uff0c\u5feb\u6765\u8bd5\u8bd5\u4f60\u80fd\u62bd\u4e2d\u4ec0\u4e48\u5427\uff01\u0040\u641c\u72d7\u8f93\u5165\u6cd5'
}
var hits_share_qzone = {
	/*有一份儿童节礼物待领取！*/
	title: '\u6709\u4e00\u4efd\u513f\u7ae5\u8282\u793c\u7269\u5f85\u9886\u53d6\uff01',
	/*啦啦啦~我刚刚抽中了一份儿童节礼物哟！每天共有12次抽奖机会，快来试试你能抽中什么吧！*/
    content: '\u5566\u5566\u5566\u007e\u6211\u521a\u521a\u62bd\u4e2d\u4e86\u4e00\u4efd\u513f\u7ae5\u8282\u793c\u7269\u54df\uff01\u6bcf\u5929\u5171\u6709\u0031\u0032\u6b21\u62bd\u5956\u673a\u4f1a\uff0c\u5feb\u6765\u8bd5\u8bd5\u4f60\u80fd\u62bd\u4e2d\u4ec0\u4e48\u5427\uff01'
}
function getInitInfo(call) {
	var call = typeof call == 'function' ? call : function(){};
	ajaxprocess({
		type: 'get',
		url: 'ajax/lotteryTimes.php',
		data: {},
		dataType: 'json',
		success: function(resp) {
			call(resp.data);
		},
		error: function() {
			console.log('exec getInitInfo() eror');
		},
		complete: function(){}
	});
}

function iScrollTo(anchor, timeout) {
	var anchor = anchor || 'download';
	var timeout = timeout || 1250;
	var offsetY = 0;
	switch(anchor) {
		case 'download':
			offsetY = $('.main-cont').offset().top-60;break;
		case 'lottery':
			offsetY = $('.lottery-cont').offset().top-80;break;
		default :
		offsetY = $('.main-cont').offset().top;
	}
	$('html, body').animate({scrollTop: offsetY}, timeout);
	$(document).mousedown(function(){$('html, body').stop()});
	try {
		document.addEventListener('DOMMouseScroll',function(){$('html, body').stop()},false);
	}catch(e){}
	try {
		document.onmousewheel = function(){$('html, body').stop()}
	}catch(e){}
}

function getPosByAwardType(atype) {
	var atype = atype || '0';
	var ords = [];
	$('.roller-wrap>.roller[atype="'+atype+'"]').each(function(){
		ords.push(parseInt($(this).attr('ord')));
	});
	var $size = $(ords).size();
	var rand = Math.floor(Math.random()*(($size-1)-0+1)+0);
	return ords[rand>=$size?($size-1):rand];
}

function showResult(award, hited, notryleft) {
	var award = award || {};
	var hited = hited || false;
	var notryleft = notryleft || false;
	
	$('.popbox-cover').css({
		width:Math.max($(window).width(),$(document).width())+'px',
		height:Math.max($(window).height(),$(document).height())+'px'
	}).unbind('click');
	
	if(hited) {
		$('.popbox-cover').bind('click', function(){
			$(this).hide();
			$('#hited.popbox-wrap, .popbox-cover').hide();
		}).show();
		$('#hited.popbox-wrap .popbox-close').unbind('click').bind('click', function(){
			$('#hited.popbox-wrap, .popbox-cover').hide();
		});
		var position = $('#hited.popbox-wrap').height()>$(window).height() ? 'absolute' : 'fixed';
		$('#hited.popbox-wrap').css({
			position: position,
			left: ($(window).width()-$('#hited.popbox-wrap').width())/2+'px',
			top: (position=='fixed'?0:$(document).scrollTop())+($(window).height()-$('#hited.popbox-wrap').height())/2+'px'
		}).show();
	} else if(notryleft) {
		$('.popbox-cover').bind('click', function(){
			$(this).hide();
			$('#no-tryleft.popbox-wrap, .popbox-cover').hide();
		}).show();
		$('#no-tryleft.popbox-wrap .popbox-close').unbind('click').bind('click', function(){
			$('#no-tryleft.popbox-wrap, .popbox-cover').hide();
		});
		var position = $('#no-tryleft.popbox-wrap').height()>$(window).height() ? 'absolute' : 'fixed';
		$('#no-tryleft.popbox-wrap').css({
			position: position,
			left: ($(window).width()-$('#no-tryleft.popbox-wrap').width())/2+'px',
			top: (position=='fixed'?0:$(document).scrollTop())+($(window).height()-$('#no-tryleft.popbox-wrap').height())/2+'px'
		}).show();
	} else if($.isEmptyObject(award)) {
		$('.popbox-cover').bind('click', function(){
			$('#not-hits.popbox-wrap, .popbox-cover').hide()
		}).show();
		$('#not-hits.popbox-wrap .popbox-close').unbind('click').bind('click', function(){
			$('#not-hits.popbox-wrap, .popbox-cover').hide();
		});
		$('#not-hits .popbox-btn.popbox-btn-tryagain').unbind('click').bind('click', function(){
			$('#not-hits.popbox-wrap, .popbox-cover').hide();
			iScrollTo('lottery');
		});
		var position = $('#not-hits.popbox-wrap').height()>$(window).height() ? 'absolute' : 'fixed';
		$('#not-hits.popbox-wrap').css({
			position: position,
			left: ($(window).width()-$('#not-hits.popbox-wrap').width())/2+'px',
			top: (position=='fixed'?0:$(document).scrollTop())+($(window).height()-$('#not-hits.popbox-wrap').height())/2+'px'
		}).show();
	} else {/*hits*/
		$(window).bind('beforeunload',function(){return '\u5c1a\u672a\u63d0\u4ea4\u9886\u5956\u4fe1\u606f'});/*尚未提交领奖信息*/
		$('#hits .popbox-title').html('<div>\u606d\u559c\u62bd\u4e2d'+award.prize_name+'</div>');/*恭喜抽中*/
		$('#hits.popbox-wrap .popbox-close').unbind('click').bind('click', function(){
			if(window.confirm('\u5c1a\u672a\u63d0\u4ea4\u9886\u5956\u4fe1\u606f\uff0c\u786e\u8ba4\u8981\u5173\u95ed\u5417\uff1f')) {/*尚未提交领奖信息，确认要关闭吗？*/
				$('#hits.popbox-wrap, .popbox-cover').hide();
			}
		});
		$('#hits .popbox-btn.popbox-btn-tryagain').unbind('click').bind('click', function(){
			if(window.confirm('\u5c1a\u672a\u63d0\u4ea4\u9886\u5956\u4fe1\u606f\uff0c\u786e\u8ba4\u8981\u5173\u95ed\u5417\uff1f')) {/*尚未提交领奖信息，确认要关闭吗？*/
				$('#hits.popbox-wrap, .popbox-cover').hide();
				iScrollTo('lottery');
			}
		});
		$('.popbox-cover').show();
		var position = $('#hits.popbox-wrap').height()+180>$(window).height() ? 'absolute' : 'fixed';
		$('#hits.popbox-wrap').css({
			position: position,
			left: ($(window).width()-$('#hits.popbox-wrap').width())/2+'px',
			top: (position=='fixed'?0:$(document).scrollTop())+($(window).height()-$('#hits.popbox-wrap').height()+180)/2+'px'
		}).show();
	}
}

function lottery(before, after) {
	var before = typeof before == 'function' ? before : function(){};
	var after = typeof after == 'function' ? after : function(){};
	if(user.status == 1) {
		showResult({prize_name:user.prize_name}, false, false);
		return;
	} else if(user.status == 2) {
		showResult({}, true, false);
		return;
	}
	if(roller.rolling) {
		return;
	}
	if($('#lottery-btn').attr('ajaxing')) {
		return;
	}
	$('#lottery-btn').attr('ajaxing', true);
	try{MtaH5.clickStat('3')}catch(e){}
	ajaxprocess({
		type: 'post',
		url: 'ajax/lottery.php',
		data: {},
		dataType: 'json',
		success: function(resp) {
			console.log(resp);
			if(resp.errno == 2) {/*hited*/
				showResult({}, true, false);
			} else if(resp.errno == 4 || resp.errno == 3) {/*no-tryleft*/
				showResult({}, false, true);
				$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a0\u6b21');
			} else {/*none*/
				var hitpos;
				if(resp.errno == 1) {/*hits*/
					hitpos = getPosByAwardType(resp.data.prize_type)-1;
				} else {
					hitpos = getPosByAwardType('0')-1;
				}
				$('.lottert-btn .lottert-btn-inner').removeClass('ani');
				roller.run({
					cycle: 1+Math.floor(Math.random()*(2-1+1)+1),/*Math.floor(Math.random()*(max-min+1)+min)*/
					hitpos: hitpos,
					callback: function() {
						$('.lottert-btn .lottert-btn-inner').addClass('ani');
						if(resp.errno == 1) {
							showResult({prize_type:resp.data.prize_type,prize_name:resp.data.prize_name}, false, false);
						} else {
							showResult({}, false, false);
						}
						if(resp.errno == 1) {
							user.status = 1;
							user.prize_name = resp.data.prize_name;
							$('.tryleft-info').html('\u60a8\u5df2\u4e2d\u5956\u3002');/*您已中奖。*/
							dataForShareTmp = $.extend(dataForShareTmp, hits_share_weibo);
							dataForQzoneShareTmp = $.extend(dataForQzoneShareTmp, hits_share_qzone);
						} else {
							$('.tryleft-info').html('\u5269\u4f59\u6b21\u6570\uff1a'+resp.data.residue_times+'\u6b21');
						}
					}
				});
			}
		},
		error: function() {
			try{MtaH5.clickStat('4')}catch(e){}
			console.log('lottery ajax error');
			var hitpos = getPosByAwardType('0')-1;
			roller.run({
				cycle: 1+Math.floor(Math.random()*(2-1+1)+1),
				hitpos: hitpos,
				callback: function() {showResult({}, false, false)}
			});
		},
		complete: function(){
			$('#lottery-btn').removeAttr('ajaxing');
		}
	});
}
function unbindGetCounter() {
	try{clearTimeout(ajaxPollTimer)}catch(e){}
}
var lastid = 0;
function bindGetCounter() {
	var ajaxpoll = function() {
		if(!$('#name-list').attr('name-list')) {
			$('#name-list').attr('ajaxing', true);
			ajaxprocess({
				type: 'post',
				url: 'ajax/genRewardInfo.php',
				data: 'dosubmit=true&offset='+lastid,
				dataType: 'json',
				success: function(resp) {
					if(resp.errno == 0) {
						var appendhtml = [];
						$(resp.data).each(function(){
							lastid = this.id;
							appendhtml.push('<div class="swiper-slide cutstr">'+this.user_name+'&nbsp;&nbsp;'+this.user_phone+'&nbsp;&nbsp;恭喜获得'+this.prize_name+'</div>');
						});
						if(!swiper) {
							$('.name-ul').children().remove();
							swiper = new Swiper('.swiper-container', {
								direction: 'vertical',
								loop: false,
								slidesPerView: 5,
								paginationClickable: true,
								spaceBetween: 0,
								centeredSlides: false,
								autoplay: 1500,
								autoplayDisableOnInteraction: false
							});
						}
						swiper.appendSlide(appendhtml);
					}
				},
				error: function() {
					console.log('ajaxPoll error');
				},
				complete: function() {
					$('#name-list').removeAttr('ajaxing');
					ajaxPollTimer = setTimeout(ajaxpoll, retrytime);
				}
			});	
		}
	}
	if(ajaxPollTimer === null) {
		ajaxpoll();
	}
}