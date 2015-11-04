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
 *  ├── should throw an error when render is performed with invalid element parameter.
 *  │
 *  ├── should throw an error when render is performed without a sitekey.
 *  │
 *  ├── should fulfill promise when render is performed with correct element parameter.
 *  │
 *  ├── #with render stub,
 *  │   │
 *  │   ├── should execute recaptcha success callback after some seconds.
 */
 

describe('Grecaptcha service', function(){
    var $grecaptcha, $rootScope, $timeout, $q, el;
    
    
    beforeEach(function(){
        if(window['___grecaptcha_cfg']) {
            delete window['___grecaptcha_cfg'];
        }
        module('grecaptcha');
        
        inject(function(_$grecaptcha_, _$rootScope_, _$timeout_, _$q_) {
            $grecaptcha = _$grecaptcha_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $q = _$q_;
        })
        
        el = document.createElement('div');
        
        document.querySelector('body').appendChild(el);
    })
    
    afterEach(function(){
        $rootScope.$apply();
        document.querySelector('body').removeChild(el);
    })
    
    it('should fulfill init promise.', function(){
        var gre = $grecaptcha();
        
        return gre.init().should.be.fulfilled;
    });
    
    it('should throw an error when render is performed with invalid element parameter.', function(){
        expect($grecaptcha().render.bind($grecaptcha, undefined)).to.throw(Error, '[$grecaptcha:badel] The element is invalid.');
        
    });
    
    it('should throw an error when render is performed without a sitekey.', function(){
        expect($grecaptcha().render.bind($grecaptcha, el)).to.throw(Error, '[$grecaptcha:nositekey] The sitekey has to be provided.');
        
    });
    
    it('should fulfill promise when render is performed with correct element parameter.', function(){
        var gre = $grecaptcha();
        
        gre.setSitekey(sitekey);
        return gre.render(el).should.be.fulfilled;
    });
    
    context('#with render stub,', function(){
        var response, gre;
        beforeEach(function(){
            gre = $grecaptcha();
            
            var stub = sinon.stub(gre, 'render', function(el, onDestroy, onInit){
                response = 'my_response';
                
                return $q(function(resolve, reject){
                    
                    // it's like recaptcha success simulator
                    // after 1000ms, it executes callback of _parameter
                    $timeout(function(){
                        gre.getCallback()(response);
                    }, 1000);
                    
                    resolve();
                })
            });
            
            
        });
        
        afterEach(function(){
            gre.render.restore();
        });
        
        it('should execute recaptcha success callback after some seconds.', function(){
            var _response;
            
            var fn = sinon.spy(function(res){
                _response = res;
            });
            
            gre.setSitekey(sitekey).setCallback(fn);
            gre.render();
            
            $rootScope.$apply();
            $timeout.flush();
            
            expect(fn).to.be.calledOnce.and.to.be.calledWith(response);
            expect(_response).to.equal(response);
        });
    })
});