package com.globo.bbb;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ResourceServlet extends HttpServlet {
	private static final long serialVersionUID = -2240355288721139887L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("./"+req.getPathInfo());
		try {
			int c;
			while ((c = inputStream.read()) != -1) {
				resp.getWriter().write(c);
			}
		} finally {
			if (inputStream != null)
				inputStream.close();
			resp.getWriter().close();
		}

	}

}
