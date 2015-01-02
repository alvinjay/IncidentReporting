(function(){
    'use strict';

    angular
        .module('App')
        .service('CameraService', CameraService);

    CameraService.$inject = ['$cordovaCamera'];

    function CameraService($cordovaCamera){

        return {
            takePicture: function takePicture(Camera){
                    var options = {
                        quality : 50,
                        destinationType : Camera.DestinationType.DATA_URL,
                        sourceType : Camera.PictureSourceType.CAMERA,
                        allowEdit : true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 600,
    //                    targetWidth: 2048,
                        targetHeight: 480,
    //                    targetHeight: 1536,
                        correctOrientation: true,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };
                    return $cordovaCamera.getPicture(options)
            }
        }
    };
})(window.angular);