package com.apsk.crud.servlet;

import com.google.gson.Gson;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@SlingServlet(
        paths = {"/services/crud-engine/first-result.json"},
        methods = {"GET"}
)
public class FirstResultServlet extends SlingSafeMethodsServlet {

    private static final String PATH = "path";

    // returns path list for xpath query results
    @Override
    protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {


        try{
            ResourceResolver resolver = request.getResource().getResourceResolver();
            Resource resource = resolver.getResource(request.getParameter(PATH));

            ValueMap properties = resource.adaptTo(ValueMap.class);
            String json = new Gson().toJson(properties);

            PrintWriter out = response.getWriter();
            response.setCharacterEncoding("utf-8");

            if (json != null){
                // json string response
                out.println(json);
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
