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
 *  │   ├── should throw error when set invalid languageCode.
 *  │   │
 *  │   ├── should not throw error when set valid languageCode.
 *  │   │
 *  │   └── #when there is no widget,
 *  │       │    
 *  │       ├── should throw error when execute reset without parameter.
 *  │       │
 *  │       ├── should throw error when execute reset with parameters.
 *  │       │
 *  │       ├── should throw error when execute getResponse without parameter.
 *  │       │
 *  │       ├── should throw error when execute getResponse with parameters.
 *  │   
 *  ├── #without init funciton performed,
 *  │   │
 *  │   ├── should have not a _scriptTag object.
 *  │   │
 *  │   ├── should not have a _grecaptcha object.
 *  │   │   (_grecaptcha is created after init method called)
 *  │   │   
 *  │   ├── should be fulfilled when render function is called.
 *  │   │   (init method is automatically called if _grecaptcha object is undefined)
 *  │   │
 *  │   ├── #after set onLoadMethodName,
 *  │       │
 *  │       └── should fulfill init function without an error.
 *  │
 *  └── #after init function performed,
 *      │
 *      ├── should have the _scriptTag object.
 *      │
 *      ├── should have the _grecaptcha object.
 *      │
 *      ├── should be fulfilled when render function is called.
 *      │
 *      └── #with stub render function,
 *          │
 *          └── should perform a callback.
 **/
