widgetService = {};
widgetService.slingTreeLoader = new CQ.tree.SlingTreeLoader({
    baseAttrs: {
        singleClickExpand: true
    }
});
widgetService.setSlingTreeLoader = function ($rootPath, $id, $path) {
    // provide a path selector field with a repository browse dialog
    CQ.Ext.onReady(function () {
        var w = new CQ.form.PathField({
            applyTo: $id,
            renderTo: "CQ",
            rootPath: $rootPath,
            predicate: "hierarchy",
            hideTrigger: false,
            showTitlesInTree: false,
            name: $id + "Tree",
            value: $path,
            width: 300,
            treeLoader: widgetService.slingTreeLoader,
            listeners: {
                render: function () {
                    this.wrap.anchorTo($id, "tl");
                },
                change: function (fld, newValue, oldValue) {
                    // update to check if element is in data-ng-controller container, then if it is gets the ng-model on the element and routes to the scope[ng-model]
                    var $element = $("#" + $id);
                    var $controller = $element.closest("[data-ng-controller]");
                    if ($controller.length > 0) {
                        var $scope = angular.element($controller).scope();
                        var prop = $element.attr("data-ng-model");
                        if (prop){
                            var props = prop.split(".");
                            $scope.$apply(function () {
                                $scope[props[0]][props[1]] = newValue;
                            });
                        }
                    }
                    document.getElementById($id).value = newValue;
                },
                dialogselect: function (fld, newValue) {
                    var $element = $("#" + $id);
                    var $controller = $element.closest("[data-ng-controller]");
                    if ($controller.length > 0) {
                        var $scope = angular.element($controller).scope();
                        var prop = $element.attr("data-ng-model");
                        if (prop){
                            var props = prop.split(".");
                            $scope.$apply(function () {
                                $scope[props[0]][props[1]] = newValue;
                            });
                        }
                    }
                    document.getElementById($id).value = newValue;
                }
            }
        });
    });
};
