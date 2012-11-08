package com.globo.bbb;

import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import nl.captcha.Captcha;

public class CaptchaServlet extends HttpServlet {
	private static final long serialVersionUID = -2240355288721139887L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Captcha captcha = new Captcha.Builder(200, 50).addText().build();
		req.getSession().setAttribute("captcha", captcha);
		ImageIO.write(captcha.getImage(), "png", resp.getOutputStream());
	}
	
	

}
