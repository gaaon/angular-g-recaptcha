if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

//case for grecaptcha service
describe('Grecaptcha service', function() {
    describe('#without sitekey', function() {
        var grecaptcha;
        
        beforeEach(function(){
            module('grecaptcha');
            
            inject(function(_grecaptcha_){
                grecaptcha = _grecaptcha_;
            });
        });
        
        it('should throw error when render function is performed.', function() {
            expect(grecaptcha.render).to.throw(Error, 'Please set your sitekey by parameters.');
        });
        
    });
    
    describe('#with sitekey', function() {
        var grecaptcha, app = angular.module('app3', ['grecaptcha'])
            .config( function(grecaptchaProvider) {
                grecaptchaProvider.setParameters({
                    sitekey: sitekey
                });
            });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_grecaptcha_) {
                grecaptcha = _grecaptcha_;
            });
        });
        
        describe('#without init function performed', function() {
            it('should throw error when render function is performed.', function() {
                expect(grecaptcha.render).to.throw(Error, 'Please init grecaptcha.');
                expect(grecaptcha.getGrecaptcha()).to.be.undefined;
            });
        });
        
        describe('#after init function performed', function() {
            it('should have _grecaptcha value.', function() {
                return grecaptcha.init().should.eventually.have.property('render');
            });
        });
    });
});
