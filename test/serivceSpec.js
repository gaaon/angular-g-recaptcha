if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;
var count = 1;

var appName = function(){
    return 'service'+(count++);    
}

//case for grecaptcha service
describe('Grecaptcha service', function() {
    
    describe('#without init function performed,', function() {
        var el, $grecaptcha, $rootScope, $document, app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
                sitekey: sitekey
            })    
        });
        
        beforeEach(function(done){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$document_){
                $grecaptcha = _$grecaptcha_;
                $rootScope = _$rootScope_;
                $document = _$document_;
            });
            
            el = $document[0].createElement('div');
            $document[0].querySelector('body').appendChild(el);
            
            done();
        });
        
        afterEach(function(){
            $rootScope.$apply();
        });
        
        it('should have the _grecaptcha object.', function(){
            expect($grecaptcha.getGrecaptcha()).to.be.undefined;
        });
        
        it('should be fulfilled when render function is called.', function() {
            return $grecaptcha.render(el, {}).should.be.fulfilled;
        });
    });
    
    
    describe('#after init function performed,', function() {
        var $timeout, $q, $grecaptcha, el, $rootScope, $document, 
        app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
                sitekey: sitekey
            })    
        });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$document_, _$q_, _$timeout_){
                $grecaptcha = _$grecaptcha_;
                $rootScope = _$rootScope_;
                $document = _$document_;
                $timeout = _$timeout_;
                $q = _$q_;
            });
            
            el = $document[0].createElement('div');
            $document[0].querySelector('body').appendChild(el);
            
            return $grecaptcha.init();
        });
        
        afterEach(function(){
            $document[0].querySelector('body').removeChild(el);
            $rootScope.$apply();
        });
        
        
        it('should be fulfilled when render function is called.', function(){
           return $grecaptcha.render(el, {}).should.be.fulfilled;
        })
        
        it('should have the _grecaptcha object.', function(){
            var _grecaptcha = $grecaptcha.getGrecaptcha();
            _grecaptcha.should.not.be.undefined;
            _grecaptcha.should.include.keys('render', 'reset', 'getResponse');
        
        });
        
        describe('#with stub funciton', function(){
            var stub;
            beforeEach(function(){
                stub = sinon.stub($grecaptcha, 'render', function(el, param, success, expire){
                    var response = 'callback response';
                    
                    $timeout(function(){
                        (success||angular.noop)(response);
                    }, 1000);
                });
            });
            
            afterEach(function(){
                $grecaptcha.render.restore();
                $rootScope.$apply();
            });
            
            it('should call a callback.', function(){
                $grecaptcha.render(undefined, {}, function(respone){
                    respone.should.equal('callback response');
                });
                
                $timeout.flush();
            });
            
            it('should not throw error about undefined when onSuccess is not provided.', function(){
                $grecaptcha.render();
                
                $timeout.flush();
            })
        })
    });
});
