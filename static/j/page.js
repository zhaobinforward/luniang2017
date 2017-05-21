'use strict';
/* roller */
function iRoller(options) {
	this.defaults = {
		inipos: -1,/*初始索引位置,从0开始*/
		count: 8,
		speed: 200,/*初始转动速度*/
		speedEnd: 300,/*结束转动速度*/
		speedType: 'linear',/*速度类型, linear:匀速,easing-in:先加速后减速*/
		hitpos: 0,/*命中位置,从0开始*/
		cycle: 10,/*基础循环次数*/
		rollerClass: 'roller',
		activeClass: 'active',
		direction: 0,/*0顺时针,1逆时针*/
		callback: function(){}/*回调函数*/
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
	this.$rollers,
	this.timer,
	this.current;/*当前指针,从1开始*/
	this.rolling;
	this.paused;
	this.init();
}
iRoller.prototype = {
	init: function() {
		this.$rollers = $('.' + this.options.rollerClass);
		this.current = this.options.inipos < 0 || this.options.inipos > this.options.count - 1 ? 1 : this.options.inipos+1;
		this.rolling = !1;
		$(this.$rollers).removeClass(this.options.activeClass).filter('.'+this.options.rollerClass+'-'+this.options.inipos+1).addClass(this.options.activeClass);
	},
	run: function(options) {
		var _self = this;
		_self.options = $.extend(_self.options, options || {});/* initial params */
		var speed = _self.options.speed;
		var counter = 0;
		var cycle = 0;
		var roll = function() {
			counter++;
			cycle = parseInt(counter/_self.options.count);
			$(_self.$rollers).removeClass(_self.options.activeClass).filter('.'+_self.options.rollerClass+'-'+_self.current).addClass(_self.options.activeClass);
			_self.timer = setTimeout(function(){
				if(_self.options.speedType == 'linear') {
				} else {
					if(cycle < _self.options.cycle/2) {/*先加速*/
						speed -= 20;
					} else if(cycle <= _self.options.cycle) {/*后减速*/
						speed += 20;
					}
				}
				if(speed < 40) {/*限定最高速度*/
					speed = 40;
				}
				if(cycle > _self.options.cycle) {/*超过基础循环次数后减速*/
					speed += 20;
				}
				_self.options.direction ? _self.current-- : _self.current++;/*转动方向*/
				if(_self.current > _self.options.count) {
					_self.current = 1;
				} else if(_self.current < 1){
					_self.current = _self.options.count;
				}
				/*停止的条件*/
				if(speed > _self.options.speedEnd && _self.current == _self.options.hitpos+1) {
					try{clearTimeout(_self.timer)}catch(e){}
					_self.timer = null;
					_self.rolling = !1;
					$(_self.$rollers).removeClass(_self.options.activeClass).filter('.'+_self.options.rollerClass+'-'+_self.current).addClass(_self.options.activeClass);
					if(typeof _self.options.callback == 'function') {_self.options.callback()}
					return;
				}
				roll();
			}, speed);
		}
		if(_self.hitpos<1) {
			return false;
		}
		_self.rolling = !0;/*标记为进行中*/
		roll();
	}
}