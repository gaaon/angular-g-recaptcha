/**
 * @name angular-g-recaptcha
 * @version v2.0.0
 * @author Taewoo Kim xodn4195@gmail.com
 * @license MIT
 */
(function(window, angular){

/**
 * Checks if `obj` is a scope object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a scope obj.
 * 
 * @from angular source code
 */
function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}

/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 * 
 * @from angular source code
 */
function isWindow(obj) {
  return obj && obj.window === obj;
}

function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value &&  document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}


function serializeObject(obj) {
  var seen = [];

  return JSON.stringify(obj, function(key, val) {
    val = toJsonReplacer(key, val);
    if (angular.isObject(val)) {

      if (seen.indexOf(val) >= 0) return '...';

      seen.push(val);
    }
    return val;
  });
}

function toDebugString(obj) {
  if (typeof obj === 'function') {
    return obj.toString().replace(/ \{[\s\S]*$/, '');
  } else if (angular.isUndefined(obj)) {
    return 'undefined';
  } else if (typeof obj !== 'string') {
    return serializeObject(obj);
  }
  return obj;
}


/***
 * @from angularjs source code for error handler
 **/
function minErr(module, ErrorConstructor) { // from angularjs source code
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var SKIP_INDEXES = 2;

    var templateArgs = arguments,
      code = templateArgs[0],
      message = '[' + (module ? module + ':' : '') + code + '] ',
      template = templateArgs[1],
      paramPrefix, i;
    
    message += template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1),
        shiftedIndex = index + SKIP_INDEXES;

      if (shiftedIndex < templateArgs.length) {
        return toDebugString(templateArgs[shiftedIndex]);
      }

      return match;
    });
    
    // don't need not yet, but may need someday..
    
    // message += '\nhttp://errors.angularjs.org/1.4.7/' +
    //   (module ? module + '/' : '') + code;

    // for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
    //   message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
    //     encodeURIComponent(toDebugString(templateArgs[i]));
    // }

    return new ErrorConstructor(message);
  };
}


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
     * setLanguageCode('ko', {})            // can validate whether given 'kr' is right languageCode or not
     * 
     * setLanguageCode('ko', myVariable)    // can also set value of not _parameters but myVariable
     * 
     * @param {string=} key property name
     * @param {*=} value property value
     * @param {Object} target the target which be set key and value
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setTabindex
     * @description
     * Set tabindex of recaptcha box with given argument
     * and validate whether provided tabindex is number or not.
     * 
     * @param {number=} tabindex new tabindex
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setCallback
     * @description
     * Set callback which will be called after recaptcha confirm
     * and validate if given callback is function.
     * 
     * @param {function=} callback new callback
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setCallback
     * @description
     * Set callback which will be called when recaptcha be expired
     * and validate if given expired callback is function.
     * 
     * @param {function=} expiredCallback new expired-callback
     * @returns {Object} this reference
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
     * @name $grecaptchaProvider#setLanguageCode
     * @description
     * Set languageCode of recaptcha box with given argument
     * and validate whether provided languageCode is in greLanguageCodes or not.
     * 
     * @param {string=} languageCode new languageCode
     * @returns {Object} this reference
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
     * @param {string=} str string to convert
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
     * @name $grecaptchaProvider#setParameters
     * @description
     * Set parameters of recaptcha box with given arguments
     * by using above set/validating functions.
     * 
     * @param {Object=} params new params
     * @returns {Object} this reference
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
    
    
    
    this.$get = ["$q", "$window", "$rootScope", "$document", "$timeout", function($q, $window, $rootScope, $document, $timeout){
        function $grecaptcha(){
            var _self = this;
            
            
            /**
             * @ngdoc function
             * @name $grecaptcha#init
             * @description
             * Set _grecaptcha object from $window after recaptcha script loaded if undefined.
             * 
             * By returning a promise which be resolved on script loaded, 
             * can check whether _grecaptcha initialization is over or not.
             * 
             * @param {function=} a callback performed after initialization is finished
             * @returns {Object} a promise 
             */
            this.init = function(callback){
                if( !!_grecaptcha ) {
                    return $q.resolve();
                }
                return $q(function(resolve, reject) {
                    // TODO add timeout function to reject if script loading time is over..
                    
                    $window[_onLoadMethodName] = function(){
                        $rootScope.$apply(function(){
                            (callback || angular.noop)();
                            _self.setGrecaptcha($window.grecaptcha);
                            resolve();
                        });
                    };
                    
                    createScript($document);
                });
            };
            
            
            
            /**
             * @ngdoc function
             * @name $grecaptcha#render
             * @description
             * Render a recaptcha box in el parameter.
             * If el is not a element or there's no sitekey, errors will be thrown.
             * 
             * @param {Object|string=} el the element string or object
             * @param {function=} onInit a callback to be executed when init method is being done
             * @returns a promise about init
             */
            this.render = function(el, onInit){
                if( !angular.isElement(el) ) {
                    throw new $greMinErr('badel', 'The element is invalid.');
                }
                if( !_parameters.sitekey ) {
                    throw new $greMinErr('nositekey', 'The sitekey has to be provided.');
                }
                
                var promise = _self.init(onInit);
                
                return promise.then(function(){
                    
                    // TODO I don't like this logic
                    // want to change it more gracefully
                    
                    var paramCopy = angular.copy(_parameters);
                    
                    paramCopy['callback'] = function(response){
                        $rootScope.$apply(function(){
                            (_parameters.callback || angular.noop)(response);
                        });
                    }
                    
                    
                    paramCopy['expired-callback'] = function(){
                        $rootScope.$apply(function(){
                            (_parameters['expired-callback'] || angular.noop)();
                        })
                    }
                    
                    
                    return _grecaptcha.render(el, paramCopy);
                });
            };
            
            // TODO will fill reset function someday..
            this.reset = function(widget_id){
                _grecaptcha.reset(widget_id);
                
                return _self;
            };
            
            // TODO will fill getResponse function someday also..
            this.getResponse = function(widget_id){};
            
            
            /** 
             * @ngdoc function
             * @name $grecaptcha#getGrecaptcha
             * @description
             * Getter for private _grecaptcha object.
             * 
             * @returns private _grecaptcha object
             */
            this.getGrecaptcha = function(){
                return _grecaptcha;
            };
            
            
            /**
             * @ngdoc function
             * @name $grecaptcha#setGrecaptcha
             * Setter for private _grecaptcha object.
             * 
             * Allow set custom grecaptcha object so that give more flexiblity
             * 
             * @param grecaptcha new grecaptcha object
             * @returns this service reference
             */
            this.setGrecaptcha = function(grecaptcha){
                _grecaptcha = grecaptcha;
                return _self;
            };
            
            var properties = ['onLoadMethodName', 'sitekey', 'theme', 'type', 'size', 
                'tabindex', 'callback', 'expired-callback', 'languageCode'];
            
            // setter loop
            angular.forEach(properties, function(prop, index){
                var methodName = camelCase('set-'+prop);
                _self[methodName] = function(param) {
                    self[methodName](param, arguments[1]);
                    return _self;
                };
            });
            
            
            /**
             * @ngdoc function
             * @name $grecaptcha#setParameters
             * Check setter of _self and call it if exists
             * 
             * @param params the new parameters
             * @returns this service reference
             */
            this.setParameters = function(params){
                var arg = arguments;
                angular.forEach(params, function(value, key){
                    key = camelCase('set-'+key);
                    
                    if( !!_self[key] ) {
                        _self[key](value, arg[1]);
                    }
                });
                
                return _self;
            }
            
            // getter loop
            angular.forEach(properties, function(prop, index){
                var methodName = camelCase('get-'+prop);
                _self[methodName] = function(param) {
                    if( prop === 'onLoadMethodName' ) {
                        return _onLoadMethodName;
                    }
                    else if( prop === 'languageCode' ) {
                        return _languageCode;
                    }
                    else {
                        return _parameters[prop];
                    }
                };
            });
        }
        
        return new $grecaptcha;
    }]
}
$grecaptchaProvider.$inject = ["greLanguageCodes"];


