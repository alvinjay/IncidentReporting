(function(angular){
    'use strict';

    angular
        .module('App')
        .service('ObjectHelper', ObjectHelper);

    function ObjectHelper(){
        var services = {
            /*
             *  Returns true if the object is an element of the list
             *  @params: obj - Object
             *  @params: list - Array
             */
            isObjectInArray: function isObjectInArray(obj, list){
                for (var i = 0; i < list.length; i++) {
                    if (list[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            /*
             * Returns an object's length
             * params: obj - Object
             */
            getObjectLength: function getObjectLength(obj){
                return Object.keys(obj).length;
            },
            /**
             * Retrieves object element from array based on key
             * @param key - Object identifier
             * @param list
             * @returns {*} - Object element or null
             */
            getObjectFromArray: function getObjectFromArray(key, list){
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].$id === key)
                    {
                        return list[i];
                    }
                }
                return null;
            },
            /**
             * Removes the object from the array
             * @param obj
             * @param list
             */
            removeObjectFromArray: function removeObjectFromArray(obj, list) {
                console.log(obj);
                list.splice(list.indexOf(obj), 1);
            },
            /**
             * Checks if key corresponds to an object in the array
             * @param key - Object identifier
             * @param list
             * @returns {boolean}
             */
            isKeyInArray: function isKeyInArray(key, list){
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i].$id === key)
                    {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Copies all properties of Object1 to Object2 and returns Object2
             * @param obj1 - copy from
             * @param obj2 - copy to
             * @returns {*}
             */
            copyObjectProperties: function copyObjectProperties(obj1, obj2){
                for(var k in obj1)
                    obj2[k]=obj1[k];
            }
        }

        return services;
    }

})(window.angular);