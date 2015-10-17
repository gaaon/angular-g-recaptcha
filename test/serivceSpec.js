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
        var $timeout, $rootScope, grecaptcha, 
            app = angular.module('app3', ['grecaptcha'])
            .config( function(grecaptchaProvider) {
                grecaptchaProvider.setParameters({
                    sitekey: sitekey
                });
            });
        
        beforeEach(function(){
            module(app.name);
            
            inject(function(_grecaptcha_, _$timeout_, _$rootScope_) {
                grecaptcha = _grecaptcha_;
                $timeout = _$timeout_
                $rootScope = _$rootScope_;
            });
        });
        
        describe('#without init function performed', function() {
            it('should throw error when render function is performed.', function() {
                expect(grecaptcha.render).to.throw(Error, 'Please init grecaptcha.');
                expect(grecaptcha.getGrecaptcha()).to.be.undefined;
            });
        });
        
        describe('#after init function performed', function() {
            var el;
            
            beforeEach(function() {
                el = document.createElement('div');
                document.getElementsByTagName('body')[0].appendChild(el);
                return grecaptcha.init();
            });
            
            afterEach(function() {
                document.getElementsByTagName('body')[0].removeChild(el);
            });
            
            it('should have grecaptcha object.', function() {
                var _grecaptcha = grecaptcha.getGrecaptcha();
                
                expect(_grecaptcha).not.to.be.undefined;
                _grecaptcha.should.have.property('render')
                _grecaptcha.should.have.property('reset')
                _grecaptcha.should.have.property('getResponse');
            });
            
            it('should not throw error. when render is called', function(){
                var render = sinon.spy(grecaptcha.render);
                
                render(el, {}, function(){});
            })
        });
        
        describe('#with render stub', function() {
            var el, stub;
            
            beforeEach(function() {
                el = document.createElement('div');
                document.getElementsByTagName('body')[0].appendChild(el);
                
                stub = sinon.stub(grecaptcha, 'render', function(el, param, success) {
                    $timeout(function() {
                        success('response');
                    },100);
                });
                return grecaptcha.init();
            });
            
            afterEach(function() {
                document.getElementsByTagName('body')[0].removeChild(el);
                grecaptcha.render.restore();
            });
            
            it('should give response', function(done){
                grecaptcha.render(el, {}, function(response){
                    response.should.equal('response');
                    done();
                });
                
                $timeout.flush();
            })
        })
    });
});
