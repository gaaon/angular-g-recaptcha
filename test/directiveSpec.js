if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'directive'+(count++);
};

describe('Grecaptcha directive', function(){
    var $rootScope, $grecaptcha, $compile, $timeout;
    
    var fakeGrecaptcha, response, innerEl, widgetId;
    
    beforeEach(function(){
        innerEl = document.createElement('div');
        innerEl.innerHTML = 'inner html!';
        
        
        fakeGrecaptcha = {
            render: function(el, param) {
                el.appendChild(innerEl);
                
                $timeout(function(){
                    response = 'fake response';
                    param['callback'](response);
                }, 1000);
                
                return widgetId = 0;
            },
            
            reset: function(widgetId) {
                
            },
            
            getResponse: function(widgetId) {
                return response;
            }
        };
        
        module('wo.grecaptcha', function($grecaptchaProvider){
            $grecaptchaProvider
            .set('sitekey', sitekey)
            .set('grecaptcha', fakeGrecaptcha);
        });
        
        inject(function(_$rootScope_, _$grecaptcha_, _$compile_, _$timeout_){
            $rootScope = _$rootScope_;
            $grecaptcha = _$grecaptcha_;
            $compile    = _$compile_;
            $timeout = _$timeout_;
            
        });
    });
    
    
    
    afterEach(function(){
        $rootScope.$apply();
    });
    
    
    
    it('should throw an error when directive links without ngModel.', function(){
        var elementStr = '<div grecaptcha> Loading.. </div>';
        
        expect( $compile(elementStr).bind(undefined, $rootScope) ).to.throw(Error);
    });
    
    
    
    it('should have a undefined widgetId.', function(){
        var $scope = $rootScope.$new();
        $scope.info = {};
        
        var elStr = '<div grecaptcha data-ng-model="response" gre-info="info"> Loading.. </div>';
        
        var el = $compile(elStr)($scope);
        
        $scope.info.promise.should.be.fulfilled;
        
        expect($scope.info.widgetId).to.be.undefined;

        $rootScope.$apply();
        $scope.info.widgetId.should.be.equal(widgetId);
        
        $timeout.flush();
        $scope.response.should.be.equal(response);
    });
    
    
    
    it('should have information in $scope.info about gre object after callback executed.', function(){
        var $scope = $rootScope.$new();
        $scope.info = {};
        
        var elStr = '<div grecaptcha data-ng-model="response" gre-info="info"> Loading.. </div>';
        
        var el = $compile(elStr)($scope);
        
        $scope.info.promise.should.be.fulfilled;
        expect($scope.info.widgetId).to.be.undefined;
        
        $rootScope.$apply();
        
        $scope.info.widgetId.should.be.equal(widgetId);
        
        $timeout.flush();
        $scope.response.should.be.equal(response);
    });
    
    
    context.skip('#with render stub function,', function(){
        var response = 'my_response', stub;
        
        beforeEach(function(){
            stub = sinon.stub($grecaptcha, 'render', function(el, param, onInit){
                
                return $grecaptcha.init().then(function(){
                    $timeout(function(){
                        (param.callback || angular.noop)(response);
                    });
                    
                    return 0;
                });
            });
            
            return $grecaptcha.init();
        });
        
        afterEach(function(){
            stub.restore();
        });
        
        it('should not throw an error when directive links with ngModel.', function(){
            var $scope = $rootScope.$new(),
                elementStr = '<div grecaptcha data-ng-model="res"></div>';
                
            var element = $compile(elementStr)($scope);
            
            return element.isolateScope().promise.should.be.fulfilled.then(function(val){
                expect(val).to.be.equal(0);
                
                try {
                    $timeout.flush();
                } catch(e) {}
                
                expect($scope.res).to.be.equal(response);
                expect(stub).to.be.calledOnce.and.to.be.calledWith(element[0]);
            });
        })
    })
})