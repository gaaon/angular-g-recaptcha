if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'provider'+(count++);
}

// case for grecaptchaProvider
describe('GrecapthcaProvider', function(){
    describe('#when sitekey is provided,', function(){
        var $grecaptcha, app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
                sitekey: sitekey
            })
        });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_){
                $grecaptcha = _$grecaptcha_;
            });
        });
        
        it('should have the sitekey.', function(){
            $grecaptcha.getParameters().should.have.property('sitekey', sitekey);
        })
    });
    
    
    describe('#when sitekey is not provided,', function(){
        var $grecaptcha, app = angular.module(appName(), ['grecaptcha'])
        .config(function($grecaptchaProvider){
            $grecaptchaProvider.setParameters({
            });
        });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_$grecaptcha_){
                $grecaptcha = _$grecaptcha_;
            });
        });
        
        it('should not have a sitekey.', function(){
            $grecaptcha.getParameters().should.not.have.property('sitekey');
        })
    });
});