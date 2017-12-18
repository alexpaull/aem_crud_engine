crudEngine.runQuery = function(request, callback){
    $.ajax({
        method: "GET",
        url: "/services/crud-engine/run-crud.json" + request,
        complete: function(response){
            callback(response);
        }
    });
};

crudEngine.xpathQuery = function(xpath, callback){
    $.ajax({
        method: "GET",
        url: "/services/crud-engine/query.json?xpath=" + xpath,
        complete: function(response){
            callback(response);
        }
    });
};

crudEngine.firstResult = function(path, callback){
    $.ajax({
        method: "GET",
        url: "/services/crud-engine/first-result.json?path=" + path,
        complete: function(response){
            callback(response);
        }
    });
};

crudEngine.getXpathFromQueryBuilder = function(querybuilder, callback){
    $.ajax({
        method: "GET",
        url: "/services/crud-engine/xpath-from-querybuilder.json?query=" + querybuilder,
        complete: function(response){
            callback(response);
        }
    });
};