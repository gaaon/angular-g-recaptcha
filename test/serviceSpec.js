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
 *  ├── should fulfill init promise.
 *  │
 *  ├── should throw an error if render with a incorrect elemenent.
 *  │
 *  ├── should throw an error if render without a sitekey.
 *  │
 *  ├── should fulfill promise and return self if render with correct parameters.
 *  │
 *  ├── should execute one function callback after some seconds.
 *  │
 *  ├── should execute array of functions callback after some seconds.
 *  │
 *  ├── should throw an error with array of functions callback which causes error.
 * 
 * 
 */
 

describe('Grecaptcha service', function(){
    var $grecaptcha, $rootScope, $timeout, $q;
    
    var el, response, innerEl, fakeGrecaptcha, widgetId, spy;
    
    beforeEach(function(){
        if(window['___grecaptcha_cfg']) {
            delete window['___grecaptcha_cfg'];
        }
        
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
                response = undefined;
            },
            
            getResponse: function(widgetId) {
                return response;
            }
        };
        
        spy = sinon.spy(fakeGrecaptcha, 'render');
        
        module('wo.grecaptcha', function($grecaptchaProvider){
            $grecaptchaProvider
            .setGrecaptcha(fakeGrecaptcha);
        });
        
        inject(function(_$grecaptcha_, _$rootScope_, _$timeout_, _$q_) {
            $grecaptcha = _$grecaptcha_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $q = _$q_;
        });
        
        
        el = document.createElement('div');
        document.querySelector('body').appendChild(el);
    });
    
    
    
    afterEach(function(){
        if(!$rootScope.$$phase) { // Though this is anti-pattern, have no alternatives
            $rootScope.$apply();
        }
        
        spy.restore();
        response = undefined;
        
        try {
            document.querySelector('body').removeChild(el);
        } catch(e) {}
    });
    
    
    
    it('should fulfill init promise.', function(){
        var gre = $grecaptcha();
        
        gre.init().should.be.fulfilled;
        
    });
    
    
    
    it('should throw an error if render with a incorrect elemenent.', function(){
        var gre = $grecaptcha();
        
        var els = [undefined, 'not element', 1234];
        
        angular.forEach(els, function(val) {
            expect(gre.render.bind(gre,val)).to.throw(Error, '[gre:badel] The element is invalid.');
        });
    });
    
    
    
    it('should throw an error if render without a sitekey.', function(){
        var gre = $grecaptcha();
        
        expect(gre.render.bind(gre, el)).to.throw(Error, '[gre:nositekey] The sitekey has to be provided.');
        
    });
    
    
    
    it('should fulfill promise and return self if render with correct parameters.', function(){
        var gre = $grecaptcha().set('sitekey', sitekey), res;
        
        gre.render(el).should.be.fulfilled.then(function(_res){
            res = _res;
        });
        
        $rootScope.$apply();
        
        expect(spy).to.be.calledOnce;
        expect(spy).to.be.returned(0);
        expect(spy).to.be.calledWith(el);
        
        expect(el).to.contain(innerEl);
    });
    
    
    it('should execute one function callback after some seconds.', function(){
        var myRes, gre = $grecaptcha().set({
            sitekey: sitekey,
            callback: function(res){
                myRes = res;
            }
        });
        
        gre.render(el).should.be.fulfilled.then(function(_res){
            expect(_res).to.be.equal(gre);
        });
        
        $rootScope.$apply();
        
        expect(response).to.be.undefined;
        expect(myRes).to.be.undefined;
        
        $timeout.flush();
        
        expect(response).to.be.equal('fake response');
        expect(myRes).to.be.equal(response);
    });
    
    
    
    it('should execute array of functions callback after some seconds.', function(){
        var res_array = [];
        
        var gre = $grecaptcha().set({
            sitekey: sitekey,
            callback: [
                function(res) {
                    res_array.push(res); // 'fake response'
                    
                    return res+'1';
                },
                
                function(res) {
                    res_array.push(res); // 'fake response1'
                    
                    return res+'2';
                },
                
                function(res) {
                    res_array.push(res); // 'fake response12'
                }
            ]
        });
        
        gre.render(el).should.be.fulfilled.then(function(_res){
            expect(_res).to.be.equal(gre);
        });
        
        $rootScope.$apply();
        $timeout.flush();
        
        var expected_res = ['fake response', 'fake response1', 'fake response12'];
        
        for(var i = 0 ; i < res_array.length ; i++) {
            expect(res_array[i]).to.be.equal(expected_res[i]);
        }
    });
    
    
    
    it('should throw an error with array of functions callback which causes error.', function(){
        var res_array = [];
        
        var gre = $grecaptcha().set({
            sitekey: sitekey,
            callback: [
                function(res) {
                    res_array.push(res); // 'fake response'
                    
                    return res+'1';
                },
                
                function(res) {
                    throw new Error('error!!');
                    
                    return res;
                },
                
                function(res) {
                    res_array.push(res); // 'fake response1'
                    
                    return res+'2';
                },
                
                function(res) {
                    res_array.push(res); // 'fake response12'
                }
            ]
        });
        
        gre.render(el).should.be.fulfilled.then(function(_res){
            expect(_res).to.be.equal(gre);
        });
        
        $rootScope.$apply();
        
        try {
            $timeout.flush();
        } catch(e) {
            expect(e.message).to.be.equal('error!!');
        }
        
        expect(res_array).to.have.length(1);
    });
    
    
    
    it('should emit a "reset" when render method is executed.', function(){
        var gre = $grecaptcha().set({'sitekey' :sitekey});
        
        var spy = sinon.spy();
        
        var that = gre.on("reset", spy);
        
        gre.reset();
        
        expect(spy).to.be.calledOnce;
        expect(spy).to.be.calledWith(undefined);
        
        gre.reset();
        gre.reset();
        
        expect(spy).to.be.calledThrice;
        expect(that).to.be.eql(gre);
    });
    
    
    it('should emit a "reset" and pass response with reset event.', function(){
        var gre = $grecaptcha().set({'sitekey' :sitekey});
        
        var spy = sinon.spy();
        
        gre.on("reset", spy);
        
        gre.render(el).should.be.fulfilled;
        $rootScope.$apply();
        $timeout.flush();
        
        gre.reset();
        
        expect(spy).to.be.calledOnce;
        expect(spy).to.be.calledWith('fake response');
        
        gre.reset();
        
        expect(spy).to.be.calledTwice;
        expect(spy).to.be.calledWith(undefined);
    });
    
    
    it('should emit a "destroy" when element be removed.', function(){
        var gre = $grecaptcha().set({'sitekey' :sitekey});
        
        var spy = sinon.spy();
        
        gre.on("destroy", spy);
        
        gre.render(el).should.be.fulfilled;
        $rootScope.$apply();
        
        angular.element(el).remove();
        expect(spy).to.be.calledOnce;
        
    });
});