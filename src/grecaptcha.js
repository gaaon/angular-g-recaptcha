var $greMinErr = minErr('$grecaptcha');

/**
 * @ngdoc object
 * 
 * @name wo.grecaptcha.$grecaptchaProvider
 * @requires wo.grecaptcha.$greLanguageCodes
 * 
 * 
 * @description 
 * grecaptcha provider 
 * 
 **/
function $grecaptchaProvider($greLanguageCodes) {
    
    var _grecaptcha                 // grecaptcha Object
    ,   _languageCode               // languageCode value
    ,   _scriptTag                  // tag that contains recaptcha script
    ,   _scriptLoadTimeout = 5000   // miliseconds of load time out
    ,   self = this                 // this reference
    ,   init_promise = undefined    // a promise of init method                 
                
    // method name of recaptcha script callback
    ,   _onLoadMethodName = "onRecaptchaApiLoaded"
    
    // parameter Object
    ,   _parameters = {     
        sitekey             : undefined
    ,   theme               : 'light'
    ,   type                : 'image'
    ,   size                : 'normal'
    ,   tabindex            : 0
    ,   callback            : function(){}
    ,   'expired-callback'  : function(){}
    };
    
     
    /**
     * @private
     * @description
     * Set value to key of target which defaults to _parameters
     * 
     * The purpose of this method is not just to set value 
     * but also to validate the given key and value
     * 
     * @exapmple
     * setLanguageCode('ko')                // can set languageCode of _parameters
     * 
     * setLanguageCode('ko', {})            // can validate whether given 'ko' is right languageCode or not
     * 
     * setLanguageCode('ko', myVariable)    // can also set value of not _parameters but myVariable
     * 
     * @param {string=} key property name
     * @param {*=} value property value
     * @param {Object} target the target which be set key and value
     * @returns {Object} self
     */
    function setValue(key, value, target) {
        if( target === void 0 ) {
            _parameters[key] = value;
        }
        else {
            target[key] = value;
        }
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setSitekey
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description 
     * Set a default sitekey of recaptcha box with 'sitekey'.
     * Can't validate the sitekey yet.
     * 
     * @param {string} sitekey new default sitekey
     * @return {Object} self
     */
    this.setSitekey = function(sitekey){
        // TODO How can validate sitekey?
        
        //set phase
        setValue('sitekey', sitekey, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setTheme
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description 
     * Set a default theme of recaptcha box with 'theme'
     * and validate whether 'theme' is in correct candidates.
     * 
     * @param {string} theme new default theme
     * @returns {Object} self
     */
    this.setTheme = function(theme){
        //validate phase
        var themes = ['dark', 'light'];
        
        if( angular.isString(theme) ) {
            theme = angular.lowercase(theme);
        }
        
        if( themes.indexOf(theme) === -1 ) {
            throw new $greMinErr('badtheme', 'A theme has to be one of {0}.', themes);
        }
        
        //set phase
        setValue('theme', theme, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setType
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default type of recaptcha box with 'type'
     * and validate whether 'type' is in correct candidates or not.
     * 
     * @param {string} type new default type
     * @returns {Object} self
     */
    this.setType = function(type) {
        //validate phase
        var types = ['audio', 'image'];
        
        if( angular.isString(type) ) {
            type = angular.lowercase(type);
        }
        
        if( types.indexOf(type) === -1 ) {
            throw new $greMinErr('badtype', 'A type has to be one of {0}.', types);
        }
        
        //set phase
        setValue('type', type, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setSize
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default size of recaptcha box with 'size'
     * and validate whether 'size' is in correct candidates or not.
     * 
     * @param {string} size new default size
     * @returns {Object} self
     */
    this.setSize = function(size) {
        //validate phase
        var sizes = ['compact', 'normal'];
        
        if( angular.isString(size) ) {
            size = angular.lowercase(size);
        }
        
        if( sizes.indexOf(size) === -1 ) {
            throw new $greMinErr('badsize', 'A size has to be one of {0}.', sizes);
        }
        
        //set phase
        setValue('size', size, arguments[1]);
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setTabindex
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default tabindex of recaptcha box with 'tabindex'
     * and validate whether 'tabindex' is number or not.
     * 
     * @param {number} tabindex new default tabindex
     * @returns {Object} self
     */
    this.setTabindex = function(tabindex) {
        //validate phase
        if( !angular.isNumber(tabindex) ) {
            throw new $greMinErr('badtabindex', 'A tabindex has to be a number.');
        }
        
        //set phase
        setValue('tabindex', tabindex, arguments[1]);
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setCallback
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default callback which will be called after recaptcha confirm
     * and validate if 'callback' is function.
     * 
     * @param {Function} callback new default callback
     * @returns {Object} self
     */
    this.setCallback = function(callback) {
        //validate phase
        if( !angular.isFunction(callback) ) {
            throw new $greMinErr('badcallback', 'A callback has to be a function.');
        }
        
        //set phase
        setValue('callback', callback, arguments[1]);
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setExpiredCallback
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set expired-callback which will be called when recaptcha be expired
     * and validate if 'expired-callback' is function.
     * 
     * @param {Function} expiredCallback new default expired-callback
     * @returns {Object} self
     */
    this.setExpiredCallback = function(expiredCallback) {
        //validate phase
        if( !angular.isFunction(expiredCallback) ) {
            throw new $greMinErr('badexpcallback', 'A expired-callback has to a function.');
        }
        
        //set phase
        setValue('expired-callback', expiredCallback, arguments[1]);
        
        return self;
    }
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setLanguageCode
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default languageCode of recaptcha box with 'languageCode'
     * and validate whether 'languageCode' is in greLanguageCodes or not.
     * 
     * @param {string} languageCode new languageCode
     * @returns {Object} self
     */
    this.setLanguageCode = function(languageCode){
        if( greLanguageCodes[languageCode] === void 0 ) {
            throw new $greMinErr('badlan', "The languageCode is invalid.", languageCode);
        }
        
        _languageCode = languageCode;
        
        return self;
    }
    
    
    /**
     * @private
     * @description
     * Generate camelCase with given snakeCase
     * (eg. 'camel-case' -> 'camelCase', 'ca-mel-case' -> 'caMelCase')
     * 
     * @param {string} str string to convert
     * @returns {string} result of converting
     */
    function camelCase(str) {
        return str.split('-').reduce(function(pre, cur){
            pre += cur.charAt(0).toUpperCase()+cur.slice(1);
            return pre;
        });
    }
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setParameters
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set default parameters of recaptcha box with given arguments
     * by using above setting/validating functions.
     * 
     * @param {Object} params new default params
     * @returns {Object} self
     */
    this.setParameters = function(params){
        var arg = arguments;
        
        angular.forEach(params, function(value, key) {
            key = camelCase('set-'+key);
            if( !!self[key] ) {
                self[key](value, arg[1]);
            }
        });
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setOnLoadMethodName
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set onLoadMethodName used as recaptcha script loaded method name
     * 
     * @param {string} onLoadMethodName new methodname
     * @returns {Object} self
     */
    this.setOnLoadMethodName = function(onLoadMethodName){
        _onLoadMethodName = onLoadMethodName;
        
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setGrecaptcha
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * 
     * @description
     * Set grecaptcha object with 'grecaptcha'
     * 
     * It's dangerous to insert a custom grecaptcha object.
     */
    this.setGrecaptcha = function(grecaptcha) {
        _grecaptcha = grecaptcha;
        
        return self;
    }
    
    
    /**
     * @private
     * @description
     * Create script tag containing recaptcha script 
     * and register onload callback 
     * so that init grecaptcha Object
     */
    function createScript($document){
        var src = "//www.google.com/recaptcha/api.js?render=explicit&"
                +"onload="+_onLoadMethodName
                +(_languageCode ? "&hl="+_languageCode : "");
            
        var option = {
            type    : "text/javascript"
        ,   async   : true
        ,   defer   : true
        ,   src     : src
        };
        
        _scriptTag = angular.extend($document[0].createElement('script'), option);
        
        $document[0].querySelector('head').appendChild(_scriptTag);
        
        return _scriptTag;
    }
    
    
    
    this.$get = function($q, $window, $rootScope, $document, $timeout){
        var greList = {};
        var map = {};
        
        
        /**
         * @private
         * @description
         * Get reference from private map object to maintain encapsulization.
         * If not exists, generate it and insert.
         */
        function _private(target) {
            if( map[target] === void 0 ) {
                map[target] = new Object();
            }
            return map[target];
        }
        
        
        /**
         * @private
         * @description
         * Delete 'target' from private map object.
         */
        function delete_private(target) {
            if( map[target] !== void 0 ) {
                delete map[target];
            }
        }
        
        /**
         * @ngdoc object
         * 
         * @name wo.grecaptcha.$grecaptcha.gre
         * 
         * 
         * @description
         * Grecaptcha instance that contains parameters and element, wigetId, etc.
         * 
         * @param {Object=} param gre instance's parameters
         */
        function gre(param){
            var _config = angular.copy(_parameters);
            
            //validating param
            self.setParameters(param || {}, _config);
            
            
            //setting _config
            _private(this)._config = _config;
        }
        
        
        
        /**
         * @ngdoc service
         * 
         * @name wo.grecaptcha.$grecaptcha
         * @description
         * grecaptcha service
         * 
         */
        function $grecaptcha(param){
            if( angular.isNumber(param) ) {
                if( greList[param] === void 0 ) {
                    throw new $greMinErr('nogre', 'There is no gre which has wiget_id {0}', param);
                }
                return greList[param];
            }
            
            else if( angular.isUndefined(param) || angular.isObject(param) ) {
                return new gre(param);
            }
            
            else {
                throw new $greMinErr('badconf', 'Grecaptcha configuration must be a number or object.');
            }
        }
        
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha#getLanguage
         * @methodOf wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Return current languageCode.
         * 
         * @returns {string} the languageCode
         */
        $grecaptcha.getLanguageCode = function(){
            return _languageCode;
        };
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha#getOnLoadMethodName
         * @methodOf wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Return current onLoadMethodName.
         * 
         * @returns {string} the onLoadMetethodName
         */
        $grecaptcha.getOnLoadMethodName = function(){
            return _onLoadMethodName;
        };
        
        
        return $grecaptcha;
    }
}