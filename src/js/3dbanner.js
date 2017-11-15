function Banner(dom,imgs){
   this.dom = dom;
   this.imgArr = imgs;
   this.len = this.imgArr.length;
   this.stage =null;
   this.box = null;
   this.img = null;
   this.init();
   console.log(2)
}
Banner.prototype = {
	init:function(){
		this.createHtml();
		this.loadStyle("css/3dbanner.css");
	},
	createHtml:function(){
		this.stage = document.createElement('div');
		this.stage.className ="stage";
		this.box = document.createElement('div')
		this.box.className = "box";
		for(var i = 0; i<this.len;i++){
			this.show = document.createElement('div')
			this.show.className="show show"+(i+1);
			this.img = document.createElement('img')
			this.img.src = this.imgArr[i];
			this.show.appendChild(this.img);
			this.box.appendChild(this.show);
		}
		this.stage.appendChild(this.box);
		this.dom.appendChild(this.stage);
	},
	loadStyle:function(code){
		var css=null;
		if(code.indexOf('.css')!=-1){
			css=document.createElement('link');
			css.type="text/css";
			css.rel="stylesheet";
			css.href=code;
			if(navigator.appName === "Microsoft Internet Explorer" ){
				var box = document.querySelector(".box");
				box.style.perspective = "500px";
			}

		}else{
			css=document.createElement('style')
			css.type="text/css"
			try{
				css.appendChild(document.createTextNode(code));
			}catch(ex){
				css.stylesheet.text=code;
			}
		}
		var head=document.getElementsByTagName('head')[0];
		head.appendChild(css);
	}
}