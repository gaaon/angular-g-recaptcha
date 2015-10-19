/**
 * @name angular-g-recaptcha
 * @version v1.0.0
 * @author Taewoo Kim xodn4195@gmail.com
 * @license MIT
 */
(function(window, angular) {
  var app, grecaptchaDirective, grecaptchaProvider;
  grecaptchaProvider = function() {
    var _createScript, _grecaptcha, _languageCode, _loadingMessage, _onloadMethod, _parameters, self;
    _grecaptcha = void 0;
    _parameters = {};
    _languageCode = void 0;
    self = this;
    _onloadMethod = "onRecaptchaApiLoaded";
    _loadingMessage = "loading..";
    this.setParameters = function(params) {
      _parameters = params;
      return self;
    };
    this.setLanguageCode = function(languageCode) {
      _languageCode = languageCode;
      return self;
    };
    this.setLoadingMessage = function(message) {
      _loadingMessage = message;
      return self;
    };
    _createScript = function($document) {
      var s, scriptTag;
      scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.src = ("//www.google.com/recaptcha/api.js?onload=" + _onloadMethod + "&render=explicit") + (_languageCode ? "&h1" + _languageCode : "");
      s = $document[0].querySelector('body');
      s.appendChild(scriptTag);
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
            $window[_onloadMethod] = function() {
              $rootScope.$apply(function() {
                _self.setGrecaptcha($window.grecaptcha);
                resolve();
              });
            };
          });
          _createScript($document);
          return promise;
        };
        this.render = function(element, params, onSuccess, onExpire) {
          var _params, _promise;
          _params = angular.extend({}, _parameters, params);
          _promise = $q.resolve();
          if (!_params.sitekey) {
            return $q.reject('Please set your sitekey by parameters.');
          }
          if (!_grecaptcha) {
            _promise = _self.init();
          }
          _params.callback = function(response) {
            $rootScope.$apply(function() {
              (onSuccess || angular.noop)(response);
            });
          };
          _params['expired-callback'] = function() {
            $rootScope.$apply(function() {
              (onExpire || angular.noop)();
            });
          };
          return _promise.then(function() {
            return _grecaptcha.render(element, _params);
          });
        };
        this.getParameters = function() {
          return _parameters;
        };
        this.getGrecaptcha = function() {
          return _grecaptcha;
        };
        this.getLanguageCode = function() {
          return _languageCode;
        };
        this.getLoadingMessage = function() {
          return _loadingMessage;
        };
        this.setLanguageCode = function(languageCode) {
          if (_languageCode !== languageCode) {
            _grecaptcha = void 0;
          }
          return _self;
        };
        this.setParameters = function(param) {
          angular.extend(_parameters, param);
          return _self;
        };
        this.setGrecaptcha = function(gre) {
          return _grecaptcha = gre;
        };
        _self;
        this.setLoadingMessage = function(message) {
          _loadingMessage = message;
          return _self;
        };
      };
    }];
  };
  grecaptchaDirective = ["grecaptcha", function(grecaptcha) {
    'ngInject';
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, el, attr, ngModelCtrl) {
        el.html(grecaptcha.getLoadingMessage());
        grecaptcha.init().then(function() {
          el.empty();
          grecaptcha.render(el[0], {}, function(res) {
            ngModelCtrl.$setViewValue(res);
          }, function() {
            console.log('recaptcha expired!');
          });
        });
      }
    };
  }];
  return app = angular.module('grecaptcha', []).provider('grecaptcha', grecaptchaProvider).directive('grecaptcha', grecaptchaDirective);
})(window, window.angular);
