function grecaptchaDirective($grecaptcha, $parse, $q, $document){
    var directiveDefinitionObject = {
        strict: 'A',
        require: '^ngModel',
        link: function(scope, el, attr, ngModelCtrl){
            var param = $parse(attr['grecaptcha'] || '{}')(scope);
            
            var cb = angular.copy($grecaptcha.getCallback() || angular.noop);
            var exp_cb = angular.copy($grecaptcha.getExpiredCallback() || angular.noop);
            
            // TODO I think that it's not right to append callback here
            // It has to be in render method.
            param.callback = (function(res){
                cb(res);
                ngModelCtrl.$setViewValue(res);
            });
            
            param['expired-callback'] = (function(){
                exp_cb();
                ngModelCtrl.$setViewValue(undefined);
            });
            
            scope.promise = $grecaptcha.init().then(function(){
                el.empty();
                return $grecaptcha.render(el[0], param)
            });
            
            scope.$on('$destroy', function(){
                angular.element($document[0].querySelector('.pls-container')).parent().remove();
            });
        }
    };
    
    return directiveDefinitionObject;
}