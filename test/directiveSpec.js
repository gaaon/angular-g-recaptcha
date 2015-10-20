if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'directive'+(count++);
}

describe('Grecaptcha directive', function(){
    var $rootScope, $grecaptcha, $compile, $timeout, $q, promise, element,
    app = angular.module(appName(), ['grecaptcha'])
    .config(function($grecaptchaProvider){
        $grecaptchaProvider.setParameters({
            sitekey: sitekey
        })
    });
    
    afterEach(function(){
        $rootScope.$apply();
    });
    
    describe('after compile is completed,', function(){
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$compile_, _$timeout_, _$q_){
                $grecaptcha  = _$grecaptcha_;
                $rootScope  = _$rootScope_;
                $compile    = _$compile_;
                $timeout    = _$timeout_;
                $q          = _$q_;
            });
            
            var stub = sinon.stub($grecaptcha, 'render', function(el, param, success){
                var response = 'response';
                
                $timeout(function(){
                    success(response);
                }, 1000);
                
                return $q.resolve();
            });
            
            element = $compile('<div grecaptcha="{}" data-ng-model="response"></div>')($rootScope);
            $rootScope.$apply();
            return $rootScope.promise;
        });
        
        afterEach(function(){
            $grecaptcha.render.restore();
        })
        
        it('should have empty child.', function(){
            element.html().should.equal('');
        });
        
        it('should have response value in $rootScope.', function(){
            // TODO without try/catch it cause error '$digest already in progress'
            try{
                $timeout.flush();
            } catch(e){}
            
            $rootScope.response.should.equal('response');
        })
    })
    
    describe('before compile begins,', function(){
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$compile_){
                $grecaptcha  = _$grecaptcha_;
                $rootScope  = _$rootScope_;
                $compile    = _$compile_;
            });
            
        });
        
        it('should have "loading.." string child node.', function(){
            element = $compile('<div grecaptcha="{}" data-ng-model="response"></div>')($rootScope);
            element.html().should.equal('loading..');
        });
    })
});

