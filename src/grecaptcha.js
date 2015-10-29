var $greMinErr = minErr('$grecaptcha');

/**
 * @ngdoc provider
 * @name $grecaptchaProvider
 * @description 
 * $grecaptcha provider for pre set sitekey, theme, language code, etc
 * 
 * @param greLanguageCodes a constant about language code table
 **/
function $grecaptchaProvider(greLanguageCodes) {
    
    var _grecaptcha         // grecaptcha object
    ,   _languageCode       // languageCode value
    ,   _onLoadMethodName = "onRecaptchaApiLoaded"  // method name of recaptcha script callback
    ,   _scriptTag          // a tag that contains recaptcha script
    ,   _scriptLoadTimeout = 3000
    ,   self = this
    
    ,   _parameters = {     // parameter object
        sitekey             : undefined
    ,   theme               : 'light'
    ,   type                : 'image'
    ,   size                : 'normal'
    ,   tabindex            : 0
    ,   callback            : undefined
    ,   'expired-callback'  : undefined
    };
    
    
    function setValue(key, value, target) {
        if( target == void 0 ) {
            _parameters[key] = value;
        }
        else {
            target[key] = value;
        }
        
        return self;
    }
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setSitekey
     * @description 
     * Set sitekey of recaptcha box with given argument.
     * Don't have an ability to validate to identify the sitekey.
     * 
     * @param {string=} sitekey new sitekey
     * @returns {Object} this reference
     */
    this.setSitekey = function(sitekey){
        // TODO How can validate sitekey?
        // it looks difficult to check in front-end..
        
        
        //set phase
        setValue('sitekey', sitekey, arguments[1]);
        return self;
    };
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setTheme
     * @description 
     * Set theme of recaptcha box with given argument
     * and validate whether provided theme is in ['dark', 'light'];
     * 
     * @param {string=} new theme
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setType
     * @description
     * Set type of recaptcha box with given arugment
     * and validate whether provided type is in ['audio', 'image'] or not.
     * 
     * @param {string=} new type
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setSize
     * @description
     * Set size of recaptcha box with given arugment
     * and validate whether given size is in ['compact', 'normal'] or not.
     * 
     * @param {string=} size new size
     * @returns {Object} this reference
     */
    this.setSize = function(size) {
        var sizes = ['compact', 'normal'];
        
        if( angular.isString(size) ) {
            size = angular.lowercase(size);
        }
        
        if( sizes.indexOf(size) === -1 ) {
            throw new $greMinErr('badsize', 'A size has to be one of {0}.', sizes);
        }
        
        setValue('size', size, arguments[1]);
        return self;
    }
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setTabindex
     * @description
     * Set tabindex of recaptcha box with given argument
     * and validate whether provided tabindex is number or not.
     * 
     * @param {number=} tabindex new tabindex
     * @returns {Object} this reference
     */
    this.setTabindex = function(tabindex) {
        if( !angular.isNumber(tabindex) ) {
            throw new $greMinErr('badtabindex', 'A tabindex has to be a number.');
        }
        
        setValue('tabindex', tabindex, arguments[1]);
        return self;
    }
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setCallback
     * @description
     * Set callback which will be called after recaptcha confirm
     * and validate if given callback is function.
     * 
     * @param {function=} callback new callback
     * @returns {Object} this reference
     */
    this.setCallback = function(callback) {
        if( !angular.isFunction(callback) ) {
            throw new $greMinErr('badcallback', 'A callback has to be a function.');
        }
        
        setValue('callback', callback, arguments[1]);
        return self;
    }
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setCallback
     * @description
     * Set callback which will be called when recaptcha be expired
     * and validate if given expired callback is function.
     * 
     * @param {function=} expiredCallback new expired-callback
     * @returns {Object} this reference
     */
    this.setExpiredCallback = function(expiredCallback) {
        if( !angular.isFunction(expiredCallback) ) {
            throw new $greMinErr('badexpcallback', 'A expired-callback has to a function.');
        }
        
        setValue('expired-callback', expiredCallback, arguments[1]);
        return self;
    }
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setLanguageCode
     * @description
     * Set languageCode of recaptcha box with given argument
     * and validate whether provided languageCode is in greLanguageCodes or not.
     * 
     * @param {string=} languageCode new languageCode
     * @returns {Object} this reference
     */
    this.setLanguageCode = function(languageCode){
        if( greLanguageCodes[languageCode] == void 0 ) {
            throw new $greMinErr('badlan', "The languageCode is invalid.", languageCode);
        }
        
        _languageCode = languageCode;
        return self;
    }
    
    
    function camelCaseWithSet(str) {
        str = 'set-'+str;
        return str.split('-').reduce(function(pre, cur){
            pre += cur.charAt(0).toUpperCase()+cur.slice(1);
            return pre;
        });
    }
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setParameters
     * @description
     * Set parameters of recaptcha box with given arguments
     * by using above set/validating functions.
     * 
     * @param {Object=} params new params
     * @returns {Object} this reference
     */
    this.setParameters = function(params){
        angular.forEach(params, function(value, key) {
            key = camelCaseWithSet(key);
            if( !!self[key] ) {
                self[key](value, arguments[1]);
            }
        });
        return self;
    }
    
    
    
    /**
     * @ngdoc function
     * @name $grecaptchaProvider#setOnLoadMethodName
     * @description
     * Set onLoadMethodName which be used as callback name when script loaded
     * 
     * @param {string=} onLoadMethodName new methodname
     * @returns {Object} this reference
     */
    this.setOnLoadMethodName = function(onLoadMethodName){
        _onLoadMethodName = onLoadMethodName;
        return self;
    }
    
    
    
    /**
     * @private
     * @description
     * Create script tag containing recaptcha script 
     * and register onload callback 
     * so that init grecaptcha object
     */
    function createScript($document){
        var src = "//www.google.com/recaptcha/api.js?render=explicit&onload="+_onLoadMethodName
                +(_languageCode ? "&hl="+_languageCode : "");
            
        var option = {
            type    : "text/javascript"
        ,   async   : true
        ,   defer   : true
        ,   src     : src
        };
        
        var scriptTag = angular.extend($document[0].createElement('script'), option);
        
        $document[0].querySelector('head').appendChild(scriptTag);
        
        return scriptTag;
    }
    
    this.$get = function($q, $window, $rootScope, $document, $timeout){
        function $grecaptcha(){
            var _self = this;
            
            
            this.init = function(callback){
                if( !!_grecaptcha ) {
                    return $q.resolve();
                }
                
                return $q(function(resolve, reject) {
                    // TODO add timeout function to reject if script loading time is over..
                    
                    $window[_onLoadMethodName] = function(){
                        $rootScope.$apply(function(){
                            (callback || angular.noop)();
                            _grecaptcha = $window.grecaptcha;
                            resolve();
                        });
                    };
                    
                    createScript($document);
                });
            };
            
            
            this.render = function(el, onInit){
                if( !angular.isElement(el) ) {
                    throw new $greMinErr('badel', 'The element is invalid.');
                }
                
                if( !_parameters.sitekey ) {
                    throw new $greMinErr('nositekey', 'The sitekey has to be provided.');
                }
                
                var promise = !!_grecaptcha ? $q.resolve() : _self.init(onInit);
                
                return promise.then(function(){
                    return _grecaptcha.render(el, _parameters);
                });
            };
            
            
            this.getGrecaptcha = function(){
                return _grecaptcha;
            };
            
            var properties = ['onLoadMethodName', 'sitekey', 'theme', 'type', 'size', 'tabindex', 'callback',
                'expired-callback'];
            
            angular.forEach(properties, function(prop, index){
                var methodName = camelCaseWithSet(prop);
                _self[methodName] = function(param) {
                    self[methodName](param);
                    return _self;
                };
            });
        }
        
        return new $grecaptcha;
    }
}