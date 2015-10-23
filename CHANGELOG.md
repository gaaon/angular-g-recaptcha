<a name="TODO"></a>
# TODO

## What to add someday

- **grecaptcha:**
    - transclusde
    - data-stoken


- **$grecaptcha:**
    - hide global grecaptcha
    - allow loading message template
    - validate the languageCode whether it is available ([link](https://developers.google.com/recaptcha/docs/language))
    - validate the paramters whether it is available ([link](https://developers.google.com/recaptcha/docs/display#render_param))
    - ability to reset current recaptcha


<a name="NOTTODO"></a>
# NOTTODO

## What not to add

- **$grecaptcha:**
    - verfiy the response in client side (Recaptcha secret key will be exposed to the client..)


<a name="1.1.2"></a>
# 1.1.2 (2015-10-22)

## Features

- **$grecaptchaProvider:**
    - allow set onLoadMethodName (default name is 'onRecaptchaApiLoaded')


- **$grecaptcha:**
    - allow get onLoadMethodName


- **grecaptcha:**
    - catch rejected promise and throw error wrapping the reason
    - remove logging 'recaptcha expired!' in console after recaptcha be expired


## Breaking Changes
- **$grecaptcha:**
    - reject with more clear message when sitekey is not provided
        <code>
            Error: [$grecaptcha:sitekey] The sitekey is necessary.
        </code>


<a name="1.1.1"></a>
# 1.1.1 (2015-10-22)

## Bug Fixes

- **grecaptcha:**
    - fix below error by deleting the table 'pls-container' when scope is destroyed
        <code>
            Uncaught SecurityError: blocked a frame with origin "https://www.google.com" 
            from accessing a frame with origin "<your domain>"
        </code>
    - google recaptcha faq about this error ([link](https://developers.google.com/recaptcha/docs/faq#im-getting-an-uncaught-securityerror-blocked-a-frame-with-origin-httpswwwgooglecom-from-accessing-a-frame-with-origin-your-domain-what-should-i-do))
    
<a name="1.1.0"></a>
# 1.1.0 (2015-10-20)

## Features

- **$grecaptcha:**
    - allow set and get a loading message that be shown before recaptcha box is loaded
    - perform method 'init' when method 'render' is called if local grecaptcha object is undefined
    - method 'render' returns promise
    - add checking whether callback and expire-callback of _parameters object exist and use them if do


- **$grecaptchaProvider:** allow set the loading message


- **grecaptcha:**
    - show the loading message at child node before recaptcha box is loaded
    - set viewValue of ngModel that is required when recaptcha answer is over
    - accept parameters as attribute of itself

## Breaking Changes

- **$grecaptcha:** due to creation of grecaptcha directive, rename grecaptcha to $grecaptcha


<a name="1.0.0"></a>
# 1.0.0 (2015-10-18)

## Features

- **grecaptcha:**
    - handle grecaptcha object of google recaptcha
    - create recaptcha script asynchronously when it is needed
    - callback and expire-callback are in scope digest cycle.
    - allow to set and get various parameters(sitekey, theme, languageCode etc)


- **grecaptchaProvider:** allow to set various parameters(sitekey, theme, languageCode etc)