'use strict';
var roller;
$(function(){
	$(document).on(touchSupport()?'touchstart':'mousedown', '*[clickbtn="true"]', function(){
		$(this).addClass('clickbtn');
	}).on(touchSupport()?'touchend':'mouseup', '*[clickbtn="true"]', function(){
		$(this).removeClass('clickbtn');
	});
	$('.share-qzone').click(function(){
		var idx = $('.share-qzone').index(this);
	});
	$('.share-weibo').click(function(){
		var idx = $('.share-weibo').index(this);
	});
	roller = new iRoller({
		cycle: 2,
		speed: 150,
		speedEnd: 150,
		speedType: 'easing-in',
		rollerClass: 'roller',
		activeClass: 'active',
		count: 10
	});
	$('.anchor-download').click(function(){iScrollTo('download')});
	$('.anchor-lottery').click(function(){iScrollTo('lottery')});
	$('#lottery-btn').click(function(){lottery()});
	$('.name-list').slide({mainCell:'.name-list-inner ul',autoPlay:true,effect:'topMarquee',vis:5,interTime:50,opp:false,pnLoop:true,trigger:'click',mouseOverStop:true});
	
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
				alert('没有填写姓名');
				return false;
			}
			
			if($(form).find('input[name="telnumber"]').size() > 0) {
                telnumber = $.trim($(form).find('input[name="telnumber"]').val());
            } else {
				telnumber = '';
			}
			if(telnumber.length < 1) {
				alert('没有填写电话');
				return;
			} else if(!/^\+?[\d\-]{11,13}$/i.test(telnumber)) {
				alert('电话格式不正确(应由11~13位数字组成)');
				return;
			}
			
			if($(form).find('input[name="email"]').size() > 0) {
                email = $.trim($(form).find('input[name="email"]').val());
            } else {
				email = '';
			}
			if(email.length < 1) {
				alert('没有填写邮箱');
				return;
			} else if(!isemail(email)) {
				alert('邮箱格式不正确');
				return;
			}
			
            if($(form).find('input[name="addr"]').size() > 0) {
                addr = $.trim($(form).find('input[name="addr"]').val());
            } else {
				addr = '';
			}
			if(addr.length < 1) {
				alert('没有填写地址');
				return false;
			}
        },
        success: function (resp) {
            if (typeof resp != 'object') {
                try {
                    resp = JSON.parse(resp);
                } catch (e) {
					alert('响应失败');
                    return;
                }
            }
			resp.errno = parseInt(resp.errno);
            if(resp.errno == 0) {//save success
				alert(resp.errmsg);
				/*是否需要关闭form表单*/
                return;
            }
			alert(resp.errmsg);
        },
        error: function () {
            alert('响应失败');
            return;
        },
        complete: function (XMLHttpRequest, status) {
            if(status == 'timeout') {
				alert('请求超时');
				return;
            }
        }
    });
});

function iScrollTo(anchor, timeout) {
	var anchor = anchor || 'download';
	var timeout = timeout || 1250;
	var offsetY = 0;
	switch(anchor) {
		case 'download':
			offsetY = $('.main-cont').offset().top;break;
		case 'lottery':
			offsetY = $('.lottery-cont').offset().top;break;
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

function lottery(before, after) {
	var before = typeof before == 'function' ? before : function(){};
	var after = typeof after == 'function' ? after : function(){};
	if(roller.rolling) {
		return;
	}
	if(('#lottery-btn').attr('ajaxing')) {
		return;
	}
	roller.runforever();
	ajaxprocess({
		type: 'post',
		url: 'ajax/lottery.php',
		data: {},
		dataType: 'json',
		success: function(resp) {
			showAlert(resp.message);
			if(resp.status==1) {
				setTimeout(function(){window.location.reload()},1250);
			}
		},
		error: function() {
			showAlert('请求失败[ajax error]');
		},
		complete: function(){}
	});
	roller.run({cycle:2 + Math.floor(Math.random()*(2-1+1)+1)});
}