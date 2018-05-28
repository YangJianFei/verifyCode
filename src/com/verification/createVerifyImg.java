package com.verification;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.Function.encodingFunction;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.util.Base64;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import com.sun.xml.internal.bind.v2.runtime.output.Encoded;

public class createVerifyImg {

	private int width=70;
	private int height=35;
	public static final String VALIDATE_CODE="verifyCode"; 
	
	public String validateVerify(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String code=encodingFunction.getMethodEncoding((String)request.getParameter("code"));

		JSONObject obj=new JSONObject();
		if(code.equals((String)request.getSession().getAttribute(VALIDATE_CODE))){
			obj.put("status", "200");
		}else{
			obj.put("status", "500");
		}
		return obj.toJSONString();
	};
	
	public void createVerifyImg(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Cache-Contril", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("image/jpeg");
		
		BufferedImage image=new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics g=image.getGraphics();
		
		//生成背景
		createBackground(g);
		
		//生成字符
		String s=createCharacter(g);
		request.getSession().setAttribute(VALIDATE_CODE, s.toLowerCase());
//		System.out.println("numCode:"+s);
		
		g.dispose();
		OutputStream out=response.getOutputStream();
//		JPEGImageEncoder encoder=JPEGCodec.createJPEGEncoder(out);
//		encoder.encode(image);
		ImageIO.write(image, "JPEG", out);
//		ImageIO.write(image, "JPEG", new File("C:\\Users\\Administrator\\Desktop\\is.jpeg"));
//		out.close();
//		OutputStream sos=new FileOutputStream("C:\Users\Administrator\Desktop");
//		this.
	}
	
	//获取随机颜色
	public Color getRandColor(int fc,int bc){
		int f=fc;
		int b=bc;
		Random random=new Random();
		if(f>255){
			f=255;
		}if(b>255)
		{
			b=255;
		}
		return new Color(f+random.nextInt(b-f),f+random.nextInt(b-f),
				f+random.nextInt(b-f));
	}
	
	//填充背景
	private void createBackground(Graphics g){
		g.setColor(getRandColor(220, 250));
		g.fillRect(0, 0, width, height);
		//加入干扰线条
		for(int i=0;i<8;i++){
			g.setColor(getRandColor(40, 150));
			Random random=new Random();
			int x=random.nextInt(width);
			int y=random.nextInt(height);
			int x1=random.nextInt(width);
			int y1=random.nextInt(height);
			g.drawLine(x,y,x1, y1);
		}
	}
	
	//获取随机字符
	private String createCharacter(Graphics g){
		char[] codeSeq={ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
                'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
                'Z', '2', '3', '4', '5', '6', '7', '8', '9' };
		String[] fontTypes={ "Arial", "Arial Black", "AvantGarde Bk BT",
        	"Calibri" };
		Random random=new Random();
		StringBuilder s=new StringBuilder();
		for(int i=0;i<4;i++){
			String r=String.valueOf(codeSeq[random.nextInt(codeSeq.length)]);
			g.setColor(new Color(50+random.nextInt(100), 
					50+random.nextInt(100), 
					50+random.nextInt(100)));
			g.setFont(new Font(fontTypes[random.nextInt(fontTypes.length)],
					Font.BOLD, 26));
			g.drawString(r, 15*i+5, 19+random.nextInt(8));
			s.append(r);
		}
		return s.toString();
	}
}
