var dataForShare = {
    title: '',
    content: '#有一份儿童节礼物待领取# 搜哥携手鹿娘@网易漫画 送儿童节礼物喽~十二款热门漫画皮肤已经在@搜狗输入法 平台上线啦！换肤就可抽奖赢取精美周边好礼哟！',
    imgurl: 'http://shouji.sogou.com/sapp/luniang2017/static/i/sharepic.jpg',
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=weibo'
}
var dataForWeixinShare = {
    title: '有一份儿童节礼物待领取！',
    content: '搜哥携手鹿娘送儿童节礼物喽~十二款热门漫画皮肤已经在搜狗输入法平台上线啦！换肤就可抽奖赢取精美周边好礼哟！',
    imgurl: 'http://shouji.sogou.com/sapp/luniang2017/static/i/sharepic.jpg',
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=wechat'
}
var dataForQzoneShare = {
    title: dataForWeixinShare.title,
    content: dataForWeixinShare.content,
    imgurl: dataForWeixinShare.imgurl,
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=qzone'
}
var dataForAppShare = {
	title: dataForWeixinShare.title,
    content: dataForWeixinShare.content,
    imgurl: dataForWeixinShare.imgurl,
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/index.html?f=appshare'
}
var dataForShareTmp = {};
var dataForWeixinShareTmp = {};
var dataForQzoneShareTmp = {};
var dataForAppShareTmp = {};

function show_share() {
    try{MtaH5.clickStat('19')}catch(e){}
    if(isWeiXin()) {
		show_weixin_share();
		return;
	}
    if (typeof window['SogouHotwordsUtils'] != 'undefined' && SogouHotwordsUtils.shareToApp) {
        SogouHotwordsUtils.shareToApp(
            dataForAppShareTmp.title,
            dataForAppShareTmp.content,
            dataForAppShareTmp.contenturl,
            dataForAppShareTmp.imgurl
        );
        return true;
    }
	var hide = function() {
		$('#menu-share,#share-cover').hide();
	}
	$('#share-cover').css({
		width: '100%',
		height: Math.max($(window).height(), $(document).height())+'px'
	}).show();
	$('#menu-share').css({
		position: $(window).height()>=$('#menu-share').height()?'fixed':'absolute',
		left: ($(window).width()-$('#menu-share').width())/2+'px',
		top: ($(window).height()-$('#menu-share').height())/2+'px',
	}).show();
	$('#share-close').unbind('click').click(function(){hide()});
}
var WXTIP_ST = null;
function show_weixin_share() {
    $('.mask_share').show();
	$('.mask_share').unbind('click').bind('click',function(){
		$('.mask_share').hide();
	});
    try{MtaH5.clickStat('37')/*分享微信按钮*/}catch(e){}
}
function share_weibo() {
    try{MtaH5.clickStat('20')/*分享微博按钮*/}catch(e){}
    /*分享微博按钮*/
    var _t = dataForShareTmp.content + ' ' + dataForShareTmp.contenturl;
    window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(_t) + '&pic=' + encodeURIComponent(dataForShareTmp.imgurl) + '&source=bookmark', '_blank', 'width=450,height=400');
}
function share_qzone() {
    try{MtaH5.clickStat('21')/*分享空间按钮*/}catch(e){}
    /*分享空间按钮*/
    var p = {
        url: dataForQzoneShareTmp.contenturl,
        showcount: '0', /*是否显示分享总数,显示：'1'，不显示：'0' */
        desc: '', /*默认分享理由(可选)*/
        summary: dataForQzoneShareTmp.content, /*分享摘要(可选)*/
        title: dataForQzoneShareTmp.title, /*分享标题(可选)*/
        site: '\u641c\u72d7\u8f93\u5165\u6cd5', /*分享来源 如：腾讯网(可选)*/
        pics: dataForQzoneShareTmp.imgurl, /*分享图片的路径(可选)*/
        style: '203',
        width: 22,
        height: 22
    };
    var s = [];
    for (var i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
    }
    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&'), '_blank', 'width=450,height=400');
}
var bindShared = false;
function bindShare(dataForShare) {
	var title = dataForShare.title;
	var desc = dataForShare.content;
	var link = dataForShare.contenturl;
	var imgUrl = dataForShare.imgurl;
	wx.onMenuShareTimeline({
		title: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('22')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('23')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('24')}catch(e){}
		}
	});
	wx.onMenuShareAppMessage({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('25')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('26')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('27')}catch(e){}
		}
	});
	wx.onMenuShareQQ({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('28')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('29')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('30')}catch(e){}
		}
	});
	wx.onMenuShareWeibo({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('31')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('32')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('33')}catch(e){}
		}
	});
	wx.onMenuShareQZone({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) { 
			try{MtaH5.clickStat('34')}catch(e){}
		},
		cancel: function (res) { 
			try{MtaH5.clickStat('35')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('36')}catch(e){}
		}
	});
}

$(function () {
	dataForShareTmp = $.extend(dataForShareTmp, dataForShare);
    dataForWeixinShareTmp = $.extend(dataForWeixinShareTmp, dataForWeixinShare);
    dataForQzoneShareTmp = $.extend(dataForQzoneShareTmp, dataForQzoneShare);
	dataForAppShareTmp = $.extend(dataForAppShareTmp, dataForAppShare);
    if (isWeiXin()) {
        appendscript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', '', function () {
            appendscript('http://shouji.sogou.com/api/weixin/jssdk/wxconfig.php?rurl=' + encodeURIComponent(document.location.href), '', function () {
                var wxconfig = window['wxconfig'] || '';
                if (wxconfig) {
                    wx.config({
                        appId: wxconfig.appId,
                        timestamp: wxconfig.timestamp,
                        nonceStr: wxconfig.nonceStr,
                        signature: wxconfig.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone'
                        ]
                    });
                    wx.ready(function () {
                        bindShare(dataForWeixinShareTmp);
						bindShared = true;
                    });
                }
            });
        });
    }
});