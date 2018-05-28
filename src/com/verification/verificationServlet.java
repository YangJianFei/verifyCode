package com.verification;

import javax.servlet.http.HttpServlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.Function.encodingFunction;
import com.verify.Dao.*;

public class verificationServlet extends HttpServlet {

	public static final String CHARSET_NAME="UTF-8";
	
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		doGet(request,response);
	};
	
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		String method=(String)request.getParameter("method");//method
//		System.out.println(method);
//		System.out.println("recive one request");
		if(method==""||method==null){
			
			System.out.println("method null");
			PrintWriter printOut=response.getWriter();
//			printOut.println("invalid request!");
			System.out.println("invalid request!");
		}else if(method.equals("register")){//register
			
			System.out.println("recive register");
			String result=register(encodingFunction.getMethodEncoding((String)request.getParameter("account")), 
					encodingFunction.getMethodEncoding((String)request.getParameter("secret")),
					encodingFunction.getMethodEncoding((String)request.getParameter("sex")),
					encodingFunction.getMethodEncoding((String)request.getParameter("contact")));
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset=UTF-8");
		}else if(method.equals("login")){//login
			
			String result=login(encodingFunction.getMethodEncoding((String)request.getParameter("account")), 
					encodingFunction.getMethodEncoding((String)request.getParameter("secret")));
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset="+CHARSET_NAME);
		}else if(method.equals("getVerifyCode")){//getverifyCode
			
			createVerifyImg cVI=new createVerifyImg();
			cVI.createVerifyImg(request, response);
		}else if(method.equals("validateVerify")){//validateVerify
			
			createVerifyImg cVI=new createVerifyImg();
			String result=cVI.validateVerify(request, response);
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));;
		}else if(method.equals("getRandomImg")){
			
			String result=getRandomImg();
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset="+CHARSET_NAME);
		}else if(method.equals("getBaseInfo")){
			
			String result=getBaseInfo(Integer.parseInt(request.getParameter("id")));
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset="+CHARSET_NAME);
		}else if(method.equals("eidtBaseInfo")){
			
			String result=editBaseInfo(Integer.parseInt(request.getParameter("id")),
					encodingFunction.getMethodEncoding((String)request.getParameter("account")),
					encodingFunction.getMethodEncoding((String)request.getParameter("realname")),
					encodingFunction.getMethodEncoding((String)request.getParameter("contact")),
					encodingFunction.getMethodEncoding((String)request.getParameter("sex")));
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset="+CHARSET_NAME);
		}else if(method.equals("editSecret")){
			
			String result=editSecret(Integer.parseInt(request.getParameter("id")),
					encodingFunction.getMethodEncoding((String)request.getParameter("secret")), 
					encodingFunction.getMethodEncoding((String)request.getParameter("newSecret")));
			response.getOutputStream().write(result.getBytes(CHARSET_NAME));
			response.setContentType("text/json;charset="+CHARSET_NAME);
		}else{

			System.out.println("unknow");
		}
	};
	
	//注册
	private String register(String account,String secret,String sex,String contact){
		System.out.println("begin register");
		verifyDao verify=new verifyDao();
		Boolean rs=verify.register(account, secret,sex,contact);
		System.out.println("success register");

		JSONObject obj=new JSONObject();
		if(rs){
			obj.put("status", 200);
			return obj.toJSONString();
		}else{
			obj.put("status", 500);
			return obj.toJSONString();
		}
	}
	
	//登录
	private String login(String account,String secret){
		System.out.println("begin login");
		verifyDao verify=new verifyDao();
		JSONObject obj=verify.login(account, secret);
		return obj.toJSONString();
	};
	
	//获取数据库随机8图片
	private String getRandomImg(){
		verifyDao verify=new verifyDao();
		JSONObject obj=verify.getRandomImg();
		return obj.toJSONString();
	};
	
	//得到基本信息
	private String getBaseInfo(int id){
		verifyDao verify=new verifyDao();
		JSONObject obj=verify.getBaseInfo(id);
		return obj.toJSONString();		
	}
	
	//修改基本信息
	private String editBaseInfo(int id,String account,String realname,String contact,String sex){
		verifyDao verify=new verifyDao();
		JSONObject obj=verify.editBaseInfo(id, account, realname, sex, contact);
		return obj.toJSONString();
	}
	
	//修改密码
	private String editSecret(int id,String secret,String newSecret){
		verifyDao verify=new verifyDao();
		JSONObject obj=verify.editSecret(id, secret, newSecret);
		return obj.toJSONString();
	}
}