/***
 * @ngdoc constant
 * @name greLanguageCodes
 * @description available language codes
 **/
var greLanguageCodes = {
    "ar"        : "Arabic"
,   "af"        : "Afrikaans"
,   "am"        : "Amharic"
,   "hy"        : "Armenian"
,   "az"        : "Azerbaijani"
,   "eu"        : "Basque"
,   "bn"        : "Bengali"
,   "bg"        : "Bulgarian"
,   "ca"        : "Catalan"
,   "zh-HK"     : "Chinese (Hong Kong)"
,   "zh-CN"     : "Chinese (Simplified)"
,   "zh-TW"     : "Chinese (Traditional)"
,   "hr"        : "Croatian"
,   "cs"        : "Czech"
,   "da"        : "Danish"
,   "nl"        : "Dutch"
,   "en-GB"     : "English (UK)"
,   "en"        : "English (US)"
,   "et"        : "Estonian"
,   "fil"       : "Filipino"
,   "fi"        : "Finnish"
,   "fr"        : "French"
,   "fr-CA"     : "French (Canadian)"
,   "gl"        : "Galician"
,   "ka"        : "Georgian"
,   "de"        : "German"
,   "de-AT"     : "German (Austria)"
,   "de-CH"     : "German (Switzerland)"
,   "el"        : "Greek"
,   "gu"        : "Gujarati"
,   "iw"        : "Hebrew"
,   "hi"        : "Hindi"
,   "hu"        : "Hungarain"
,   "is"        : "Icelandic"
,   "id"        : "Indonesian"
,   "it"        : "Italian"
,   "ja"        : "Japanese"
,   "kn"        : "Kannada"
,   "ko"        : "Korean"
,   "lo"        : "Laothian"
,   "lv"        : "Latvian"
,   "lt"        : "Lithuanian"
,   "ms"        : "Malay"
,   "ml"        : "Malayalam"
,   "mr"        : "Marathi"
,   "mn"        : "Mongolian"
,   "no"        : "Norwegian"
,   "fa"        : "Persian"
,   "pl"        : "Polish"
,   "pt"        : "Portuguese"
,   "pt-BR"     : "Portuguese (Brazil)"
,   "pt-PT"     : "Portuguese (Portugal)"
,   "ro"        : "Romanian"
,   "ru"        : "Russian"
,   "sr"        : "Serbian"
,   "si"        : "Sinhalese"
,   "sk"        : "Slovak"
,   "sl"        : "Slovenian"
,   "es"        : "Spanish"
,   "es-419"    : "Spanish (Latin America)"
,   "sw"        : "Swahili"
,   "sv"        : "Swedish"
,   "ta"        : "Tamil"
,   "te"        : "Telugu"
,   "th"        : "Thai"
,   "tr"        : "Turkish"
,   "uk"        : "Ukrainian"
,   "ur"        : "Urdu"
,   "vi"        : "Vietnamese"
,   "zu"        : "Zulu"
};


function grecaptchaDirective($grecaptcha, $parse, $q, $document){
    var directiveDefinitionObject = {
        strict: 'A',
        require: '^ngModel',
        link: function(scope, el, attr, ngModelCtrl){
            var param = $parse(attr['grecaptcha'] || '{}')(scope);
            
            $grecaptcha.setParameters(param);
            
            var cb = angular.copy($grecaptcha.getCallback() || angular.noop);
            
            $grecaptcha.setCallback(function(res){
                cb(res);
                ngModelCtrl.$setViewValue(res);
            });
            
            scope.promise = $grecaptcha.init().then(function(){
                el.empty();
                return $grecaptcha.render(el[0]);
            });
            
            scope.$on('$destroy', function(){
                angular.element($document[0].querySelector('.pls-container')).remove();
            });
        }
    };
    
    return directiveDefinitionObject;
}
grecaptchaDirective.$inject = ["$grecaptcha", "$parse", "$q", "$document"];


var app = angular.module('grecaptcha', [])
.constant('greLanguageCodes', greLanguageCodes)
.provider('$grecaptcha', $grecaptchaProvider)
.directive('grecaptcha', grecaptchaDirective);

})(window, window.angular)