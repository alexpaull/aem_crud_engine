package com.apsk.crud.component;

import com.adobe.cq.sightly.WCMUsePojo;
import com.apsk.crud.service.CRUDService;

import java.util.List;

public class CRUDEngine extends WCMUsePojo{

    private List<String> nodeTypes;

    public CRUDEngine(){}

    @Override
    public void activate() throws Exception {
        CRUDService crudService = new CRUDService();
        nodeTypes = crudService.getNodeTypes(getRequest());
    }

    public List<String> getNodeTypes() {
        return nodeTypes;
    }
}
