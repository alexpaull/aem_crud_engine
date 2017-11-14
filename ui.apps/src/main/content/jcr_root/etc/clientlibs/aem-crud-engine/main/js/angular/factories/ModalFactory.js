angular.module("ModalModule",[])
    .factory("modalFactory",["$http", "ModalService", function($http, ModalService){

        var modalFactory = {
            getModalHtml : function ($url){
                return $http({
                    url: $url,
                    method: 'GET',
                    cache: true
                });
            },
            triggerModal: function($url, $controller, $pass){

                modalFactory.getModalHtml($url).success(function (response) {
                    var contents = angular.element("<div>").html(response).find("#OverlayContainer");
                    ModalService.showModal({
                        template: contents[0].innerHTML,
                        controller: $controller,
                        inputs: {
                            pass: $pass
                        }
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) { /* NA */ });
                    });
                }).error(function (error) {
                    console.log(error);
                    // Modal HTML does not exist
                });
            }

        };

        return modalFactory;
    }]);