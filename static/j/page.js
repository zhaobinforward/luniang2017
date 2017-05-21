'use strict';
/* roller */
function iRoller(options) {
	this.defaults = {
		inipos: -1,/*��ʼ����λ��,��0��ʼ*/
		count: 8,
		speed: 200,/*��ʼת���ٶ�*/
		speedEnd: 300,/*����ת���ٶ�*/
		speedType: 'linear',/*�ٶ�����, linear:����,easing-in:�ȼ��ٺ����*/
		hitpos: 0,/*����λ��,��0��ʼ*/
		cycle: 10,/*����ѭ������*/
		rollerClass: 'roller',
		activeClass: 'active',
		direction: 0,/*0˳ʱ��,1��ʱ��*/
		callback: function(){}/*�ص�����*/
	};
	this.options = $.extend(this.defaults, options || {}),/* initial params */
	this.$rollers,
	this.timer,
	this.current;/*��ǰָ��,��1��ʼ*/
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
					if(cycle < _self.options.cycle/2) {/*�ȼ���*/
						speed -= 20;
					} else if(cycle <= _self.options.cycle) {/*�����*/
						speed += 20;
					}
				}
				if(speed < 40) {/*�޶�����ٶ�*/
					speed = 40;
				}
				if(cycle > _self.options.cycle) {/*��������ѭ�����������*/
					speed += 20;
				}
				_self.options.direction ? _self.current-- : _self.current++;/*ת������*/
				if(_self.current > _self.options.count) {
					_self.current = 1;
				} else if(_self.current < 1){
					_self.current = _self.options.count;
				}
				/*ֹͣ������*/
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
		_self.rolling = !0;/*���Ϊ������*/
		roll();
	}
}