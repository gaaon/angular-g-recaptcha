if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;


// case for grecaptchaProvider
describe('GrecapthcaProvider', function(){
    describe('#when sitekey is provided', function() {
        
        var grecaptcha, app = angular.module('app1', ['grecaptcha'])
            .config( function(grecaptchaProvider) {
                grecaptchaProvider.setParameters({
                    sitekey: sitekey
                });
            });
            
        beforeEach(function(){
            module(app.name);
            
            inject(function(_grecaptcha_){
                grecaptcha = _grecaptcha_;
            });
        });
        
        it('should have the sitekey which was initiated in config function.', function() {
            var param = grecaptcha.getParameters();
            param.should.have.deep.property('sitekey', sitekey);
        });
        
        it('should not have a _grecaptcha value', function() {
            var _grecaptcha = grecaptcha.getGrecaptcha();
            expect(_grecaptcha).to.be.undefined;
        });
        
        it('should not have a languageCode value.', function() {
            var _languageCode = grecaptcha.getLanguageCode();
            expect(_languageCode).to.be.undefined;
        });

    });
    
    describe('#when sitekey is not provided', function() {
        var grecaptcha, app = angular.module('app2', ['grecaptcha'])
            .config( function(grecaptchaProvider) {
                
            });
            
        beforeEach(function(){
            module(app.name);
            
            inject(function(_grecaptcha_){
                grecaptcha = _grecaptcha_;
            });
        });
        
        it('should not have a sitekey value.', function() {
            var param = grecaptcha.getParameters();
            param.should.not.have.property('sitekey');
        });
        
        it('should not have a _grecaptcha value', function() {
            var _grecaptcha = grecaptcha.getGrecaptcha();
            
            expect(_grecaptcha).to.be.undefined;
        });
        
        it('should not have a languageCode value.', function() {
            var _languageCode = grecaptcha.getLanguageCode();
            
            expect(_languageCode).to.be.undefined;
        });
    });
});