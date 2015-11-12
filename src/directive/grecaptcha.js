/**
 * @ngdoc directive
 * @name wo.grecaptcha.$grecaptcha:grecaptcha
 * 
 * @restrict 'A'
 * 
 * @requires wo.grecaptcha.$grecaptcha
 * @requires ng.$parse
 * @requires ng.$document
 * 
 * @param {string=} gre-info Assignable angular expression to contain information about gre object
 * @param {string} ng-model Assignable angular expression to data-bind to
 * 
 * @scope 
 * 
 * @description
 * Set view value of model when recaptcha validating is done.<br>
 * Reset view value if recaptcha be expired.
 * 
 * Load greInfo with information about gre object.
 * 
 * @example
    <example module="greDemo">
        <file name="index.html">
            <div data-ng-controller="GreCtrl">
                <div grecaptcha='{theme: "dark"}' gre-info="greInfo" data-ng-model="response">
                    Loading..
                </div>
                
                <div style="word-wrap: break-word"> response : {{response}} </div>
            </div>
        </file>
    
        <file name="script.js">
            angular.module('greDemo', ['wo.grecaptcha'])
            .config(function($grecaptchaProvider) {
                $grecaptchaProvider.set({
                    sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // test sitekey
                });
            })
            .controller("GreCtrl", function($scope) {
                $scope.response;
                $scope.greInfo = {};
                
                var greInfoFind = $scope.$on('greInfo', function(event, greInfo) {
                    if( !!greInfo ) {
                        console.log(greInfo.widgetId); //widget id of rendered recaptcha box
                        greInfoFind();
                    }
                });
                
                $scope.$on('response', function(event, response) {
                    console.log(response); // response of recaptcha box
                });
            });
        </file>
    </example>
 */
function grecaptchaDirective($grecaptcha, $parse, $document){
    
    var directiveDefinitionObject = {
        strict: 'A',
        require: '^ngModel',
        scope: {
            info: '=greInfo'
        },
        link: function(scope, el, attr, ngModelCtrl){
            
            scope.info || (scope.info = {});   
            //This will not cause any side effect. Just for preventing undefined error at below
            
            var param = $parse(attr['grecaptcha'] || '{}')(scope);
            var gre = $grecaptcha(param);
            
            function setViewValue(res) {
                ngModelCtrl.$setViewValue(res);
                
                return res;
            }
            
            gre.set({
                callback: 
                    [setViewValue].concat(gre.get('callback')),
                
                'expired-callback': 
                    [setViewValue].concat(gre.get('expired-callback'))
            });
            
            gre.on('reset', setViewValue);
            
            gre.on('destroy', angular.element($document[0].querySelector('.pls-container')).parent().remove);
            
            scope.info.promise = gre.init().then(function(){
                el.empty();
                
                return gre.render(el[0]);
            }).then(function(){
                scope.info.widgetId = gre.getWidgetId();
                
                return gre;
            });
        }
    };
    
    return directiveDefinitionObject;
}