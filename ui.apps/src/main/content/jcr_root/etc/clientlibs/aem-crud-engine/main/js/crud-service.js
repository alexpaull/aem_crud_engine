crudEngine.runQuery = function(request){
    $.ajax({
        method: "GET",
        url: "/services/crud-engine/run-crud.json" + request,
        complete: function(response){
            if (response.status == 302){
                location.reload();
            }
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