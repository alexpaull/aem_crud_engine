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
                    document.getElementById($id).value = newValue;
                },
                dialogselect: function (fld, newValue) {
                    document.getElementById($id).value = newValue;
                }
            }
        });
    });
};
