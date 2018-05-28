package com.verify.Dao;

import java.sql.*;
import java.util.Random;

import com.sun.xml.internal.bind.v2.schemagen.xmlschema.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class verifyDao {

	private int number=0;

//	private String SQL="";
	//注册
	public Boolean register(String account,String secret,String sex,String contact){
//		System.out.println("into verfiyDao register");
		String SQL="INSERT INTO t_user(account,secret,sex,contact) VALUES(?,?,?,?)";
		Connection con=null;
		PreparedStatement pstmt=null;
		Boolean result=false;
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			
			pstmt.setString(1, account);
			pstmt.setString(2, secret);
			pstmt.setString(3, sex);
			pstmt.setString(4, contact);
			int rs=pstmt.executeUpdate();//
			if(rs!=-1){
				result=true;
//				System.out.println("注册成功");
			}
			con.close();
			pstmt.close();
//			System.out.println("close con register");
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			DBDao.closeConnection(con);
//			System.out.println("finally register");
		}
		return result;
	}
	
	//登录
	public JSONObject login(String account,String secret){
		String SQL="SELECT id,realName FROM t_user WHERE account=? and secret=?  LIMIT 1";//  
		Connection con=null;
		PreparedStatement pstmt=null;
		int success=500;
		JSONObject obj=new JSONObject();
		JSONObject result=new JSONObject();
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			pstmt.setString(1, account);
			pstmt.setString(2, secret);
			ResultSet rs=pstmt.executeQuery();
			while(rs.next()){
				success=200;
				obj.put("realName", rs.getString("realName"));
				obj.put("id", rs.getInt("id"));
			}
			rs.close();
			con.close();
			pstmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			DBDao.closeConnection(con);
		}
		result.put("status", success);
		result.put("result", obj);
		return result;
	};
	
	//修改密码
	public JSONObject editSecret(int id,String secret,String newSecret){
		String SQL="UPDATE t_user set secret=? WHERE id=? and secret=?";
		Connection con=null;
		PreparedStatement pstmt=null;
		JSONObject result=new JSONObject();
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			pstmt.setString(1, newSecret);
			pstmt.setInt(2, id);
			pstmt.setString(3, secret);
			int rs=pstmt.executeUpdate();
			if(rs!=-1){
				result.put("status", 200);
			}else{
				result.put("status", 500);
			}
			con.close();
			pstmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			DBDao.closeConnection(con);
		}
		return result;
	}
	
	//修改个人信息
	public JSONObject editBaseInfo(int id,String account,String realname,String sex,String contact){
		String SQL="UPDATE t_user set account=?,realname=?,sex=?,contact=? WHERE id=?";
		Connection con=null;
		PreparedStatement pstmt=null;
		JSONObject result=new JSONObject();
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			pstmt.setString(1, account);
			pstmt.setString(2, realname);
			pstmt.setString(3, sex);
			pstmt.setString(4, contact);
			pstmt.setInt(5, id);
			int rs=pstmt.executeUpdate();
			if(rs!=-1){
				result.put("status", 200);
			}else{
				result.put("status", 500);
			}
			con.close();
			pstmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			DBDao.closeConnection(con);
		}
		return result;
	}
	
	//得到个人信息
	public JSONObject getBaseInfo(int id){
		String SQL="SELECT id,account,realname,sex,contact FROM t_user WHERE id=? LIMIT 1";
		Connection con=null;
		PreparedStatement pstmt=null;
		JSONObject obj=new JSONObject();
		JSONObject result=new JSONObject();
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			pstmt.setInt(1, id);
			ResultSet rs=pstmt.executeQuery();
			while(rs.next()){
				obj.put("id", rs.getInt("id"));
				obj.put("account", rs.getString("account"));
				obj.put("sex", rs.getString("sex"));
				obj.put("realname", rs.getString("realname"));
				obj.put("contact", rs.getString("contact"));
			}
			rs.close();
			pstmt.close();
			con.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			DBDao.closeConnection(con);
		}
		result.put("status", 200);
		result.put("result", obj);
		return result;
	}
	
	//获取随机8张图片
	public JSONObject getRandomImg(){
		//生产随机8位1-24
//		int[] nums={};
		//查询数据
		String SQL="SELECT id,file,zhname,enname FROM t_img ";
		Connection con=null;
		PreparedStatement pstmt=null;
		JSONObject result=new JSONObject();
		JSONArray arr=new JSONArray();
		JSONArray resultArr=new JSONArray();
		try{
			con=DBDao.getConnection();
			pstmt=(PreparedStatement)con.prepareStatement(SQL);
			ResultSet rs=pstmt.executeQuery();
			while(rs.next()){
				JSONObject obj=new JSONObject();
				obj.clear();
				obj.put("id", rs.getInt("id"));
				obj.put("file", rs.getString("file"));
				obj.put("zhname", rs.getString("zhname"));
				obj.put("enname", rs.getString("enname"));
				arr.add(obj);
			}
			rs.close();
			con.close();
			pstmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			DBDao.closeConnection(con);
		}
		
		int[] nums={0,0,0,0,0,0,0,0};
		for(int i=0;i<8;i++){
			if(nums[i]==0){
				number=0;
				nums[i]=getRandomNum(arr.size(), nums);
			}
		}
		Random random=new Random();
		int rightIndex=random.nextInt(8);
		JSONObject resultAll=new JSONObject();
		for(int i=0;i<8;i++){
			resultArr.add(arr.get(nums[i]));
			if(rightIndex==i){
				result.put("right",arr.get(nums[i]));
			}
		}
		result.put("all", resultArr.toJSONString());
		resultAll.put("status", 200);
		resultAll.put("result",result);
		return resultAll;
	};
	
	//获取不重复的随机数 range随机数范围 1-range nums数组。存放随机数的数组
	public int getRandomNum(int range,int[] nums){
		number++;
		if(number>100){
			return 0;
		}
		Random random=new Random();
		int ran=random.nextInt(range);
		//判断数组你们是否已经存在该值
		Boolean exist=false;
		for(int j=0;j<nums.length;j++){
			if(nums[j]==ran){
				exist=true;
			}
		}
		if(exist){
			ran=getRandomNum(range,nums);
		}
		return ran;
	}
}
