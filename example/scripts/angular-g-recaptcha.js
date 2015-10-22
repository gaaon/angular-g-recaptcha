/**
 * @name angular-g-recaptcha
 * @version v1.1.1
 * @author Taewoo Kim xodn4195@gmail.com
 * @license MIT
 */
(function(window, angular) {
  var $grecaptchaProvider, app, grecaptchaDirective;
  $grecaptchaProvider = function() {
    var _createScript, _grecaptcha, _languageCode, _loadingMessage, _onLoadMethodName, _parameters, self;
    _grecaptcha = void 0;
    _parameters = {};
    _languageCode = void 0;
    _onLoadMethodName = "onRecaptchaApiLoaded";
    _loadingMessage = "loading..";
    self = this;
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
    this.setOnLoadMethodName = function(onLoadMethodName) {
      _onLoadMethodName = onLoadMethodName;
      return self;
    };
    _createScript = function($document) {
      var opt, scriptTag, src;
      src = ("//www.google.com/recaptcha/api.js?onload=" + _onLoadMethodName + "&render=explicit") + (_languageCode ? "&h1" + _languageCode : "");
      opt = {
        type: 'text/javascript',
        aysnc: true,
        defer: true,
        src: src
      };
      scriptTag = angular.extend($document[0].createElement('script'), opt);
      $document[0].querySelector('body').appendChild(scriptTag);
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
        this.render = function(element, params, onSuccess, onExpire) {
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
            return _grecaptcha.render(element, params);
          });
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
        this.getOnLoadMethodName = function() {
          return _onLoadMethodName;
        };
        this.getParameters = function() {
          return _parameters;
        };
        this.setGrecaptcha = function(gre) {
          return _grecaptcha = gre;
        };
        _self;
        this.setLanguageCode = function(languageCode) {
          if (_languageCode !== languageCode) {
            _grecaptcha = void 0;
          }
          return _self;
        };
        this.setLoadingMessage = function(message) {
          _loadingMessage = message;
          return _self;
        };
        this.setParameters = function(param) {
          angular.extend(_parameters, param);
          return _self;
        };
      };
    }];
  };
  grecaptchaDirective = ["$grecaptcha", "$parse", "$document", function($grecaptcha, $parse, $document) {
    'ngInject';
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, el, attr, ngModelCtrl) {
        var param;
        param = $parse(attr.grecaptcha)(scope);
        el.html($grecaptcha.getLoadingMessage());
        scope.promise = $grecaptcha.init().then(function() {
          el.empty();
          return $grecaptcha.render(el[0], param, function(res) {
            ngModelCtrl.$setViewValue(res);
          }, function() {

            /* TODO What is appropriate code for here? */
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
  return app = angular.module('grecaptcha', []).provider('$grecaptcha', $grecaptchaProvider).directive('grecaptcha', grecaptchaDirective);
})(window, window.angular);
