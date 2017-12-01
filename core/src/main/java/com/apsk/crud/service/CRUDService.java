package com.apsk.crud.service;

import com.adobe.acs.commons.packaging.PackageHelper;

import org.apache.jackrabbit.vault.fs.api.ProgressTrackerListener;
import org.apache.jackrabbit.vault.util.DefaultProgressListener;

//import com.day.jcr.vault.fs.api.ProgressTrackerListener;
//import com.day.jcr.vault.fs.config.DefaultWorkspaceFilter;

import org.apache.jackrabbit.vault.packaging.Packaging;
import org.apache.jackrabbit.vault.packaging.JcrPackage;
import org.apache.jackrabbit.vault.packaging.JcrPackageManager;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
//import org.apache.sling.pipes.PipeBuilder;
import com.apsk.pipes.PipeBuilder;
//import org.apache.sling.pipes.Plumber;
import com.apsk.pipes.Plumber;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.*;

public class CRUDService {

    private static final String NODE_TYPE_PATH = "/jcr:system/jcr:nodeTypes";

    private static final String PACKAGE = "package";
    private static final String PACKAGE_NAME = "package_name";
    private static final String PARENT = "parent";
    private static final String XPATH = "xpath";
    private static final String ACTION = "action";
    private static final String ACTION_PROPERTY = "action_property";
    private static final String FIND = "find";
    private static final String REPLACE = "replace";
    private static final String WRITE = "write";
    private static final String FOLDER = "folder";
    private static final String PATH = "path";
    private static final String DELETE = "delete";
    private static final String MAKE_DIRECTORY = "mkdir";
    private static final String CONDITION = "condition";
    private static final String CONDITION_OPERATION = "condition_operation";
    private static final String CONDITION_VALUE = "condition_value";
    private static final String EXPR1 = "expr1";
    private static final String EXPR2 = "expr2";

    private static final String CRUD_ENGINE_PACKAGES = "crud-engine-packages";
    private static final String THUMBNAIL = "/content/dam/crud-engine/Backup.png";

    public List<String> getNodeTypes(SlingHttpServletRequest request) {
        List<String> nodeTypes = new ArrayList<String>();

        ResourceResolver resolver = request.getResourceResolver();
        Resource resource = resolver.getResource(NODE_TYPE_PATH);

        Iterable<Resource> iterable = resource.getChildren();

        for (Resource child: iterable){
            if (child.getName() != null) {
                nodeTypes.add(child.getName());
            }
        }

        try {
            resource.getResourceResolver().commit();
        }catch(Exception e){
            e.printStackTrace();
        }

        return nodeTypes;
    }

    // prevents deploy from overwriting
    public void runCRUD(SlingHttpServletRequest request, Plumber plumber, Packaging packaging, PackageHelper packageHelper){

        ResourceResolver resolver = request.getResourceResolver();

        String getPackage = request.getParameter(PACKAGE);
        String package_name = request.getParameter(PACKAGE_NAME);
        String parent = request.getParameter(PARENT);
        String xpath = request.getParameter(XPATH);
        String action = request.getParameter(ACTION);
        String action_property = request.getParameter(ACTION_PROPERTY);
        String find = request.getParameter(FIND);
        String replace = request.getParameter(REPLACE);
        String write = request.getParameter(WRITE);
        String folder = request.getParameter(FOLDER);
        String path = request.getParameter(PATH);
        String condition = request.getParameter(CONDITION);
        String condition_operation = request.getParameter(CONDITION_OPERATION);
        String condition_value = request.getParameter(CONDITION_VALUE);
        String expr1 = request.getParameter(EXPR1);
        String expr2 = request.getParameter(EXPR2);

        if (getPackage != null){
            createPackage(resolver, path, packaging, packageHelper, package_name);
        }

        if (xpath != null) {

            try {

                // test break down chain commands
                PipeBuilder pipeBuilder = plumber.newPipe(resolver);

                // add xpath to pipe builder
                pipeBuilder.xpath(xpath);

                // check parent
                if (parent != null && parent.equals("true")){
                    pipeBuilder.parent();
                }

                // assigning name to input items
                pipeBuilder.name("item");

                // check action
                if (action.equals(DELETE)) {
                    pipeBuilder.rm();
                } else if (action.equals(WRITE)){
                    pipeBuilder.write(action_property,write);
                } else if (action.equals(REPLACE)) {
                    pipeBuilder.write(action_property, "${item." + action_property + ".replace('" + find + "','" + replace + "')}");
                } else if (action.equals(CONDITION)) {
                    String ternary = condition + " " + condition_operation + " '" + condition_value + "' ? '" + expr1 + "' : '" + expr2 + "'";
                    pipeBuilder.write(action_property, "${(" + ternary + ")}");
                } else if (action.equals(MAKE_DIRECTORY)) {
                    pipeBuilder.mkdir(folder);
                } else if (action.equals("move")){

                } else if (action.equals("copy")){

                } else if (action.equals("moveNode")){

                } else if (action.equals("copyNode")) {

                }

                pipeBuilder.run();

            } catch (Exception e) {
            }
        }
    }

    private void createPackage(ResourceResolver resolver, String path, Packaging packaging, PackageHelper packageHelper, String package_name){

        // get session from request
        Session session = resolver.adaptTo(Session.class);

        // create path collection for package method
        Collection<String> pathCollection = new ArrayList<String>();
        pathCollection.add(path);

        // empty definitions map for package method
        Map<String,String> definitionMap = new HashMap<String,String>();

        JcrPackageManager jcrPackageManager = packaging.getPackageManager(session);

        ProgressTrackerListener listener = new DefaultProgressListener();

        try {
            JcrPackage jcrPackage = packageHelper.createPackageForPaths(pathCollection, session, CRUD_ENGINE_PACKAGES, package_name, "0", PackageHelper.ConflictResolution.IncrementVersion, definitionMap);
            Resource thumbnail = resolver.getResource(THUMBNAIL);
            packageHelper.addThumbnail(jcrPackage,thumbnail);

            jcrPackageManager.assemble(jcrPackage,listener);

        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public List<String> getPathsFromXpath(SlingHttpServletRequest request) throws Exception{

        String xpath = request.getParameter(XPATH);

        List<String> paths = new ArrayList<String>();

        Session session = request.getResourceResolver().adaptTo(Session.class);

        QueryManager queryManager = session.getWorkspace().getQueryManager();
        Query query = queryManager.createQuery(xpath, Query.XPATH);
        QueryResult queryResult = query.execute();

        NodeIterator resultNodes = queryResult.getNodes();

        while(resultNodes.hasNext()){
            Node node = resultNodes.nextNode();
            paths.add(node.getPath());
        }

        return paths;
    }

    public String getXpathFromQueryBuilder(SlingHttpServletRequest request, String querybuilder){

        return "";
    }
}
