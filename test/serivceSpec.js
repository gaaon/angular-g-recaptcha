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
 *  ├── #when sitekey is given,
 *  │   │
 *  │   └── should have the sitekey given in provider.
 *  │
 *  ├── should fulfill init promise then have a grecaptcha object.
 *  │
 *  ├── should fulfill init promise then have a grecaptcha object after change onLoadMethodName.
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
    
    context('#when sitekey is given,', function(){
        it('should have the sitekey given in provider.', function(){
            var _sitekey = 'my_sitekey';
            $grecaptcha.setSitekey(_sitekey);
            $grecaptcha.getSitekey().should.be.equal(_sitekey);
        })
    })
    
    it('should fulfill init promise then have a grecaptcha object.', function(){
        return $grecaptcha.init().should.be.fulfilled.then(function(){
            expect($grecaptcha.getGrecaptcha()).not.to.be.undefined;
        });
    });
    
    
    it('should fulfill init promise then have a grecaptcha object after change onLoadMethodName.', function(){
        $grecaptcha.setOnLoadMethodName('myCustomLoadMethodName');
        return $grecaptcha.init().should.be.fulfilled.then(function(){
            expect($grecaptcha.getGrecaptcha()).not.to.be.undefined;
        });
    });
    
    it('should throw an error when render is performed with invalid element parameter.', function(){
        expect($grecaptcha.render.bind($grecaptcha, undefined)).to.throw(Error, '[$grecaptcha:badel] The element is invalid.');
        
    });
    
    it('should throw an error when render is performed without a sitekey.', function(){
        expect($grecaptcha.render.bind($grecaptcha, el)).to.throw(Error, '[$grecaptcha:nositekey] The sitekey has to be provided.');
        
    });
    
    it('should fulfill promise when render is performed with correct element parameter.', function(){
        $grecaptcha.setSitekey(sitekey);
        return $grecaptcha.render(el).should.be.fulfilled;
    });
    
    context('#with render stub,', function(){
        var response;
        beforeEach(function(){
            var stub = sinon.stub($grecaptcha, 'render', function(el, onInit){
                response = 'my_response';
                
                return $q(function(resolve, reject){
                    
                    // it's like recaptcha success simulator
                    // after 1000ms, it executes callback of _parameter
                    $timeout(function(){
                        $grecaptcha.getCallback()(response);
                    }, 1000);
                    
                    resolve();
                })
            });
            
            
        });
        
        afterEach(function(){
            $grecaptcha.render.restore();
        });
        
        it('should execute recaptcha success callback after some seconds.', function(){
            var _response;
            
            var fn = sinon.spy(function(res){
                _response = res;
            });
            
            $grecaptcha.setSitekey(sitekey).setCallback(fn);
            
            $grecaptcha.render();
            
            $rootScope.$apply();
            $timeout.flush();
            
            expect(fn).to.be.calledOnce;
            expect(fn).to.be.calledWith(response);
            expect(_response).to.equal(response);
        });
    })
});