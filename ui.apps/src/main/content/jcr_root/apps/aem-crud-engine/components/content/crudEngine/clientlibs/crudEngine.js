angular.module("CRUDEngineCtrl",[])
    .controller("crudEngineCtrl",["$scope", "modalFactory", function($scope, modalFactory){

        $scope.pipes = {};

        // init values for engine
        $scope.pipes.path_operation = 'recursive';
        $scope.pipes.action = 'none';
        $scope.pipes.property_operation = 'none';
        $scope.pipes.node = "*";
        $scope.pipes.node_operation = 'none';

        $scope.run = function(){
            crudEngine.runQuery(getServletRequest());
        };

        // run to initialize content finder for path
        $scope.initTreeLoader = function(){
            widgetService.setSlingTreeLoader("/", "path", "/");
        };

        $scope.getXpathResults = function(){
            crudEngine.xpathQuery($scope.pipes.query, function(response){
                if (response && response.responseText){
                    var query_result = JSON.parse(response.responseText);
                    var $pass = {
                        "results": query_result,
                        "query": $scope.pipes.query
                    }

                    modalFactory.triggerModal("/etc/crud-engine/overlay.html", "overlayCtrl", $pass);
                }
            });
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
            'pipes.node_type'
        ], function(){
            updateInputFromPipes();
        });

        $scope.$watchGroup([
            'pipes.action',
            'pipes.find',
            'pipes.replace',
            'pipes.folder',
            'pipes.write',
            'pipes.condition',
            'pipes.action_property'
        ], function(){
            updateOutputFromPipes();
        });

        function getServletRequest(){
            return "?path=" + $scope.pipes.path + "&xpath=" + $scope.pipes.query + "&" + $scope.pipes.output + getFlagsFromPipes();
        }

        function updateInputFromPipes(){
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
                    xpath += "element(" + $scope.pipes.node + ")";
                } else if ($scope.pipes.node_operation == 'type') {
                    xpath += "element(*," + $scope.pipes.node_type + ")";
                } else {
                    xpath += "element(" + $scope.pipes.node + "," + $scope.pipes.node_type + ")";
                }
            }

            // adding property to xpath
            if ($scope.pipes.property_operation == 'none'){
                // do nothing
            } else if ($scope.pipes.property_operation == 'exists'){
                xpath += "[@" + $scope.pipes.property + "]";
            } else if ($scope.pipes.property_operation == 'equals'){
                xpath += "[@" + $scope.pipes.property + " = " + $scope.pipes.property_value + "]";
            } else if ($scope.pipes.property_operation == 'unequals'){
                xpath += "[@" + $scope.pipes.property + " != '" + $scope.pipes.property_value + "']";
            } else {
                // contains
                if ($scope.pipes.property && $scope.pipes.property_value){
                    xpath += "[jcr:contains(@" + $scope.pipes.property + ",'" + $scope.pipes.property_value + "')]";
                } else if ($scope.pipes.property_value){
                    xpath += "[jcr:contains(.,'" + $scope.pipes.property_value + "')]";
                }
            }

            $scope.pipes.query = xpath;
        }

        function getFlagsFromPipes(){
            var flags = "";

            if ($scope.pipes.parent) {
                flags += "&parent=" + $scope.pipes.parent;
            }
            if ($scope.pipes.package){
                flags += "&package=" + $scope.pipes.package;
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

                } else if ($scope.pipes.action == 'mkdir'){
                    outputParam += "folder=" + $scope.pipes.folder;
                }
            }

            $scope.pipes.output = outputParam;
        }
    }]);

$(function(){
    $(".node_type_dropdown").selectize({
        plugins: ['typing_mode'],
        persist: false,
        sortField: 'text'
    });
});