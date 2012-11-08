package com.globo.bbb;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import nl.captcha.Captcha;

public class VotaBase extends HttpServlet{
	private static final long serialVersionUID = 8112787449925108985L;

	String nome;
	
	public VotaBase(String nome) {
		this.nome = nome;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Captcha captcha = (Captcha)req.getSession().getAttribute("captcha");
		if (captcha.isCorrect(req.getParameter("palavra"))){
			addVoto();
			resp.setContentType("text/plain");
			PrintWriter writer = resp.getWriter();
			writer.print(String.format("%s&%s", totalVotos(MainClass.VOTA1), totalVotos(MainClass.VOTA2)));
			writer.flush();
			writer.close();		
		}
		else{
			resp.setContentType("text/plain");
			resp.getWriter().print("erro");
		}
	}


	
	protected void addVoto(){
		Long attribute = totalVotos();
		getServletContext().setAttribute(nome, attribute + 1l);
	}

	protected Long totalVotos() {
		return totalVotos(nome);
	}
	
	public Long totalVotos(String nome) {
		Long attribute = (Long)getServletContext().getAttribute(nome);
		if (attribute == null)
			return 0l;
		return attribute;
	}
}
