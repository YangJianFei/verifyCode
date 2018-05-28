$(function(){	
	var varifyCode=false;
	var varifyType=1;
	var messageCode=1000;
	var group_slider=false;
	var group_num=false;
	
	//绑定登录注册切换点击事件
	$(".btn-head").on("click",function(){
		$(".btn-head").removeClass("btn-active");		
		$(".form").addClass("dn");
		$("."+$(this).addClass("btn-active").data("href")).removeClass("dn");
	});
	
	//验证方式点击事件
	$("body").on("click",".vSelectBody li",function(){
		var $this=$(this);
		$(".verItem").addClass("dn");
		$("."+$this.data("href")).removeClass("dn");
		varifyType=$this.attr("id");
	});
	
	//登录点击事件
	$(".btn-login").on("click",function(){
		var account=$(".login-account").val();
		var secret=$(".login-secret").val();
		var error=false;
		if(checkundefined(account)==""){
			$(".login-account").addClass("borderError");
			error=true;
		}
		if(checkundefined(secret)==""){
			$(".login-secret").addClass("borderError");
			error=true;
		}
		if(!varifyCode){
			$(".loginError").removeClass("dn").text("验证码错误");
			if(varifyType==3){//图片点选
				getRandomImg();
			}
//			if(group_num)
			error=true;
		}
		if(error){
			return false;
		}
		$.ajax({
			type:"post",
			url:"/verificationProject/verify.do",
			data:{
				"method":"login",
				"account":account,
				"secret":secret
			},
			dataType:"json",
			success:function(data){
				if(200==data.status){
					localStorage.setItem("login","true");
					localStorage.setItem("userId",data.result.id);
					localStorage.setItem("userName",data.result.realname||account);
					$(".loginRight").removeClass("dn").find(".loginTime").text("登录成功 5 秒后跳转至");
					var i=5;					
					var timer=setInterval(function(){
						i--;
						$(".loginTime").text("登录成功 "+i+" 秒后跳转至");
						if(i==0){
							clearInterval(timer);
							window.location.href="personal.html";
						}
					},1000);
				}else{
					localStorage.setItem("login","false");
					$(".loginError").removeClass("dn").text("账户或密码错误");
				}
			}
		});
	});
	
	//注册点击事件
	$(".btn-register").on("click",function(){
		var account=$(".register-account").val();
		var secret=$(".register-secret").val();
		var repeatSecret=$(".register-repeatSecret").val();
		var sex=$(".sex:checked").attr("id");
		var phone=$(".register-phone").val();
		var error=false;
		
		if(checkundefined(account)==""){
			$(".register-account").addClass("borderError").focus();
			error=true;
			$(".registerError").removeClass("dn").text("账户名不能为空");
		}
		if(account.length>15){
			$(".register-account").addClass("borderError").focus();
			error=true;
			$(".registerError").removeClass("dn").text("账户名称太长");
		}
		if(!lengthRange(secret, 6, 50)){
			$(".register-secret").addClass("borderError").focus();
			error=true;
			$(".registerError").removeClass("dn").text("密码最低为6为数");
		}
		if(secret!=repeatSecret){
			$(".register-secret").addClass("borderError").focus();
			$(".register-repeatSecret").addClass("borderError");
			error=true;
			$(".registerError").removeClass("dn").text("密码不一致");
		}
		if(!isMobile(phone)){
			$(".register-phone").addClass("borderError").focus();
			error=true;
			$(".registerError").removeClass("dn").text("手机号错误");
		}
		if(error){
			return false;
		}
		$.ajax({
			type:"post",
			url:"/verificationProject/verify.do",
			data:{
				"method":"register",
				"account":account,
				"secret":secret,
				"sex":sex,
				"contact":phone,
			},
			dataType:"json",
			success:function(data){
				if(200==data.status){
					alert("注册成功");
					$(".registerError").addClass("dn");
					$(".borderError").removeClass("borderError");
					$(".registerForm").find(".form-input").val("");
					$(".head-for-login").trigger("click");
				}else{
					alert("注册失败");
				}
			}
		});
	});
	
	//验证码点击
	$(".verifyNumCode").on("click",function(){
		refreshNumCode();
	});
	
	//刷新数字验证码
	function refreshNumCode(){
		varifyCode=false;
		$(".verifyNumCode").attr("src","/verificationProject/verify.do?method=getVerifyCode&t="+new Date().getTime());
	}
//	$.ajax({
//		url:"/verificationProject/verify.do",
//		data:{
//			"method":"getVerifyCode",
//		},
//		cache:false,
//		success:function(data){
//			$(".verifyNumCode").attr("src",data);
//		}
//	});
	
	//实时判断验证码
	$(".login-numCode").on("input propertychange",function(){
		$(".numIcon").addClass("dn");
		var code=$(this).val();
		if(code.length==4){
			$.ajax({
				url:"/verificationProject/verify.do",
				data:{
					"method":"validateVerify",
					"code":code.toLowerCase()
				},
				dataType:"json",
				success:function(data){
					if(200==data.status){
						varifyCode=true;
						group_num=true;
//						$(".btn-login").prop("disabled",false);
						$(".numIcon").attr("src","img/gou.svg").removeClass("dn");
					}else{
						varifyCode=false;
						group_num=false;
//						$(".btn-login").prop("disabled",true);						
						$(".numIcon").attr("src","img/cuowu.svg").removeClass("dn");
					}
				}
			});
		}
	});
	
	//输入框输入去掉红框
	$(".form-input").on("input propertychange",function(){
		$(this).removeClass("borderError");
	})
	
	//获取短信验证码
	$(".btn-getMessageCode").on("click",function(){
		var random=Math.random();
		messageCode=Math.round((random<0.1?0.1759:random)*10000);
		$(".messageCode").text(messageCode);
	});
	
	//实时判断验证码
	$(".messageInput").on("input propertychange",function(){
		$(".messageIcon").addClass("dn");
		var code=$(this).val();
		if(code.length==4){
			if(code==messageCode){
				varifyCode=true;
//				$(".btn-login").prop("disabled",false);
				$(".messageIcon").attr("src","img/gou.svg").removeClass("dn");
			}else{
				varifyCode=false;
//				$(".btn-login").prop("disabled",true);						
				$(".messageIcon").attr("src","img/cuowu.svg").removeClass("dn");
			}
		}
	});
	
	//点选图片点击事件
	$(".imgVerAll").on("click","li",function(){
		$(".imgVerAll").find("li").removeClass("imgVerSelect");
		$(this).addClass("imgVerSelect");
		if($(this).attr("id")==$(".imgVerAll").attr("right")){
			varifyCode=true;
		}else{
			varifyCode=false;
		}
	});
	
	//刷新点选图片验证码
	function getRandomImg(){
		$.ajax({
			url:"/verificationProject/verify.do",
			data:{
				"method":"getRandomImg",
			},
			dataType:"json",
			success:function(data){
				if(200==data.status){
					var lis=[];
					var rightItem=data.result.right;
					JSON.parse(data.result.all).forEach(function(item){
//						if(!item.id){
//							lis.push("<li id='",rightItem.id,"' style='background-image:url(img/verImg/",rightItem.file,")'><img class='imgSelect' src='img/gou.svg'></li>");
//						}else{
							lis.push("<li id='",item.id,"' style='background-image:url(img/verImg/",item.file,")'><img class='imgSelect' src='img/gou.svg'></li>");
//						}
					});
					$(".rightZhname").text(rightItem.zhname);
					$(".imgVerAll").html(lis.join("")).attr("right",rightItem.id);
				}
			}
		});
	}
	
	getRandomImg();
	
	//刷新点选验证码
	$(".refreshImgVer").on("click",function(){
		varifyCode=false;
		getRandomImg();
	});
	
	//滑块相关 js
	//滑块范围1px-239px 正确位置185px
	var moveStart;
	var verifySliderSuccess;
	var oldX=0,moveX=0,nowX=0;
	var randomTop,randomLeft;
	initSlider();
	$(".sliderRtImg").css("left",randomLeft).css("top",randomTop);
	$(".sliderSmImg").css("top",randomTop);
	
	$(".sliderHand").on("mousedown",function(e){
		var $this=$(this);
		$this.addClass("sliderHandDrag");
		console.log(e);
		moveStart=true;
		oldX=e.pageX;
	});
	$(".sliderHand").on("mousemove",function(e){
		if(moveStart && !verifySliderSuccess){//当鼠标按下移动时执行
			var $this=$(this);
			var sliderLeft=parseFloat($this.css("left"));
			var futureX;
//			console.log(e);
			nowX=e.pageX;
			moveX=nowX-oldX;//移动的距离
//			if(nowX>oldX){//向右移动
				futureX=sliderLeft+moveX;
				if(futureX>239){
					futureX=239;
				}
				if(futureX<1){
					futureX=1;
				}
//			}else{//向左移动
//				futureX=sliderLeft-moveX;
//				if(futureX>239){
//					futureX=239;
//				}
//				if(futureX<1){
//					futureX=1;
//				}
//			}
			//滑块移位
			$this.css("left",futureX);
			$(".sliderSmImg").css("left",futureX);
			oldX=nowX;
		}

	});
	$(".sliderHand").on("mouseup",function(e){
		moveStart=false;
		var $this=$(this);
		var left=parseFloat($this.css("left"));
		$this.removeClass("sliderHandDrag");
		if(left>=(randomLeft-7) && left<=(randomLeft+7)){//验证成功
			$(".sliderResult").text("验证成功").addClass("srr").removeClass("sre").removeClass("dn");
			verifySliderSuccess=true;
			//存储验证结果
			varifyCode=true;
			group_slider=true;
		}else{//验证失败
			verifySliderSuccess=false;
			//存储验证结果
			varifyCode=false;
			group_slider=false;
			$(".sliderResult").text("验证失败").removeClass("srr").addClass("sre").removeClass("dn");
			//滑块归位
			initSlider();
			$this.animate({"left":1},500);
			$(".sliderSmImg").animate({"left":1},500);
		}
	});
	
	$(".sliderRange").on("mouseover",function(){
		if(!verifySliderSuccess){
			$(".sliderBigImg").removeClass("dn");
		}
	}).on("mouseleave",function(){
		$(".sliderBigImg").addClass("dn");
	});
	
	//初始化参数
	function initSlider(){
		moveStart=false;
		verifySliderSuccess=false;
		oldX=0,moveX=0,nowX=0;
		randomTop=Math.round(Math.random()*100/3)+10;
		randomLeft=Math.round(Math.random()*100)+90;
		$(".sliderRtImg").css("left",randomLeft).css("top",randomTop);
		$(".sliderSmImg").css("top",randomTop);
		var index=parseInt($(".sliderBigImg").attr("index"));
		index++;
		if(index>6 || isNaN(index)){
			index=1;
		}
		$(".sliderBigImg").attr("index",index);
		$(".sliderBigImg").css("background-image","url(img/bigImg"+index+".png)");
		$("#sliderBigImg").attr("src","img/bigImg"+index+".png?v="+new Date().getTime());
		
		//抠图
		$("#sliderBigImg").load(function(){
			var can = document.getElementById('sliderCanvas');    // 获取 canvas 的实例
	        var ctx = can.getContext('2d');     // 获取上下文
	        var oldImg = document.getElementById('sliderBigImg');  // 获取原始图片
	        ctx.drawImage(oldImg, randomLeft, randomTop, 43, 43, 0, 0, 43, 43);    // 截取图片

			var can1 = document.getElementById('sliderCanvas1');    // 获取 canvas 的实例
	        var ctx1 = can1.getContext('2d');     // 获取上下文
	        var oldImg = document.getElementById('sliderBigImg');  // 获取原始图片
	        ctx1.drawImage(oldImg, randomLeft, randomTop, 43, 43, 0, 0, 43, 43);    // 截取图片
		});
	}
	//滑块相关 js end
	
	//3秒钟自动换背景
	var index=0;
	var timer=setInterval(function(){
		index=parseInt($(".content").attr("index"));
		index++;
		if(index>3 || isNaN(index)){
			index=1;
		}
		$(".content").css("background-image","url(img/indexBG"+index+".jpg)").attr("index",index);
		$(".contentBG").css("background-image","url(img/indexBG"+index+".jpg)").attr("index",index).hide().fadeIn();
	}, 3000);
	
});