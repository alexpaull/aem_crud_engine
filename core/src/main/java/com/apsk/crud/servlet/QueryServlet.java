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
        paths = {"/services/crud-engine/query.json"},
        methods = {"GET"}
)
public class QueryServlet extends SlingSafeMethodsServlet {

    // returns path list for xpath query results
    @Override
    protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {

        CRUDService crudService = new CRUDService();

        try{
            List<String> paths = crudService.getPathsFromXpath(request);

            PrintWriter out = response.getWriter();

            response.setCharacterEncoding("utf-8");

            if (paths != null && paths.size() > 0){
                // json string response
                String json = new Gson().toJson(paths);
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
