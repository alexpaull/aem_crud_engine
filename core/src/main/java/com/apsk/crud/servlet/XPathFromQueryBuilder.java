package com.apsk.crud.servlet;

import com.apsk.crud.service.CRUDService;
import com.google.gson.Gson;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@SlingServlet(
        paths = {"/services/crud-engine/xpath.json"},
        methods = {"GET"}
)
public class XPathFromQueryBuilder extends SlingSafeMethodsServlet {
    @Override
    protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {


        String querybuilder = request.getParameter("querybuilder");

        CRUDService crudService = new CRUDService();

        String xpath = crudService.getXpathFromQueryBuilder(request, querybuilder);

        try{

            PrintWriter out = response.getWriter();

            response.setCharacterEncoding("utf-8");

            if (xpath != null){
                out.println("{xpath='" + xpath + "'}");
                response.setStatus(200);
            } else {
                out.println("[]");
                response.setStatus(204);
            }
        }
        catch(Exception e){

        }
    }
}
