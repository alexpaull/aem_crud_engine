angular.module("CRUDEngineCtrl",[])
    .controller("crudEngineCtrl",["$scope", function($scope){

        $scope.pipes = {};

        // init values for engine
        $scope.pipes.path_operation = 'recursive';
        $scope.pipes.action = 'none';
        $scope.pipes.property_operation = 'none';
        //$scope.pipes.node = "";
        $scope.pipes.node_operation = 'none';

        // set active tab to simple
        $scope.pipes.query_type = 'simple';

        $scope.run = function(){
            crudEngine.runQuery(getServletRequest());
        };

        // run to initialize content finder for path
        $scope.initTreeLoader = function(){
            widgetService.setSlingTreeLoader("/", "path", "/");
        };

        $scope.getXpathResults = function(){

            // clear any old overlays to prevent datatable issues
            angular.element('.dynamic-message-overlay').remove();

            crudEngine.xpathQuery($scope.pipes.query, function(response){
                if (response && response.responseText){
                    var query_result = JSON.parse(response.responseText);
                    var $pass = {
                        "results": query_result,
                        "query": $scope.pipes.query
                    };

                    $scope.pipes.first_path = query_result[0];

                    //modalFactory.triggerModal("/etc/crud-engine/overlay.html", "overlayCtrl", $pass);
                    createDialog(query_result);


                    crudEngine.firstResult(query_result[0], function(response){
                        if (response.responseText) {
                            $scope.pipes.first_props = JSON.parse(response.responseText);
                        }
                    });
                }
            });
        };

        function createDialog(results){

            var innerHTML = '<table id="input_results" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
                '<thead><tr><th>Path</th></tr></thead>';

            innerHTML += '<tbody>';

            for (var result in results){
                if (result != 'remove') {
                    innerHTML += '<tr><td><a target="_blank" href="http://localhost:4502/crx/de/index.jsp#' + results[result] + '">' + results[result] + '</a></td></tr>';
                }
            }

            innerHTML += '</tbody></table>';

            var dialog = new Coral.Dialog().set({
                id: 'myDialog',
                header: {
                    innerHTML: 'Query Results: ' + $scope.pipes.query
                },
                content: {
                    innerHTML: innerHTML
                },
                footer: {
                    innerHTML: '<button is="coral-button" variant="primary" coral-close>Close</button>'
                }
            });

            document.body.appendChild(dialog);

            angular.element("#input_results").DataTable();

            dialog.show();
        }

        $scope.treeSearch = function(){
            angular.element(".crud-engine .x-form-trigger.x-form-search-trigger").click();
        };

        $scope.$watchGroup([
            'pipes.path',
            'pipes.path_operation',
            'pipes.action',
            'pipes.property_operation',
            'pipes.property_value',
            'pipes.property',
            'pipes.node',
            'pipes.node_operation',
            'pipes.node_type',
            'pipes.query_type',
            'pipes.xpath_query',
            'pipes.querybuilder_query'
        ], function(){
            updateInputFromPipes();
        });

        $scope.$watchGroup([
            'pipes.query',
            'pipes.action',
            'pipes.find',
            'pipes.replace',
            'pipes.folder',
            'pipes.write',
            'pipes.condition',
            'pipes.action_property',
            'pipes.condition_operation',
            'pipes.condition_value',
            'pipes.expr1',
            'pipes.expr2',
            'pipes.parent'
        ], function(){
            updateOutputFromPipes();
        });
        
        angular.element("#type-autocomplete .coral-Textfield").on('input',function(){
            var new_value = $(this).val();

            $scope.$apply(function(){
                $scope.pipes.node_type = new_value;
            });
        });

        angular.element("#type-autocomplete").change(function() {
            var new_value = $(this).find(".coral-Textfield").val();

            $scope.$apply(function() {
                $scope.pipes.node_type = new_value;
            });
        });

        function getServletRequest(){
            return "?path=" + $scope.pipes.path + "&xpath=" + $scope.pipes.query + "&" + $scope.pipes.output + getFlagsFromPipes();
        }

        function updateInputForXPath(){
            $scope.pipes.query = $scope.pipes.xpath_query;
        }

        function updateInputForQueryBuilder(){
            var encodedQueryBuilder = encodeURIComponent($scope.pipes.querybuilder_query);

            crudEngine.getXpathFromQueryBuilder(encodedQueryBuilder, function(response){
                $scope.pipes.query = response.responseText;
                $scope.$apply();
            });
        }

        function updateInputForSimple(){
            var xpath = "/jcr:root";

            // adding path to xpath
            if ($scope.pipes.path) {
                xpath += $scope.pipes.path;
            }
            if ($scope.pipes.path_operation == 'children') {
                xpath += "/";
            } else if ($scope.pipes.path_operation == 'recursive') {
                xpath += "//";
            }

            // adding node to xpath
            // if exact path then node not needed
            if ($scope.pipes.path_operation != 'exact') {
                if ($scope.pipes.node_operation == 'none') {
                    xpath += "*";
                } else if ($scope.pipes.node_operation == 'name') {
                    var node = ($scope.pipes.node == "") ? "*" : $scope.pipes.node;
                    xpath += "element(" + node + ")";
                } else if ($scope.pipes.node_operation == 'type') {
                    xpath += "element(*," + $scope.pipes.node_type + ")";
                } else {
                    var node = ($scope.pipes.node == "") ? "*" : $scope.pipes.node;
                    xpath += "element(" + node + "," + $scope.pipes.node_type + ")";
                }
            }

            // adding property to xpath
            if ($scope.pipes.property_operation == 'none'){
                // do nothing
            } else if ($scope.pipes.property_operation == 'exists'){
                xpath += "[@" + $scope.pipes.property + "]";
            } else if ($scope.pipes.property_operation == 'equals'){
                xpath += "[@" + $scope.pipes.property + " = '" + $scope.pipes.property_value + "']";
            } else if ($scope.pipes.property_operation == 'unequals'){
                xpath += "[@" + $scope.pipes.property + " != '" + $scope.pipes.property_value + "']";
            } else {
                // contains
                if ($scope.pipes.property && $scope.pipes.property_value){
                    xpath += "[jcr:contains(@" + $scope.pipes.property + ",";
                    if ($scope.pipes.property_value.indexOf("@") != -1){
                        xpath += $scope.pipes.property_value + ")]";
                    } else {
                        xpath += "'" + $scope.pipes.property_value + "')]";
                    }
                } else if ($scope.pipes.property_value){
                    xpath += "[jcr:contains(.,";
                    if ($scope.pipes.property_value.indexOf("@") != -1){
                        xpath += $scope.pipes.property_value + ")]";
                    } else {
                        xpath += "'" + $scope.pipes.property_value + "')]";
                    }
                }
            }

            $scope.pipes.query = xpath;
        }

        function updateInputForAdvanced(){

        }


        // handler to determine which query to use for update
        function updateInputFromPipes(){
            if ($scope.pipes.query_type == 'simple'){
                updateInputForSimple();

            } else if ($scope.pipes.query_type == 'advanced'){
                updateInputForAdvanced();

            } else if ($scope.pipes.query_type == 'xpath'){
                updateInputForXPath();

            } else if ($scope.pipes.query_type == 'querybuilder'){
                updateInputForQueryBuilder();
            }
        }

        function getFlagsFromPipes(){
            var flags = "";

            if ($scope.pipes.parent) {
                flags += "&parent=" + $scope.pipes.parent;
            }
            if ($scope.pipes.package){
                flags += "&package=" + $scope.pipes.package;
                flags += "&package_name=" + $scope.pipes.package_name;
            }

            return flags;
        }

        function updateOutputFromPipes(){
            var outputParam = "";

            if ($scope.pipes.action){
                if ($scope.pipes.action == 'delete' || $scope.pipes.action == 'none'){
                    outputParam += "action=" + $scope.pipes.action;
                } else {
                    outputParam += "action=" + $scope.pipes.action + "&";
                }

                if ($scope.pipes.action == 'replace'){
                    outputParam += "action_property=" + $scope.pipes.action_property + "&";
                    outputParam += "find=" + $scope.pipes.find + "&";
                    outputParam += "replace=" + $scope.pipes.replace;
                } else if ($scope.pipes.action == 'write') {
                    outputParam += "action_property=" + $scope.pipes.action_property + "&";
                    outputParam += "write=" + $scope.pipes.write;
                } else if ($scope.pipes.action == 'conditional'){
                    outputParam += "action_property=" + $scope.pipes.action_property + "&";
                    outputParam += "condition=" + $scope.pipes.condition;
                    outputParam += "condition_operation=" + $scope.pipes.condition_opetation;
                    outputParam += "condition_value=" + $scope.pipes.condition_value;
                    outputParam += "expr1=" + $scope.pipes.expr1;
                    outputParam += "expr2=" + $scope.pipes.expr2;
                } else if ($scope.pipes.action == 'mkdir'){
                    outputParam += "folder=" + $scope.pipes.folder;
                }
            }

            $scope.pipes.output = outputParam;
            updateGeneratedJavaFromPipes();
        }
        
        function updateGeneratedJavaFromPipes(){
            var newLine = "%0A";
            var outputParam = "PipeBuilder pipeBuilder = plumber.newPipe(resolver);" + newLine
                + "pipeBuilder.xpath(\"" + decodeURIComponent(encodeURIComponent($scope.pipes.query).replace(newLine,"")) + "\");" + newLine;
            
            if ($scope.pipes.parent){
                outputParam += "pipeBuilder.parent();" + newLine;
            }

            if ($scope.pipes.action){
                if ($scope.pipes.action == 'delete'){
                    outputParam += "pipeBuilder.rm();" + newLine;
                } else if ($scope.pipes.action == 'replace'){
                    outputParam += "pipeBuilder.write(\"" + $scope.pipes.action_property + "\", \"${item['" + $scope.pipes.action_property + "'].replace('" + $scope.pipes.find + "','" + $scope.pipes.replace + "')}\");" + newLine;
                } else if ($scope.pipes.action == 'write') {
                    outputParam += "pipeBuilder.write(\"" + $scope.pipes.action_property + "\", \"" + $scope.pipes.write + "\");" + newLine;
                } else if ($scope.pipes.action == 'conditional'){
                    outputParam += "pipeBuilder.write(\"" + $scope.pipes.action_property+ "\", \"${(" + $scope.pipes.condition + " " + $scope.pipes.condition_operation + " '" + $scope.pipes.condition_value + "' ? '" + $scope.pipes.expr1 + "' : '" + $scope.pipes.expr2 + "')}\");" + newLine;
                } else if ($scope.pipes.action == 'mkdir'){
                    outputParam += "pipeBuilder.mkdir(\"" + $scope.pipes.folder + "\")" + newLine;
                }
            }
            
            outputParam += "pipeBuilder.run();";

            $scope.pipes.java = decodeURIComponent(outputParam);
        }
    }]);

/*
$(function(){
    $(".node_type_dropdown").selectize({
        plugins: ['typing_mode'],
        persist: false,
        sortField: 'text'
    });
});
*/