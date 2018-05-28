$(function(){
	var userId=localStorage.getItem("userId")||0;
	if("false"==localStorage.getItem("login")){
		window.location.href="index.html";
	}
	
	//绑定基本信息	
	$(".vSHeadText").html(localStorage.getItem("userName"));
	$(".btn-edit-info,.btn-edit-secret").attr("id",userId);
	
	//个人信息点击事件
	$(".personInfo").on("click",function(){
		$(".perInfo").addClass("dn");
		$(".personalInfo").removeClass("dn");
	});
	
	//修改密码点击事件
	$(".editSecret").on("click",function(){
		$(".perInfo").addClass("dn");
		$(".secretInfo").removeClass("dn");
	});
	
	//退出登录点击事件
	$(".logOut").on("click",function(){
		localStorage.setItem("login","false");
		window.history.back();
	});
	
	//获取个人信息
	$.ajax({
		url:"/verificationProject/verify.do",
		data:{
			"method":"getBaseInfo",
			"id":userId
		},
		dataType:"json",
		success:function(data){
			if(200==data.status){
				$(".info-account").val(data.result.account);
				$(".info-name").val(data.result.realname);
				$(".sex[id="+data.result.sex+"]").prop("checked",true);
				$(".info-phone").val(data.result.contact);
			}
		}
	});
	
	//修改个人信息点击事件
	$(".btn-edit-info").on("click",function(){
		var account=$(".info-account").val();
		var name=$(".info-name").val();
		var sex=$(".sex:checked").attr("id");
		var phone=$(".info-phone").val();
		var error=false;
		if(checkundefined(account)==""){
			$(".info-account").addClass("borderError").focus();
			error=true;
		}
		if(account.length>15){
			$(".register-account").addClass("borderError").focus();
			error=true;
			alert("账户名称太长");
		}
		if(name.length>15){
			$(".info-name").addClass("borderError").focus();
			error=true;
			alert("姓名太长");
		}
		if(!isMobile(phone)){
			$(".info-phone").addClass("borderError").focus();
			error=true;
		}
		if(error){
			return false;
		}
		$.ajax({
			type:"post",
			url:"/verificationProject/verify.do",
			data:{
				"method":"eidtBaseInfo",
				"id":userId,
				"account":account,
				"realname":name,
				"sex":sex,
				"contact":phone,
			},
			dataType:"json",
			success:function(data){
				if(200==data.status){
					$(".systemMain").trigger("click");
					alert("修改成功");
				}else{
					alert("修改失败");
				}
			}
		});
	});
	
	//修改密码点击事件
	$(".btn-edit-secret").on("click",function(){
		var oldSecret=$(".info-oldSecret").val();
		var newSecret=$(".info-newSecret").val();
		var newRepeat=$(".info-repeatNewSecret").val();
		var error=false;
		if(!lengthRange(oldSecret, 6, 50)){
			$(".info-oldSecret").addClass("borderError").focus();
			error=true;
			alert("密码最低为6为数");
		}
		if(!lengthRange(newSecret, 6, 50)){
			$(".info-newSecret").addClass("borderError").focus();
			error=true;
			alert("密码最低为6为数");
		}
		if(newSecret!=newRepeat){
			$(".info-newSecret").addClass("borderError").focus();
			$(".info-repeatNewSecret").addClass("borderError");
			error=true;
			alert("新密码不一致");
		}
		if(error){
			return false;
		}
		$.ajax({
			type:"post",
			url:"/verificationProject/verify.do",
			data:{
				"method":"editSecret",
				"id":userId,
				"secret":oldSecret,
				"newSecret":newSecret
			},
			dataType:"json",
			success:function(data){
				if(200==data.status){
					$(".systemMain").trigger("click");
					alert("修改成功");
				}else{
					alert("修改失败");
				}
			}
		});
	});
	
	//系统主字体点击事件
	$(".systemMain").on("click",function(){
		$(".perInfo").addClass("dn");
		$(".productIntro").removeClass("dn");
	});
});