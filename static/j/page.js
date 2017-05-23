'use strict';
var roller,ajaxPollTimer=null,retrytime=30000,swiper;
$(function(){
	$(document).on(touchSupport()?'touchstart':'mousedown', '*[clickbtn="true"]', function(){
		$(this).addClass('clickbtn');
	}).on(touchSupport()?'touchend':'mouseup', '*[clickbtn="true"]', function(){
		$(this).removeClass('clickbtn');
	});
	$('.s-download').click(function(){
		var idx = $('.s-download').index(this);
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
				$('.tryleft-info').html('剩余次数：'+resp.data.residue_times+'次');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.s-download').eq(idx).removeAttr('ajaxing')}
		});
	});
	$('.anchor-share-weibo').click(function(){
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
				$('.tryleft-info').html('剩余次数：'+resp.data.residue_times+'次');
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
				$('.tryleft-info').html('剩余次数：'+resp.data.residue_times+'次');
			},
			error: function() {console.log('updateLotteryTimes ajax error')},
			complete: function(){$('.anchor-share-qzone').removeAttr('ajaxing')}
		});
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
	
	bindGetCounter();
	
	swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		loop: true,
        slidesPerView: 5,
        paginationClickable: true,
        spaceBetween: 0,
		centeredSlides: false,
        autoplay: 1500,
        autoplayDisableOnInteraction: false
    });
	
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
				return false;
			} else if(!/^1[34578]{1}\d{9}$/i.test(telnumber)) {
				alert('无效的电话号码');
				return false;
			}
			
			if($(form).find('input[name="email"]').size() > 0) {
                email = $.trim($(form).find('input[name="email"]').val());
            } else {
				email = '';
			}
			if(email.length < 1) {
				alert('没有填写邮箱');
				return false;
			} else if(!isemail(email)) {
				alert('邮箱格式不正确');
				return false;
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
	
	$('.popbox-cover').css({
		width:Math.max($(window).width(),$(document).width())+'px',
		height:Math.max($(window).height(),$(document).height())+'px'
	}).unbind('click');
	
	if(hited) {
		$('.popbox-cover').bind('click', function(){
			$(this).hide();
			$('#hited.popbox-wrap, .popbox-cover').hide()
		}).show();
		var position = $('#hited.popbox-wrap').height()>$(window).height() ? 'absolute' : 'fixed';
		$('#hited.popbox-wrap').css({
			position: position,
			left: ($(window).width()-$('#hited.popbox-wrap').width())/2+'px',
			top: (position=='fixed'?0:$(document).scrollTop())+($(window).height()-$('#hited.popbox-wrap').height())/2+'px'
		}).show();
	} else if(notryleft) {
		$('.popbox-cover').bind('click', function(){
			$(this).hide();
			$('#no-tryleft.popbox-wrap, .popbox-cover').hide()
		}).show();
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
		$(window).bind('beforeunload',function(){return '尚未提交领奖信息'});
		$('#hits .popbox-title').html('恭喜抽中'+award.prize_name);
		$('#hits .popbox-btn.popbox-btn-tryagain').unbind('click').bind('click', function(){
			if(window.confirm('尚未提交领奖信息，确认要关闭吗？')) {
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
			} else if(resp.errno == 4 || resp.errno == 3) {/*no-tryleft*/
				showResult({}, false, true);
				$('.tryleft-info').html('剩余次数：0次');
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
					console.log(resp);
					if(resp.errno == 0) {
						var appendhtml = [];
						$(resp.data).each(function(){
							lastid = 0;
							appendhtml.push('<div class="swiper-slide">'+this.user_name+'&nbsp;&nbsp;'+this.user_phone+'&nbsp;&nbsp;恭喜获得'+this.prize_name+'</div>');
						});
						$('.name-ul').append(appendhtml);
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