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
        
    
    _errorList = 
        '$grecaptcha'   :
            'badlan'    : 'The languageCode is not available.'
            'widgetid'  : 'The widgetid is invalid.'
            
            
    # $grecaptchaProvider
    $grecaptchaProvider = (greLanguageCodes, greErrorList)->
        'ngInject'
        
        ### private variables ###
        _grecaptcha         = undefined                 # grecaptcha object
        _parameters         = {}                        # parameters object
        _languageCode       = undefined                 # languageCode value
        _onLoadMethodName   = "onRecaptchaApiLoaded"    # method name called when recaptcha script be loaded
        _scriptTag          = undefined                 # a tag that contains recaptcha script
        
        self = @                                        # this reference
        
        serviceName         = "$grecaptcha"
        
        
        ### methods ###
        generateErrorMessge = (serviceName, errorCode)->
            if greErrorList[serviceName] is undefined
                throw new Error 'No such service!'
                
            errorMessage = greErrorList[serviceName][errorCode]
            
            if errorMessage is undefined
                throw new Error 'No such errorCode!'
            
            "[#{serviceName}:#{errorCode}] #{errorMessage}"
            
        ###
        # Set parameters and validate them
        # @param params the arguments that are used as config of recaptcha render
        ###
        @setParameters = (params)-> 
            _parameters = params
            self
        
        # a method that set languageCode
        @setLanguageCode = (languageCode)->
            if grecaptchaLanguageCodes[languageCode] is undefined
                throw new Error generateErrorMessge serviceName, 'badlan'
            
            _languageCode = languageCode
            self
        
        # a method that set onloadMethod name
        @setOnLoadMethodName = (onLoadMethodName)->
            _onLoadMethodName = onLoadMethodName
            self
            
        # a method that create recaptcha script
        _createScript = ($document)->
            src = "//www.google.com/recaptcha/api.js?render=explicit&onload="+_onLoadMethodName \
                    + if _languageCode then "&hl=#{_languageCode}" else ""
            opt = 
                type: 'text/javascript'
                async: true
                defer: true
                src: src
                
            _scriptTag = angular.extend $document[0].createElement('script'), opt
            
            $document[0].querySelector('head').appendChild(_scriptTag)
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
                    
                @render = (element, params, onSuccess, onExpire, onInit)->
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
                        (onInit || angular.noop)()
                        
                        return _grecaptcha.render element, params
                
                @reset = (widgetId)->
                    try 
                        _grecaptcha.reset widgetId
                    catch error
                        if widgetId isnt undefined
                            throw new Error generateErrorMessge serviceName, 'widgetid'
                        else
                            throw new Error generateErrorMessge serviceName, 'nowidget'
                    return
                
                @getResponse = (widgetId)->
                    response = undefined
                    
                    try 
                        response = _grecaptcha.getResponse widgetId
                    catch error
                        if widgetId isnt undefined
                            throw new Error generateErrorMessge serviceName, 'widgetid'
                        else
                            throw new Error generateErrorMessge serviceName, 'nowidget'
                    
                    return response
                
                ### getter ###
                @getGrecaptcha = ->
                    _grecaptcha
                    
                @getLanguageCode = ->
                    _languageCode
                    
                @getOnLoadMethodName = ->
                    _onLoadMethodName
                    
                @getParameters = ->
                    _parameters
                
                @getScriptTag = ->
                    _scriptTag
                    
                ### setter ###
                @setGrecaptcha = (gre)->
                     _grecaptcha = gre
                    _self
                
                @setLanguageCode = (languageCode)->
                    self.setLanguageCode languageCode
                    _self
                
                @setParameters = (param)->
                    self.setParameters param
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
        
                scope.promise = $grecaptcha.init().then ->
                    $grecaptcha.render el[0], param
                    , (res)->
                        ngModelCtrl.$setViewValue res
                        return
                    , ->
                        ### TODO What is appropriate code for here? ###
                        return
                    , ->
                        el.empty()
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
    .constant  'greLanguageCodes', _availableLanguageCodes
    .constant  'greErrorList',  _errorList
)(window, window.angular)