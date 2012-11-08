package com.globo.bbb;

import org.mortbay.jetty.Server;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;

public class MainClass {

	public static final String VOTA1 = "vota1";
	public static final String VOTA2 = "vota2";

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		Server server = new Server(8080);
		Context root = new Context(server,"/",Context.SESSIONS);
		root.addServlet(new ServletHolder(new ResourceServlet()), "/*");
		root.addServlet(new ServletHolder(new CaptchaServlet()), "/stickyImg");		
		root.addServlet(new ServletHolder(new VotaBase(VOTA1)), String.format("/%s", VOTA1));
		root.addServlet(new ServletHolder(new VotaBase(VOTA2)), String.format("/%s", VOTA2));
		root.addServlet(new ServletHolder(new Parcial()), String.format("/%s", "parcial"));
		server.start();
	}

}

