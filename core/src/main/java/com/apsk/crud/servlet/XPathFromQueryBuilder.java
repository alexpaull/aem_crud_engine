package com.apsk.crud.servlet;

import com.day.cq.search.PredicateConverter;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.jcr.Session;
import com.day.cq.search.Query;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.Properties;

@SlingServlet(
        paths = {"/services/crud-engine/xpath-from-querybuilder.json"},
        methods = {"GET"}
)
public class XPathFromQueryBuilder extends SlingSafeMethodsServlet {

    private static final String QUERY = "query";

    @Override
    protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {

        String xpath = "";

        String queryParam = request.getParameter(QUERY);
        QueryBuilder builder = request.getResourceResolver().adaptTo(QueryBuilder.class);
        Session session = request.getResourceResolver().adaptTo(Session.class);

        Query query;

        // create query
        if (queryParam != null) {
            Properties props = new Properties();
            try {
                props.load(new StringReader(queryParam));
                PredicateGroup root = PredicateConverter.createPredicates(props);
                // avoid slow //* queries
                if (!root.isEmpty()) {
                    query = builder.createQuery(root, session);
                    SearchResult result = query.getResult();
                    xpath = result.getQueryStatement();
                }

                PrintWriter out = response.getWriter();

                response.setCharacterEncoding("utf-8");

                if (xpath != null && xpath != ""){
                    out.println(xpath);
                    response.setStatus(200);
                } else {
                    out.println("[]");
                    response.setStatus(204);
                }
            }catch(Exception e){
                e.printStackTrace();
            }
        }
    }
}
