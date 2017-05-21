var dataForShare = {
    title: '¹�������ƴ�Ԫ��',
    content: '¹�������ƴ�Ԫ��~',
    imgurl: 'http://shouji.sogou.com/sapp/luniang2017/static/i/sharepic.jpg',
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=weibo'
}
var dataForWeixinShare = {
    title: '¹�������ƴ�Ԫ��',
    content: '¹�������ƴ�Ԫ��~',
    imgurl: 'http://shouji.sogou.com/sapp/luniang2017/static/i/sharepic.jpg',
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=wechat'
}
var dataForQzoneShare = {
    title: dataForShare.title,
    content: dataForShare.content,
    imgurl: dataForShare.imgurl,
    contenturl: 'http://shouji.sogou.com/sapp/luniang2017/?f=qzone'
}
var dataForAppShare = {
	title: dataForShare.title,
    content: dataForShare.content,
    imgurl: dataForShare.imgurl,
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
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	var eleId = 'dialog_weixin';
	var bgId = eleId+'_cover';
	
	var show = function() {
		$('#'+eleId).remove();
		$('#'+bgId).remove();
		$('body').append('<div id="'+bgId+'" class="menu_cover share_menu_cover"></div>');
		$('body').append('<div id="'+eleId+'" class="dialog_weixin"></div>');
		$('#'+eleId).unbind(touchSupport()?'touchend':'click').bind(touchSupport()?'touchend':'click',function(){hide()}).show();
		$('#'+bgId).unbind(touchSupport()?'touchend':'click').bind(touchSupport()?'touchend':'click',function(){hide()});
		try{clearTimeout(WXTIP_ST)}catch(e){}
		//WXTIP_ST = setTimeout(function(){hide()}, 3000);
		$('#'+bgId).css({
			width:'100%',
			height:Math.max(winHeight, $(document).height())+'px',
			zIndex:998
		});
	}
	var hide = function() {
		try{clearTimeout(WXTIP_ST)}catch(e){}
		$('#'+eleId).unbind(touchSupport()?'touchend':'click').hide().remove();
		$('#'+bgId).unbind(touchSupport()?'touchend':'click').remove();
	}
	show();
	try{MtaH5.clickStat('37')/*����΢�Ű�ť*/}catch(e){}
}
function share_weibo() {
    try{MtaH5.clickStat('20')/*����΢����ť*/}catch(e){}
    /*����΢����ť*/
    var _t = dataForShareTmp.content + ' ' + dataForShareTmp.contenturl;
    window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(_t) + '&pic=' + encodeURIComponent(dataForShareTmp.imgurl) + '&source=bookmark', '_blank', 'width=450,height=400');
}
function share_qzone() {
    try{MtaH5.clickStat('21')/*����ռ䰴ť*/}catch(e){}
    /*����ռ䰴ť*/
    var p = {
        url: dataForQzoneShareTmp.contenturl,
        showcount: '0', /*�Ƿ���ʾ��������,��ʾ��'1'������ʾ��'0' */
        desc: '', /*Ĭ�Ϸ�������(��ѡ)*/
        summary: dataForQzoneShareTmp.content, /*����ժҪ(��ѡ)*/
        title: dataForQzoneShareTmp.title, /*�������(��ѡ)*/
        site: '\u641c\u72d7\u8f93\u5165\u6cd5', /*������Դ �磺��Ѷ��(��ѡ)*/
        pics: dataForQzoneShareTmp.imgurl, /*����ͼƬ��·��(��ѡ)*/
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