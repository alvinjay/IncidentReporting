(function(angular){
    'use strict';

    angular
        .module('App')
        .service('HashHelper', HashHelper);

    function HashHelper(){
        var options = { outputLength: 256 };

        var services = {
            /**
             * SHA-3 encryption for a word. Every word is followed by a \n
             * @param word - string to be hashed
             * @returns {*|string}
             * @constructor
             */
            SHA3: function SHA3(word) {
                var hashedObject = CryptoJS.SHA3(word,options);
                return hashedObject.toString();
            },
            /**
             * SHA-3 encryption for list of words. Every word is followed by a \n
             * @param list - array of strings to be hashed
             * @returns {*|string}
             * @constructor
             */
            SHA3List: function SHA3List(list) {
                var toBeHashed = '';
                for (var i = 0; i < list.length; i++)
                {
                    toBeHashed = toBeHashed + list[i] + '\n';
                }

                var hashedObject = CryptoJS.SHA3(toBeHashed,options);

                return hashedObject.toString();
           },
            /**
             * Compares two words if equal (for passwords)
             * @param a
             * @param b
             * @returns {boolean}
             * @constructor
             */
           SHA3Compare: function SHA3Compare(a,b){
                var hashedObjectA = CryptoJS.SHA3(a,options);
                var hashedObjectB = CryptoJS.SHA3(b,options);

                if (hashedObjectA.toString() === hashedObjectB)
                    return true;
                return false;
           }
        }

        return services;
    }

})(window.angular);