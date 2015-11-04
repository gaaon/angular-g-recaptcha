if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'directive'+(count++);
};

describe.skip('Grecaptcha directive', function(){
    var $rootScope, $grecaptcha, $compile, $timeout;
    
    beforeEach(function(){
        module('grecaptcha');
        
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
        
        $scope.widgetId = {};
        
        var elStr = '<div grecaptcha data-ng-model="response" gre-widget-id="widgetId"> Loading.. </div>';
        
        var el = $compile(elStr)($scope);
        
        expect($scope.widgetId).not.to.be.undefined;
        
        expect($scope.widgetId).to.be.deep.equal(el.isolateScope().widgetId);
    });
    
    context('#with render stub function,', function(){
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