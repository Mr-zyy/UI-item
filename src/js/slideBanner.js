function Slide(dBox,imgs,type){
	this.stage = dBox;
	this.imgs = imgs;
	this.type=type;
	this.box = null;
	this.img = null;
	this.len = 0;
	this.index = 0;
	this.timer=null;
	this.imgBox = null;
	this.spot = null;
	this.spots = null;
	this.sum = 2;
	this.width = parseFloat(this.getStyle(this.stage,'width'));
	this.init();
}	
Slide.prototype={
	constructor:Slide,
	init:function(){
		this.pointer = this;
		this.createImg()
		if(this.type=='position'){
			this.change(this.changePosition.bind(this));
			var _this=this;
			window.onfocus = function(){
				console.log('focus');
				_this.change(_this.changePosition.bind(_this));
			}
			window.onblur = function(){
				_this.stopAnimate();
			}
		}else if(this.type=='opacity'){
			var _this=this;
			_this.change(_this.changeOpacity.bind(_this));
			window.onfocus = function(){
				_this.change(_this.changeOpacity.bind(_this));
			}
			window.onblur = function(){
				_this.stopAnimate();
			}
		}else{
			alert('请选择类型为opacity或position');
		}
		this.mouseover();
		this.mouseout();
	},
	createImg:function(){
		var frag = document.createDocumentFragment();
		this.len=this.imgs.length;
		this.index = this.len-1;
		this.spotIndex=this.len-1;
		for(var i = 0;i<this.len;i++){
			this.box = document.createElement('div')
			this.box.className='imgBox'
			this.box.style="width:inherit;height:inherit;position:absolute;left:0;top:0;"
			this.box.style.cssText="width:inherit;height:inherit;position:absolute;left:0;top:0;"
			this.img = document.createElement('img')
			this.img.src=imgs[i];
			this.img.style="width:inherit;height:inherit;"
			this.img.style.cssText="width:inherit;height:inherit;"
			this.box.appendChild(this.img);
			this.spot = document.createElement('div');
			this.spot.style = "width:10px;height:10px;border:1px solid #fff;border-radius:50%;z-index:9999;position:absolute;top:85%;left:"+(this.width*0.55+i*(-30))+"px";
			this.spot.style.cssText = "width:10px;height:10px;border:1px solid #fff;border-radius:50%;z-index:9999;position:absolute;top:85%;left:"+(this.width*0.55+i*(-30))+"px";
			this.spot.className = "spot";
			frag.appendChild(this.spot);
			frag.appendChild(this.box)
		}
		this.stage.appendChild(frag);
	},
	change:function(fn){
		this.imgBox = document.querySelectorAll('.imgBox');
		this.spots = document.querySelectorAll(".spot");
		this.timer=setInterval(fn,3000);
	},
	changePosition:function(){
			var _this = this;
			var prev =(this.index+1===this.len)?0:(this.index===this.len)?1:(this.index+1);
			var now =this.index===this.len?0:this.index;

			_this.animate(_this.imgBox[_this.index-1],{
				mul:{
					left:-(_this.width)
				}
				},function(){	
					_this.imgBox[_this.index-1].style.zIndex=_this.sum;
					_this.spots[prev].className="spot";
					_this.spots[now].className="spot red";
					_this.sum++;
					_this.animate(_this.imgBox[_this.index-1],{
						mul:{
							left:0
						}	
					})

				_this.index--;
				if(_this.index===0){
					_this.index=_this.len;
				}
				
			})

	},
	changeOpacity:function(){
		var _this=this;
			_this.animate(_this.imgBox[_this.index],{
				mul:{
					opacity:0
				}
			})
			if(_this.index===0){
				_this.index=_this.len-1;
			}else{
				_this.index--;
			}
			_this.animate(_this.imgBox[_this.index],{
				mul:{
					opacity:100
				}
			})
	},
	stopAnimate:function(){
		clearInterval(this.timer)
	},
	mouseover:function(){
		var _this = this;
		this.stage.onmouseover = function(){
			_this.stopAnimate();
		}
	},
	mouseout:function(){
		var _this = this;
		this.stage.onmouseout = function(){
			if(_this.type=='position'){
				_this.change(_this.changePosition.bind(_this));
			}else if(_this.type=='opacity'){
				_this.change(_this.changeOpacity.bind(_this));
			}
		}
	},
	getStyle:function(element,attr){
		var value;
		if (typeof window.getComputedStyle != 'undefined') {//W3C
			value = window.getComputedStyle(element, null)[attr];
		} else if (typeof element.currentStyle != 'undeinfed') {//IE
			value = element.currentStyle[attr];
		}
		return value;
	},
	animate:function(dom,obj,fn) {
		var _this=this;
		var element=dom;
		var attr =obj['attr'] != undefined ? obj['attr'] : 'left';

		
		var start = obj['start'] != undefined ? obj['start'] : 
						attr == 'opacity' ? parseFloat(_this.getStyle(element, attr)) * 100 : 
												   parseInt(_this.getStyle(element, attr));
		
		var t = obj['t'] != undefined ? obj['t'] : 10;												//可选，默认10毫秒执行一次
		var step = obj['step'] != undefined ? obj['step'] : 20;								//可选，每次运行10像素
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;							//可选，默认缓冲速度为6
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';		//可选，0表示匀速，1表示缓冲，默认缓冲


		var alter = obj['alter'];
		var target = obj['target'];
		var mul = obj['mul'];
		
		
		
		
		if (alter != undefined && target == undefined) {
			target = alter + start;
		} else if (alter == undefined && target == undefined && mul == undefined) {
			throw new Error('alter增量或target目标量必须传一个！');
		}
		
		
		
		if (start > target) step = -step;

		//先为元素设置透明度之后再操作透明度变化
		if (attr == 'opacity') {
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
		}
		
		
		if (mul == undefined) {
			mul = {};
			mul[attr] = target;
		} 
		

		clearInterval(timer);
		var timer = setInterval(function () {
		
			/*
				问题1：多个动画执行了多个列队动画，我们要求不管多少个动画只执行一个列队动画
				问题2：多个动画数值差别太大，导致动画无法执行到目标值，原因是定时器提前清理掉了
				
				解决1：不管多少个动画，只提供一次列队动画的机会
				解决2：多个动画按最后一个分动画执行完毕后再清理即可
			*/
			
			//创建一个布尔值，这个值可以了解多个动画是否全部执行完毕
			var flag = true; //表示都执行完毕了
			
			
			for (var j in mul) {
				attr = j != undefined ? j : 'left';
				target = mul[j];
					

				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - parseFloat(_this.getStyle(element, attr)) * 100) / speed :
														 (target - parseInt(_this.getStyle(element, attr))) / speed;
					//取整，因为浏览器会自动舍弃属性值的小数部分									 
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}
				
				
				
				if (attr == 'opacity') {
					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(parseFloat(_this.getStyle(element, attr)) * 100 - target) <= step) {
						setOpacity();
					} else if (step < 0 && (parseFloat(_this.getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
						setOpacity();
					} else {
						var temp = parseFloat(_this.getStyle(element, attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
					}
					
					if (parseInt(target) != parseInt(parseFloat(_this.getStyle(element, attr)) * 100)) flag = false;

				} else {
					if (step == 0) {
						setTarget();
					} else if (step > 0 && Math.abs(parseInt(_this.getStyle(element, attr)) - target) <= step) {
						setTarget();
					} else if (step < 0 && (parseInt(_this.getStyle(element, attr)) - target) <= Math.abs(step)) {
						setTarget();
					} else {
						element.style[attr] = parseInt(_this.getStyle(element, attr)) + step + 'px';
					}
					
					if (parseInt(target) != parseInt(_this.getStyle(element, attr))) flag = false;
				}
				
				//document.getElementById('test').innerHTML += i + '--' + parseInt(target) + '--' + parseInt(getStyle(element, attr)) + '--' + flag + '<br />';
				
			}
			
			if (flag) {
				clearInterval(timer);
				if (fn != undefined) fn();
			}
				
		}, t);
		
		function setTarget() {
			element.style[attr] = target + 'px';
		}
		
		function setOpacity() {
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
		}
		
	}

}