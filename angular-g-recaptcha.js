/**
 * @name angular-g-recaptcha
 * @version v1.0.0
 * @author Taewoo Kim xodn4195@gmail.com
 * @license MIT
 */
(function(window, angular) {
  var app, grecaptchaProvider;
  grecaptchaProvider = function() {
    var _createScript, _grecaptcha, _languageCode, _parameters, onloadMethod, self;
    _grecaptcha = void 0;
    _parameters = {};
    _languageCode = void 0;
    self = this;
    onloadMethod = "onRecaptchaApiLoaded";
    this.setParameters = function(params) {
      _parameters = params;
    };
    this.setLanguageCode = function(languageCode) {
      _languageCode = languageCode;
    };
    _createScript = function($document) {
      var s, scriptTag;
      scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.src = ("//www.google.com/recaptcha/api.js?onload=" + onloadMethod + "&render=explicit") + (_languageCode ? "&h1" + _languageCode : "");
      s = $document[0].querySelector('body');
      s.appendChild(scriptTag);
    };
    this.$get = function($document, $q, $window, $rootScope) {
      'ngInject';
      return {
        init: function() {
          var getAndFree, promise;
          getAndFree = function() {
            _grecaptcha = $window.grecaptcha;
            $window.grecaptcha = void 0;
          };
          if ($window.grecaptcha) {
            getAndFree();
          }
          if (_grecaptcha) {
            return $q.resolve(_grecaptcha);
          }
          promise = $q(function(resolve, reject) {
            $window[onloadMethod] = function() {
              getAndFree();
              $rootScope.$apply(function() {
                return resolve(_grecaptcha);
              });
            };
          });
          _createScript($document);
          return promise;
        },
        render: function(element, params, onSuccess, onExpire) {
          var _params;
          _params = angular.extend({}, _parameters, params);
          if (!_params.sitekey) {
            throw new Error('Please set your sitekey by parameters.');
          }
          if (!_grecaptcha) {
            throw new Error('Please init grecaptcha.');
          }
          _params.callback = onSuccess || angular.noop;
          _params['expired-callback'] = onExpire || angular.noop;
          return _grecaptcha.render(element, _params);
        },
        getParameters: function() {
          return _parameters;
        },
        getGrecaptcha: function() {
          return _grecaptcha;
        },
        getLanguageCode: function() {
          return _languageCode;
        },
        setLanguageCode: function(languageCode) {
          if (_languageCode !== languageCode) {
            _grecaptcha = void 0;
          }
        }
      };
    };
  };
  return app = angular.module('grecaptcha', []).provider('grecaptcha', grecaptchaProvider);
})(window, window.angular);
