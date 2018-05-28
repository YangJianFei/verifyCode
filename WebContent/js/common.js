$(function(){
	
	//下拉框头部点击事件
	$("body").on("click",".vSelectHead",function(e){
		$(this).parent().toggleClass("open");
		var a=e||window.event;
		a.stopPropagation();
	});
	
	//验证方式点击事件
	$("body").on("click",".vSelectBody li",function(){
		var $this=$(this);
		if("text"==$this.parents(".open").find(".vSHeadText").attr("target")){
			
			$this.parents(".open").find(".vSHeadText").html($this.text()).attr("id",$this.attr("id"));
		}else if("button"==$this.parents(".open").find(".vSHeadText").attr("target")){
			
			$this.parents(".open").find(".vSHeadText").attr("id",$this.attr("id"));
		}
	});
	
	//绑定文档点击事件
	$(document).on("click",function(){
		$(".vSelectHead").parents(".open").removeClass("open");
	});
});
/*
 * 检查输入对象是否为空或全部为空格
 * 如果全是空,返回true,否则返回false
 */
function isNull(str){
	if(str == "")
		return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}
/*
 * 检查输入对象是否为正整数
 * 如果是返回true,否则返回false
 */
function isNumber(str){
    var regu = /^[1-9]*[1-9][0-9]*$/;
    return regu.test(str);
}
/*
 * 检查输入对象是否为非负整数
 * 如果是返回true,否则返回false
 */
function isScore(str){
    var regu = /^(0|[1-9]\d*)$/;
    return regu.test(str);
}
/*
 * 检查输入对象是否为一位小数点的正数
 * 如果是返回true,否则返回false
 */
function isNumberFloat(str){
    var regu = /^[0-9]+(.[0-9]{1})?$/;
    return regu.test(str);
}
/*
 * 检查输入输入金额
 * 如果是返回true,否则返回false
 */
function isMoney(str){
    var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    return regu.test(str);
}

/*
* 检查输入对象是否为邮箱格式
 */
function isEmail(str){
    var regu = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return regu.test(str);
}
/*
 * 检查输入对象长度,其中英文(包括空格)占1个字符,汉字占2个字符
 * str:输入字符串; min:最小长度; max:最大长度
 */
function lengthRange(str, min, max){
    var len = 0;
    for(var i = 0; i < str.length; i++){
        if(str.charCodeAt(i)>127 || str.charCodeAt(i)==94){
            len += 2;
        }else{
            len++;
        }
    }
    if(len >= min && len <= max){
        return true;
    }
    return false;
}

/*
 * 检查输入对象是否为手机号
 * 匹配13,14,15,17,18开头手机号码
 */
function isMobile(str){
    var regu = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    return regu.test(str);
}
/*
 * 检查输入对象是否为固定电话
 */
function isTel(str){
    var regu = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
    return regu.test(str);
}
/*校验邮编*/
function isCode(str){
    var reg=/^\d{6}$/;
    return reg.test(str);
}

//百分比
function percentper(number1, number2) {
    if(number2==0){
        return 0;
    }else{
        return (Math.round(number1 / number2 * 10000) / 100.00 + "%");// 小数点后两位百分比
    }
}
//相除结果
function avgper(number1, number2) {
    if(number2==0){
        return 0;
    }else{
        return (number1/number2).toFixed(1);
    }
}

//设置表格每列宽度百分比
function percentage(number1, number2) {
    return (Math.round(number1 / number2 * 10000) / 100.00 );// 小数点后两位百分比

}

//设置cookies
function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  //xl.setCookie(name,value);
}
//读取cookies
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
      return (encodeURI(arr[2]));
  else
      return null;
}
//删除cookies
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  //xl.delCookie(name);
}

var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
};

/**
 * 删除数组中指定的元素
 * @param val 指定的元素
 */
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};

//判断是否为空并返回值
function checkundefined($element) {
    if ($element === null || $element == 'null' || $element == "undefined" || $element === "" || $element === " " || typeof($element) == undefined || $element == undefined || String($element) == "NaN" || $element == "NaN") {
        return "";
    } else {
        return $element;
    }
}
//去空格
function trim(str) {
    if (!str) return null;
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
