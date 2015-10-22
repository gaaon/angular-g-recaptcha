((window, angular)->
    
    # $grecaptchaProvider
    $grecaptchaProvider = ->
        _grecaptcha         = undefined                 # private grecaptcha object
        
        _parameters         = {}                        # private parameters object
        _languageCode       = undefined                 # private languageCode value
        
        _onLoadMethodName   = "onRecaptchaApiLoaded"    # private name for method called when recaptcha script be loaded
        _loadingMessage     = "loading.."               # private loading message value
        
        self = @                                        # private this reference
        
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
        
        # a method that set onloadMethod name
        @setOnLoadMethodName = (onLoadMethodName)->
            _onLoadMethodName = onLoadMethodName
            self
            
        # a method that create recaptcha script
        _createScript = ($document)->
            src = "//www.google.com/recaptcha/api.js?onload=#{_onLoadMethodName}&render=explicit" \
                    + if _languageCode then "&h1#{_languageCode}" else ""
            
            opt = 
                type: 'text/javascript'
                aysnc: true
                defer: true
                src: src
                
            scriptTag = angular.extend $document[0].createElement('script'), opt
            
            $document[0].querySelector('body').appendChild(scriptTag)
            return
        
        this.$get = ($document, $q, $window, $rootScope)->
            'ngInject'
            new ->
                _self = @
                
                @init = ->
                    return $q.resolve() if _grecaptcha
                    
                    promise = $q (resolve, reject)->
                        $window[_onLoadMethodName] = ->
                            $rootScope.$apply ->
                                _self.setGrecaptcha($window.grecaptcha)
                                resolve()
                                return
                            return
                        return
                        
                    _createScript $document
                    
                    promise
                    
                @render = (element, params, onSuccess, onExpire)->
                    params = angular.extend {}, params, _parameters
                    
                    promise = if not params.sitekey then \
                                $q.reject '[$grecaptcha:sitekey] The sitekey is necessary.' \
                            else if not _grecaptcha then \
                                _self.init() \
                            else \
                                $q.resolve()
                        
                    promise.then ->
                        params.callback = (response)->
                            $rootScope.$apply ->
                                (onSuccess or params.callback or angular.noop)(response)
                                return
                            return
                            
                        params['expired-callback'] = ->
                            $rootScope.$apply ->
                                (onExpire or params['expired-callback'] or angular.noop)()
                                return
                            return
                            
                        return _grecaptcha.render element, params
                        
                @getGrecaptcha = ->
                    _grecaptcha
                    
                @getLanguageCode = ->
                    _languageCode
                    
                @getLoadingMessage = ->
                    _loadingMessage
                
                @getOnLoadMethodName = ->
                    _onLoadMethodName
                    
                @getParameters = ->
                    _parameters
                    
                    
                @setGrecaptcha = (gre)->
                     _grecaptcha = gre
                    _self
                
                @setLanguageCode = (languageCode)->
                    _grecaptcha = undefined if _languageCode isnt languageCode
                    _self
                
                @setLoadingMessage = (message)->
                    _loadingMessage = message
                    _self
                    
                @setParameters = (param)->
                    angular.extend _parameters, param
                    _self
                
                return
        return
    
    grecaptchaDirective = ($grecaptcha, $parse, $document)->
        'ngInject'
        {
            restrict: 'A'
            require: '^ngModel'
            link: (scope, el, attr, ngModelCtrl)->
                param = $parse(attr.grecaptcha)(scope)
                el.html $grecaptcha.getLoadingMessage()
                
                scope.promise = $grecaptcha.init().then ->
                    el.empty()
                    $grecaptcha.render el[0], param
                    , (res)->
                        ngModelCtrl.$setViewValue res
                        return
                    , ->
                        ### TODO What is appropriate code for here? ###
                        return
                .catch (reason)->
                    throw new Error reason
                    return
                
                scope.$on '$destroy', ->
                    angular.element($document[0].querySelector '.pls-container' ).remove()
                    return
                    
                return
        }
        
    app = angular.module('grecaptcha', [])
    .provider '$grecaptcha', $grecaptchaProvider
    .directive 'grecaptcha', grecaptchaDirective
)(window, window.angular)