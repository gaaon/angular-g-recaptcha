/**
 * @name angular-g-recaptcha
 * @version v1.2.0
 * @author Taewoo Kim xodn4195@gmail.com
 * @license MIT
 */
(function(window, angular) {
  var $grecaptchaProvider, _availableLanguageCodes, _errorList, app, grecaptchaDirective;
  _availableLanguageCodes = {
    "ar": "Arabic",
    "af": "Afrikaans",
    "am": "Amharic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "bn": "Bengali",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "zh-HK": "Chinese (Hong Kong)",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en-GB": "English (UK)",
    "en": "English (US)",
    "et": "Estonian",
    "fil": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fr-CA": "French (Canadian)",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "de-AT": "German (Austria)",
    "de-CH": "German (Switzerland)",
    "el": "Greek",
    "gu": "Gujarati",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarain",
    "is": "Icelandic",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "ko": "Korean",
    "lo": "Laothian",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "ms": "Malay",
    "ml": "Malayalam",
    "mr": "Marathi",
    "mn": "Mongolian",
    "no": "Norwegian",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pt-BR": "Portuguese (Brazil)",
    "pt-PT": "Portuguese (Portugal)",
    "ro": "Romanian",
    "ru": "Russian",
    "sr": "Serbian",
    "si": "Sinhalese",
    "sk": "Slovak",
    "sl": "Slovenian",
    "es": "Spanish",
    "es-419": "Spanish (Latin America)",
    "sw": "Swahili",
    "sv": "Swedish",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
    "zu": "Zulu"
  };
  _errorList = {
    '$grecaptcha': {
      'badlan': 'The languageCode is not available.',
      'widgetid': 'The widgetid is invalid.'
    }
  };
  $grecaptchaProvider = ["greLanguageCodes", "greErrorList", function(greLanguageCodes, greErrorList) {
    'ngInject';

    /* private variables */
    var _createScript, _grecaptcha, _languageCode, _onLoadMethodName, _parameters, _scriptTag, generateErrorMessge, self, serviceName;
    _grecaptcha = void 0;
    _parameters = {};
    _languageCode = void 0;
    _onLoadMethodName = "onRecaptchaApiLoaded";
    _scriptTag = void 0;
    self = this;
    serviceName = "$grecaptcha";

    /* methods */
    generateErrorMessge = function(serviceName, errorCode) {
      var errorMessage;
      if (greErrorList[serviceName] === void 0) {
        throw new Error('No such service!');
      }
      errorMessage = greErrorList[serviceName][errorCode];
      if (errorMessage === void 0) {
        throw new Error('No such errorCode!');
      }
      return "[" + serviceName + ":" + errorCode + "] " + errorMessage;
    };

    /*
     * Set parameters and validate them
     * @param params the arguments that are used as config of recaptcha render
     */
    this.setParameters = function(params) {
      _parameters = params;
      return self;
    };
    this.setLanguageCode = function(languageCode) {
      if (grecaptchaLanguageCodes[languageCode] === void 0) {
        throw new Error(generateErrorMessge(serviceName, 'badlan'));
      }
      _languageCode = languageCode;
      return self;
    };
    this.setOnLoadMethodName = function(onLoadMethodName) {
      _onLoadMethodName = onLoadMethodName;
      return self;
    };
    _createScript = function($document) {
      var opt, src;
      src = "//www.google.com/recaptcha/api.js?render=explicit&onload=" + _onLoadMethodName + (_languageCode ? "&hl=" + _languageCode : "");
      opt = {
        type: 'text/javascript',
        async: true,
        defer: true,
        src: src
      };
      _scriptTag = angular.extend($document[0].createElement('script'), opt);
      $document[0].querySelector('head').appendChild(_scriptTag);
    };
    this.$get = ["$document", "$q", "$window", "$rootScope", function($document, $q, $window, $rootScope) {
      'ngInject';
      return new function() {
        var _self;
        _self = this;
        this.init = function() {
          var promise;
          if (_grecaptcha) {
            return $q.resolve();
          }
          promise = $q(function(resolve, reject) {
            $window[_onLoadMethodName] = function() {
              $rootScope.$apply(function() {
                _self.setGrecaptcha($window.grecaptcha);
                resolve();
              });
            };
          });
          _createScript($document);
          return promise;
        };
        this.render = function(element, params, onSuccess, onExpire, onInit) {
          var promise;
          params = angular.extend({}, params, _parameters);
          promise = !params.sitekey ? $q.reject('[$grecaptcha:sitekey] The sitekey is necessary.') : !_grecaptcha ? _self.init() : $q.resolve();
          return promise.then(function() {
            params.callback = function(response) {
              $rootScope.$apply(function() {
                (onSuccess || params.callback || angular.noop)(response);
              });
            };
            params['expired-callback'] = function() {
              $rootScope.$apply(function() {
                (onExpire || params['expired-callback'] || angular.noop)();
              });
            };
            (onInit || angular.noop)();
            return _grecaptcha.render(element, params);
          });
        };
        this.reset = function(widgetId) {
          var error, error1;
          try {
            _grecaptcha.reset(widgetId);
          } catch (error1) {
            error = error1;
            if (widgetId !== void 0) {
              throw new Error(generateErrorMessge(serviceName, 'widgetid'));
            } else {
              throw new Error(generateErrorMessge(serviceName, 'nowidget'));
            }
          }
        };
        this.getResponse = function(widgetId) {
          var error, error1, response;
          response = void 0;
          try {
            response = _grecaptcha.getResponse(widgetId);
          } catch (error1) {
            error = error1;
            if (widgetId !== void 0) {
              throw new Error(generateErrorMessge(serviceName, 'widgetid'));
            } else {
              throw new Error(generateErrorMessge(serviceName, 'nowidget'));
            }
          }
          return response;
        };

        /* getter */
        this.getGrecaptcha = function() {
          return _grecaptcha;
        };
        this.getLanguageCode = function() {
          return _languageCode;
        };
        this.getOnLoadMethodName = function() {
          return _onLoadMethodName;
        };
        this.getParameters = function() {
          return _parameters;
        };
        this.getScriptTag = function() {
          return _scriptTag;
        };

        /* setter */
        this.setGrecaptcha = function(gre) {
          return _grecaptcha = gre;
        };
        _self;
        this.setLanguageCode = function(languageCode) {
          self.setLanguageCode(languageCode);
          return _self;
        };
        this.setParameters = function(param) {
          self.setParameters(param);
          return _self;
        };
      };
    }];
  }];
  grecaptchaDirective = ["$grecaptcha", "$parse", "$document", function($grecaptcha, $parse, $document) {
    'ngInject';
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, el, attr, ngModelCtrl) {
        var param;
        param = $parse(attr.grecaptcha)(scope);
        scope.promise = $grecaptcha.init().then(function() {
          return $grecaptcha.render(el[0], param, function(res) {
            ngModelCtrl.$setViewValue(res);
          }, function() {

            /* TODO What is appropriate code for here? */
          }, function() {
            el.empty();
          });
        })["catch"](function(reason) {
          throw new Error(reason);
        });
        scope.$on('$destroy', function() {
          angular.element($document[0].querySelector('.pls-container')).remove();
        });
      }
    };
  }];
  return app = angular.module('grecaptcha', []).provider('$grecaptcha', $grecaptchaProvider).directive('grecaptcha', grecaptchaDirective).constant('greLanguageCodes', _availableLanguageCodes).constant('greErrorList', _errorList);
})(window, window.angular);
