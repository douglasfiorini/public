package com.globo.bbb;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Parcial extends VotaBase {
	private static final long serialVersionUID = 5224239403974162885L;

	public Parcial() {
		super("parcial");
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		PrintWriter writer = resp.getWriter();
		writer.print(String.format("%s&%s", totalVotos(MainClass.VOTA1), totalVotos(MainClass.VOTA2)));
		writer.flush();
		writer.close();
	}

}
