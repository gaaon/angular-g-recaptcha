((window, angular)->
    # grecaptchaProvider
    grecaptchaProvider = ->
        # private grecapthca object
        _grecaptcha     = undefined
        
        # private parameters object
        _parameters     = {}
        
        # private languageCode value
        _languageCode   = undefined
        
        # variable that contains this
        self = @
        
        # a method name called when recaptcha api script will be loaded
        onloadMethod    = "onRecaptchaApiLoaded"
        
        @setParameters = (params)->
            _parameters = params
            return
        
        @setLanguageCode = (languageCode)->
            _languageCode = languageCode
            return
            
        _createScript = ($document)->
            scriptTag = $document[0].createElement 'script'
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.defer = true;
            scriptTag.src = "//www.google.com/recaptcha/api.js?onload=#{onloadMethod}&render=explicit" + if _languageCode then "&h1#{_languageCode}" else ""
            
            s = $document[0].querySelector('body')
            s.appendChild(scriptTag);
            return
        
        this.$get = ($document, $q, $window, $rootScope)->
            'ngInject'
            {
                init: ->
                    getAndFree = ->
                        _grecaptcha = $window.grecaptcha
                        $window.grecaptcha = undefined
                        return
                    
                    getAndFree() if $window.grecaptcha
                    return $q.resolve _grecaptcha if _grecaptcha
                    
                    promise = $q (resolve, reject)->
                        $window[onloadMethod] = ->
                            getAndFree()
                            $rootScope.$apply ->
                                resolve _grecaptcha
                            return
                        return
                        
                    _createScript $document
                    
                    promise
                    
                render: (element, params, onSuccess, onExpire)->
                    _params = angular.extend {}, _parameters, params
                    
                    if not _params.sitekey
                        throw new Error 'Please set your sitekey by parameters.'
                        
                    if not _grecaptcha
                        throw new Error 'Please init grecaptcha.'
                        
                    _params.callback = onSuccess || angular.noop
                    _params['expired-callback'] = onExpire || angular.noop
                    
                    _grecaptcha.render element, _params
                
                getParameters: ->
                    _parameters
                    
                getGrecaptcha: ->
                    _grecaptcha
                    
                getLanguageCode: ->
                    _languageCode
                    
                setLanguageCode: (languageCode)->
                    if _languageCode isnt languageCode
                        _grecaptcha = undefined
                    return
            }
            
        return
        
    app = angular.module('grecaptcha', [])
    .provider 'grecaptcha', grecaptchaProvider
)(window, window.angular)