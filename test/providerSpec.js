if( window.sitekey === undefined ) {
    throw new Error('Please add your sitekey.js.');
}

var sitekey = window.sitekey;
var angular = window.angular;

var count = 1;
var appName = function() {
    return 'provider'+(count++);
}

/***
 * Scenario
 * 
 *  Grecaptcha provider
 *  │
 *  ├── #when sitekey is not provided,
 *  │   │
 *  │   ├── should throw an error when init function be performed.
 *  │
 *  ├── #when sitekey is provided,
 *  │   │
 *  │   ├── should not throw an error when init function be performed.

***/

