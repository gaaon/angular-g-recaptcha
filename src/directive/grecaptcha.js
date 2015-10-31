function grecaptchaDirective($grecaptcha, $parse, $q, $document){
    var directiveDefinitionObject = {
        strict: 'A',
        require: '^ngModel',
        link: function(scope, el, attr, ngModelCtrl){
            var param = $parse(attr['grecaptcha'] || '{}')(scope);
            
            $grecaptcha.setParameters(param);
            
            var cb = angular.copy($grecaptcha.getCallback() || angular.noop);
            
            $grecaptcha.setCallback(function(res){
                cb(res);
                ngModelCtrl.$setViewValue(res);
            });
            
            scope.promise = $grecaptcha.init().then(function(){
                el.empty();
                return $grecaptcha.render(el[0]);
            });
            
            scope.$on('$destroy', function(){
                angular.element($document[0].querySelector('.pls-container')).remove();
            });
        }
    };
    
    return directiveDefinitionObject;
}