package com.apsk.crud.service;

import com.adobe.acs.commons.packaging.PackageHelper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.pipes.PipeBuilder;
import org.apache.sling.pipes.Plumber;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.*;

public class CRUDService {

    private static final String NODE_TYPE_PATH = "/jcr:system/jcr:nodeTypes";
    private static final String NODE_TYPE_IMAGE_PATH = "/crx/explorer/imgs/nodetypes/cq/";
    private static final String GIF_FILE_TYPE = ".gif";

    private static final String PACKAGE = "package";
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
    private static final String MKDIR = "mkdir";
    private static final String CONDITION = "condition";

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
    public void runCRUD(SlingHttpServletRequest request, Plumber plumber, PackageHelper packageHelper){

        ResourceResolver resolver = request.getResourceResolver();

        String getPackage = request.getParameter(PACKAGE);
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

        if (getPackage != null){
            createPackage(resolver, path, packageHelper);
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
                    pipeBuilder.write(action_property, "${(" + condition + ")}");
                } else if (action.equals(MKDIR)) {
                    pipeBuilder.mkdir(folder);
                }

                //pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item").write("testProp","${(item.testProp === '2' ? '1' : '3')}");

                pipeBuilder.run();

            } catch (Exception e) {
            }
        }
    }

    private void createPackage(ResourceResolver resolver, String path, PackageHelper packageHelper){

        // get session from request
        Session session = resolver.adaptTo(Session.class);

        // create path collection for package method
        Collection<String> pathCollection = new ArrayList<String>();
        pathCollection.add(path);

        // empty definitions map for package method
        Map<String,String> definitionMap = new HashMap<String,String>();

        try {
            packageHelper.createPackageForPaths(pathCollection, session, "crudBackupPackage", "backupPackage", "0", PackageHelper.ConflictResolution.IncrementVersion, definitionMap);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public List<String> getPathsFromXpath(SlingHttpServletRequest request) throws Exception{

        String xpath = request.getParameter("xpath");

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
}
