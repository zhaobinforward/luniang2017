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
	getInitInfo(function(data){$('.tryleft-info').html('剩余次数：'+data.residue_times+'次')});
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
	if(hited) {
		$('.popbox-cover').css({
			width:Math.max($(window).width(),$(document).width())+'px',
			height:Math.max($(window).height(),$(document).height())+'px'
		}).unbind('click').bind('click', function(){
			$(this).unbind('click').hide();
			$('#hited.popbox-wrap, .popbox-cover').hide()
		});
		$('#hited.popbox-wrap, .popbox-cover').show();
	} else if(notryleft) {
		$('.popbox-cover').css({
			width:Math.max($(window).width(),$(document).width())+'px',
			height:Math.max($(window).height(),$(document).height())+'px'
		}).unbind('click').bind('click', function(){
			$(this).unbind('click').hide();
			$('#no-tryleft.popbox-wrap, .popbox-cover').hide()
		});
		$('#no-tryleft.popbox-wrap, .popbox-cover').show();
	} else if($.isEmptyObject(award)) {
		$('.popbox-cover').css({
			width:Math.max($(window).width(),$(document).width())+'px',
			height:Math.max($(window).height(),$(document).height())+'px'
		}).unbind('click').bind('click', function(){
			$(this).unbind('click').hide();
			$('#not-hits.popbox-wrap, .popbox-cover').hide()
		});
		$('#not-hits.popbox-wrap, .popbox-cover').show();
	} else {/*hits*/
		$('.popbox-cover').css({
			width:Math.max($(window).width(),$(document).width())+'px',
			height:Math.max($(window).height(),$(document).height())+'px'
		}).unbind('click');
		$('.popbox-btn.popbox-btn-tryagain').unbind('click').bind('click', function(){
			$('#hits.popbox-wrap, .popbox-cover').hide();
		});
		$('#hits.popbox-wrap, .popbox-cover').show();
	}
}

function lottery(before, after) {
	var before = typeof before == 'function' ? before : function(){};
	var after = typeof after == 'function' ? after : function(){};
	if(roller.rolling) {
		return;
	}
	if($('#lottery-btn').attr('ajaxing')) {
		return;
	}
	$('#lottery-btn').attr('ajaxing', true);
	ajaxprocess({
		type: 'post',
		url: 'ajax/lottery.php',
		data: {},
		dataType: 'json',
		success: function(resp) {
			console.log(resp);
			if(resp.errno == 2) {/*hited*/
				showResult({}, true, false);
			} else if(resp.errno == 4) {/*no-tryleft*/
				showResult({}, false, true);
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
						$('.tryleft-info').html('剩余次数：'+resp.data.residue_times+'次');
					}
				});
			}
		},
		error: function() {
			console.log('lottery ajax error');
			var hitpos = getPosByAwardType('0')-1;
			roller.run({
				cycle: 1+Math.floor(Math.random()*(2-1+1)+1),
				hitpos: hitpos,
				callback: function() {
					
				}
			});
		},
		complete: function(){
			$('#lottery-btn').removeAttr('ajaxing');
		}
	});
}