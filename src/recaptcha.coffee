((window, angular)->
    _availableLanguageCodes = 
        "ar"        : "Arabic"
        "af"        : "Afrikaans"
        "am"        : "Amharic"
        "hy"        : "Armenian"
        "az"        : "Azerbaijani"
        "eu"        : "Basque"
        "bn"        : "Bengali"
        "bg"        : "Bulgarian"
        "ca"        : "Catalan"
        "zh-HK"     : "Chinese (Hong Kong)"
        "zh-CN"     : "Chinese (Simplified)"
        "zh-TW"     : "Chinese (Traditional)"
        "hr"        : "Croatian"
        "cs"        : "Czech"
        "da"        : "Danish"
        "nl"        : "Dutch"
        "en-GB"     : "English (UK)"
        "en"        : "English (US)"
        "et"        : "Estonian"
        "fil"       : "Filipino"
        "fi"        : "Finnish"
        "fr"        : "French"
        "fr-CA"     : "French (Canadian)"
        "gl"        : "Galician"
        "ka"        : "Georgian"
        "de"        : "German"
        "de-AT"     : "German (Austria)"
        "de-CH"     : "German (Switzerland)"
        "el"        : "Greek"
        "gu"        : "Gujarati"
        "iw"        : "Hebrew"
        "hi"        : "Hindi"
        "hu"        : "Hungarain"
        "is"        : "Icelandic"
        "id"        : "Indonesian"
        "it"        : "Italian"
        "ja"        : "Japanese"
        "kn"        : "Kannada"
        "ko"        : "Korean"
        "lo"        : "Laothian"
        "lv"        : "Latvian"
        "lt"        : "Lithuanian"
        "ms"        : "Malay"
        "ml"        : "Malayalam"
        "mr"        : "Marathi"
        "mn"        : "Mongolian"
        "no"        : "Norwegian"
        "fa"        : "Persian"
        "pl"        : "Polish"
        "pt"        : "Portuguese"
        "pt-BR"     : "Portuguese (Brazil)"
        "pt-PT"     : "Portuguese (Portugal)"
        "ro"        : "Romanian"
        "ru"        : "Russian"
        "sr"        : "Serbian"
        "si"        : "Sinhalese"
        "sk"        : "Slovak"
        "sl"        : "Slovenian"
        "es"        : "Spanish"
        "es-419"    : "Spanish (Latin America)"
        "sw"        : "Swahili"
        "sv"        : "Swedish"
        "ta"        : "Tamil"
        "te"        : "Telugu"
        "th"        : "Thai"
        "tr"        : "Turkish"
        "uk"        : "Ukrainian"
        "ur"        : "Urdu"
        "vi"        : "Vietnamese"
        "zu"        : "Zulu"
        
    # $grecaptchaProvider
    $grecaptchaProvider = (grecaptchaLanguageCodes)->
        'ngInject'
        
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
            if grecaptchaLanguageCodes[languageCode] is undefined
                throw new Error '[$grecaptcha:badlan] The languageCode is not available.'
            
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
                    + if _languageCode then "&hl=#{_languageCode}" else ""
            
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
                    if grecaptchaLanguageCodes[languageCode] is undefined
                        throw new Error '[$grecaptcha:badlan] The languageCode is not available.'
            
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
    .constant  'grecaptchaLanguageCodes', _availableLanguageCodes
)(window, window.angular)