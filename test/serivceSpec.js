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
 *  ├── should fulfill init promise then have a grecaptcha object.
 *  │
 *  ├── should fulfill init promise then have a grecaptcha object after change onLoadMethodName.
 *  │
 *  ├── should throw an error when render is performed with invalid element parameter.
 *  │
 *  ├── should throw an error when render is performed without a sitekey.
 *  │
 *  ├── should fulfill promise when render is performed with correct element parameter.

 */
 

describe('Grecaptcha service', function(){
    var $grecaptcha, $rootScope, $timeout, el;
    
    
    beforeEach(function(){
        if(window['___grecaptcha_cfg']) {
            delete window['___grecaptcha_cfg'];
        }
        module('grecaptcha');
        
        inject(function(_$grecaptcha_, _$rootScope_, _$timeout_) {
            $grecaptcha = _$grecaptcha_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
        })
        
        el = document.createElement('div');
        
        document.querySelector('body').appendChild(el);
    })
    
    afterEach(function(){
        $rootScope.$apply();
        document.querySelector('body').removeChild(el);
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
    
    
});