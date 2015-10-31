var app = angular.module('grecaptcha', [])
.constant('greLanguageCodes', greLanguageCodes)
.provider('$grecaptcha', $grecaptchaProvider)
.directive('grecaptcha', grecaptchaDirective);