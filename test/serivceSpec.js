if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;
var count = 1;

var appName = function(){
    return 'service'+(count++);    
}

/***
 * Scenario
 * 
 *  Grecaptcha service
 *  │
 *  ├── #commonly,
 *  │   │
 *  │   ├── should throw error when set invalid languageCode
 *  │   │
 *  │   ├── should not throw error when set valid languageCode
 *  │   
 *  ├── #without init funciton performed,
 *  │   │
 *  │   ├── should not have the _grecaptcha object.
 *  │   │   (_grecaptcha is created after init method called
 *  │   │   
 *  │   └── should be fulfilled when render function is called.
 *  │       (init method is automatically called if _grecaptcha object is undefined)
 *  │
 *  └── #after init function performed,
 *      │
 *      ├── should have the _grecaptcha object.
 *      │
 *      ├── should be fulfilled when render function is called.
 *      │
 *      └── #with stub render function
 *          │
 *          └── should perform a callback.
 **/
 
 
 //case for grecaptcha service
describe('Grecaptcha service', function() {
    describe('#commonly,', function(){
        var $grecaptcha, $rootScope, $document, 
        app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
                sitekey: sitekey
            })    
        });
        
        var badLanguageErrorMessge = '[$grecaptcha:badlan] The languageCode is not available.';
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$document_){
                $grecaptcha = _$grecaptcha_;
                $rootScope = _$rootScope_;
                $document = _$document_;
            });
        });
        
        it('should throw error when set invalid languageCode.', function(){
            var lans = ['aa', 'bb', 'kr', 'us', 'jp', 'es-418'];
            
            angular.forEach(lans, function(val){
                expect($grecaptcha.setLanguageCode.bind($grecaptcha, val)).to.throw(Error, badLanguageErrorMessge)
            });
        });
        
        it('should not throw error when set valid languageCode.', function(){
            var lans = ['ko', 'ja', 'en', 'zh-CN', 'es-419'];
            
            angular.forEach(lans, function(val){
                expect($grecaptcha.setLanguageCode.bind($grecaptcha, val)).not.to.throw(Error, badLanguageErrorMessge)
            });
        })
    });
    
    describe('#without init function performed,', function() {
        var el, $grecaptcha, $rootScope, $document, app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
                sitekey: sitekey
            })    
        });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_, _$rootScope_, _$document_){
                $grecaptcha = _$grecaptcha_;
                $rootScope = _$rootScope_;
                $document = _$document_;
            });
            
            el = $document[0].createElement('div');
            $document[0].querySelector('body').appendChild(el);
        });
        
        afterEach(function(){
            $rootScope.$apply();
        });
        
        it('should not have the _grecaptcha object.', function(){
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
        
        describe('#with stub redner funciton', function(){
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
            
            it('should perform a callback.', function(){
                $grecaptcha.render(undefined, {}, function(respone){
                    respone.should.equal('callback response');
                });
                
                $timeout.flush();
            });
        })
    });
});
