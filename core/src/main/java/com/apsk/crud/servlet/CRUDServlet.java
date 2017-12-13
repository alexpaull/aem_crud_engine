package com.apsk.crud.servlet;

import com.adobe.acs.commons.packaging.PackageHelper;
import com.apsk.crud.service.CRUDService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.vault.packaging.Packaging;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.pipes.Plumber;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by alexpaull on 7/27/17.
 */

@SlingServlet(
        paths = {"/services/crud-engine/run-crud.json"},
        methods = {"GET"}
)
public class CRUDServlet extends SlingSafeMethodsServlet {

    @Reference
    private Plumber plumber;

    @Reference
    private Packaging packaging;

    @Reference
    private PackageHelper packageHelper;

    @Override
    protected final void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws
            ServletException, IOException {

        CRUDService crudService = new CRUDService();
        crudService.runCRUD(request, plumber, packaging, packageHelper);
    }
}