((window, angular)->
    # grecaptchaProvider
    grecaptchaProvider = ->
        # private grecaptcha object
        _grecaptcha     = undefined
        
        # private parameters object
        _parameters     = {}
        
        # private languageCode value
        _languageCode   = undefined
        
        # variable that contains this
        self = @
        
        # a method name called when recaptcha api script will be loaded
        _onloadMethod    = "onRecaptchaApiLoaded"
        
        # a loading message
        _loadingMessage  = "loading.."
        
        # a method that set parameters
        @setParameters = (params)->
            _parameters = params
            self
        
        # a method that set languageCode
        @setLanguageCode = (languageCode)->
            _languageCode = languageCode
            self
        
        # a method that set loading message
        @setLoadingMessage = (message)->
            _loadingMessage = message
            self
            
        # a method that create recaptcha script
        _createScript = ($document)->
            scriptTag = $document[0].createElement 'script'
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.defer = true;
            scriptTag.src = "//www.google.com/recaptcha/api.js?onload=#{_onloadMethod}&render=explicit" + if _languageCode then "&h1#{_languageCode}" else ""
            
            s = $document[0].querySelector('body')
            s.appendChild(scriptTag);
            return
        
        this.$get = ($document, $q, $window, $rootScope)->
            'ngInject'
            return new ->
                _self = @
                
                @init = ->
                    return $q.resolve() if _grecaptcha
                    
                    promise = $q (resolve, reject)->
                        $window[_onloadMethod] = ->
                            $rootScope.$apply ->
                                _self.setGrecaptcha($window.grecaptcha)
                                resolve()
                                return
                            return
                        return
                        
                    _createScript $document
                    
                    promise
                    
                @render = (element, params, onSuccess, onExpire)->
                    _params = angular.extend {}, _parameters, params
                    _promise = $q.resolve()
                    
                    if not _params.sitekey
                        return $q.reject 'Please set your sitekey by parameters.'
                        
                    _promise = _self.init() if not _grecaptcha
                        
                    _params.callback = (response)->
                        $rootScope.$apply ->
                            (onSuccess or angular.noop)(response)
                            return
                        return
                        
                    _params['expired-callback'] = ->
                        $rootScope.$apply ->
                            (onExpire || angular.noop)()
                            return
                        return
                    
                    _promise.then ->
                        _grecaptcha.render element, _params
                        
                @getParameters = ->
                    _parameters
                    
                @getGrecaptcha = ->
                    _grecaptcha
                    
                @getLanguageCode = ->
                    _languageCode
                    
                @getLoadingMessage = ->
                    _loadingMessage
                    
                @setLanguageCode = (languageCode)->
                    if _languageCode isnt languageCode
                        _grecaptcha = undefined
                    _self
                
                @setParameters = (param)->
                    angular.extend _parameters, param
                    _self
                
                @setGrecaptcha = (gre)->
                     _grecaptcha = gre
                    _self
                
                @setLoadingMessage = (message)->
                    _loadingMessage = message
                    _self
                    
                return
        return
    
    grecaptchaDirective = (grecaptcha, $parse)->
        'ngInject'
        {
            restrict: 'A'
            require: '^ngModel'
            link: (scope, el, attr, ngModelCtrl)->
                param = $parse(attr.grecaptcha)(scope)
                el.html grecaptcha.getLoadingMessage()
                
                scope.promise = grecaptcha.init().then ->
                    el.empty()
                    grecaptcha.render el[0], param
                    , (res)->
                        ngModelCtrl.$setViewValue res
                        return
                    , ->
                        console.log('recaptcha expired!');
                        return
                    
                return
        }
        
    app = angular.module('grecaptcha', [])
    .provider 'grecaptcha', grecaptchaProvider
    .directive 'grecaptcha', grecaptchaDirective
)(window, window.angular)