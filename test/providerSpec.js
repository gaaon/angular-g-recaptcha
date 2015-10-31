if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'provider'+(count++);
};

/***
 * Scenario
 * 
 *  Grecaptcha provider
 *  │
 *  ├── #commonly,
 *  │   │
 *  │   ├── should be able to set sitekey without any error.
 *  │   │
 *  │   ├── #with incorrect arguments,
 *  │   │   │
 *  │   │   ├── should throw an error when setTheme is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setType is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setSize is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setTabindex is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setCallback is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setExpiredCallback is called.
 *  │   │   │
 *  │   │   ├── should throw an error when setLanguageCode is called.
 *  │   │   │
 *  │   │   └── should throw an error when setParams is called.
 *  │   │   
 *  │   │
 *  │   ├── #with correct arguments,
 *  │   │   │
 *  │   │   ├── should not throw an error when setTheme is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setType is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setSize is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setTabindex is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setCallback is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setExpiredCallback is called.
 *  │   │   │
 *  │   │   ├── should not throw an error when setLanguageCode is called.
 *  │   │   │
 *          └── should not throw an error when setParams is called.
***/

describe('Grecaptcha provider', function(){
    context('#commonly,', function(){
        
        var $GrecaptchaProvider, $rootScope, $grecaptcha;
        
        beforeEach(function(){
            module('grecaptcha', function($grecaptchaProvider){
                $GrecaptchaProvider = $grecaptchaProvider;    
            });
            
            inject(function(_$rootScope_, _$grecaptcha_){
                $rootScope = _$rootScope_;
                $grecaptcha = _$grecaptcha_;
            });
        });
        
        afterEach(function(){
            $rootScope.$digest();
        });
        
        
        
        it('should be able to set sitekey without any error.', function(){
            expect($GrecaptchaProvider.setSitekey.bind($GrecaptchaProvider, sitekey))
            .not.to.throw(Error);
            
            $grecaptcha.getSitekey().should.equal(sitekey);
        });
        
        
        context('#with incorrect arguments,',function(){
            
            it('should throw an error when setTheme is called.', function(){
                expect($GrecaptchaProvider.setTheme.bind($GrecaptchaProvider, 'incorrect_theme'))
                .to.throw(Error, '[$grecaptcha:badtheme] A theme has to be one of ["dark","light"].');
            });
            
            
            
            it('should throw an error when setType is called.', function(){
                expect($GrecaptchaProvider.setType.bind($GrecaptchaProvider, 'incorrect_type'))
                .to.throw(Error, '[$grecaptcha:badtype] A type has to be one of ["audio","image"].');
            });
            
            
            
            it('should throw an error when setSize is called.', function(){
                expect($GrecaptchaProvider.setSize.bind($GrecaptchaProvider, 'incorrect_size'))
                .to.throw(Error, '[$grecaptcha:badsize] A size has to be one of ["compact","normal"].');
            });
            
            
            
            it('should throw an error when setTabindex is called.', function(){
                var items = ['str', function(){}, {'a' : 1 }, true];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setTabindex.bind($GrecaptchaProvider, item))
                    .to.throw(Error, '[$grecaptcha:badtabindex] A tabindex has to be a number.');
                });
            });
            
            
            
            it('should throw an error when setCallback is called.', function(){
                var items = ['str', 1234, {a: '1'}, true];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setCallback.bind($GrecaptchaProvider, item))
                    .to.throw(Error, '[$grecaptcha:badcallback] A callback has to be a function.');
                });
            });
            
            
            
            it('should throw an error when setExpiredCallback is called.', function(){
                var items = ['str', 1234, {a: '1'}, true];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setExpiredCallback.bind($GrecaptchaProvider, item))
                    .to.throw(Error, '[$grecaptcha:badexpcallback] A expired-callback has to a function.');
                });
            });
            
            
            
            it('should throw an error when setLanguageCode is called.', function(){
                var items = ['kr', 'jp', 'eng', 'es-418'];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setLanguageCode.bind($GrecaptchaProvider, item))
                    .to.throw(Error, '[$grecaptcha:badlan] The languageCode is invalid.');
                });
            });
            
            
            
            it('should throw an error when setParams is called.', function(){
                var items = [
                    {
                        sitekey: sitekey,
                        theme: 'right',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'emage',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'qormal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 'tabindex',
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: 1,
                        'expired-callback': function(){},
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': 123,
                        languageCode: "ko"
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: "kr"
                    }
                ];
                
                angular.forEach(items, function(item, ind){
                    expect($GrecaptchaProvider.setParameters.bind($GrecaptchaProvider, item))
                    .to.throw(Error);
                    
                    if(ind == 5) {
                        expect($GrecaptchaProvider.setParameters.bind($GrecaptchaProvider, item))
                        .to.throw(Error, '[$grecaptcha:badexpcallback] A expired-callback has to a function.');
                    }
                    else if(ind == 6) {
                        expect($GrecaptchaProvider.setParameters.bind($GrecaptchaProvider, item))
                        .to.throw(Error, '[$grecaptcha:badlan] The languageCode is invalid.');
                    }
                });
            })
        });
        
        
        
        context('#with correct arguments,',function(){
            it('should not throw an error when setTheme is called.', function(){
                var items = ['dark', 'light', 'Dark', 'DArk', 'Light', 'LIghT'];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setTheme.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badtheme] A theme has to be one of ["dark","light"].');
                    
                    $grecaptcha.getTheme().should.equal(item.toLowerCase());
                });
            });
            
            
            
            it('should not throw an error when setType is called.', function(){
                var items = ['image', 'audio', 'Audio', 'Image', 'imAGe', 'AUDIo'];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setType.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badtype] A type has to be one of ["audio","image"].');
                    
                    $grecaptcha.getType().should.equal(item.toLowerCase());
                });
            });
            
            
            
            it('should not throw an error when setSize is called.', function(){
                var items = ['compact', 'normal', 'Compact', 'Normal', 'comPAct', 'NoRmAl'];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setSize.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badsize] A size has to be one of ["compact","normal"].');
                    
                    $grecaptcha.getSize().should.equal(item.toLowerCase());
                });
                
            });
            
            
            
            it('should not throw an error when setTabindex is called.', function(){
                var items = [-1000, -100, -10, 0, 10, 100, 1000];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setTabindex.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badtabindex] A tabindex has to be a number.');
                    
                    $grecaptcha.getTabindex().should.equal(item);
                });
            });
            
            
            
            it('should not throw an error when setCallback is called.', function(){
                function cb(){
                    console.log('Glad to meet you!');
                }
                
                var cb2 = function() {
                    console.log('Glad to meet you,too!');
                };
                
                var items = [cb, cb2, function(){}];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setCallback.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badcallback] A callback has to be a function.');
                    
                    $grecaptcha.getCallback().should.equal(item);
                });
            });
            
            
            
            it('should not throw an error when setExpiredCallback is called.', function(){
                 function cb(){
                    console.log('Glad to meet you!');
                }
                
                var cb2 = function() {
                    console.log('Glad to meet you,too!');
                };
                
                var items = [cb, cb2, function(){}];
                
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setExpiredCallback.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badexpcallback] A expired-callback has to a function.');
                    
                    $grecaptcha.getExpiredCallback().should.equal(item);
                });
            });
            
            
            
            it('should not throw an error when setLanguageCode is called.', function(){
                var items = ['ko', 'ja', 'en', 'es-419'];
                
                angular.forEach(items, function(item){
                    expect($GrecaptchaProvider.setLanguageCode.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error, '[$grecaptcha:badlan] The languageCode is invalid.');
                    
                    $grecaptcha.getLanguageCode().should.equal(item);
                });
                
            });
            
            it('should not throw an error when setParams is called.', function(){
                var items = [
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: 'ko'
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'dark',
                        type: 'Image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: 'ja'
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'Audio',
                        size: 'Compact',
                        tabindex: 0,
                        callback: function(){ console.log('Nice to meet you!'); },
                        'expired-callback': function(){},
                        languageCode: 'en'
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'DARK',
                        type: 'AUDIO',
                        size: 'COMPACT',
                        tabindex: 1000,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: 'fr'
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: 'nl'
                    },
                    
                    {
                        sitekey: sitekey,
                        theme: 'light',
                        type: 'image',
                        size: 'normal',
                        tabindex: 0,
                        callback: function(){},
                        'expired-callback': function(){},
                        languageCode: 'de'
                    }
                ];
                
                angular.forEach(items, function(item, ind){
                    expect($GrecaptchaProvider.setParameters.bind($GrecaptchaProvider, item))
                    .not.to.throw(Error);
                    
                });
            });
        });
        
    });
});