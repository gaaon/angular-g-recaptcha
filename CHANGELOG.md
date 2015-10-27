<a name="TODO"></a>
# TODO

## What to add someday

- **grecaptcha:**
    - data-stoken


- **$grecaptcha:**
    - hide global grecaptcha object
    - validate the paramters whether it is available ([link](https://developers.google.com/recaptcha/docs/display#render_param))
    - manage all grecaptcha widgets(add, delete)


<a name="NOTTODO"></a>
# NOTTODO

## What not to add

- **$grecaptcha:**
    - verfiy the response in client side (Recaptcha secret key will be exposed to the client..)
    - add onInit callback to render method


<a name="1.2.0"></a>
# 1.2.0 (2015-10-26)

## Features

- **$grecaptcha:**
    - 'onInit' parameter is added into 'render' method
    - onInit parameter will be performed after init method be executed
    - add 'reset' and 'getResponse' methods
    - reset recaptcha widget with optional widget id, defaults to first created widget if unspecified
    - get response from recaptcha widget with optional widget id, defaults to first created widget if unspecified


## Breaking Changes

- **$grecaptcha:**
    - remove get/set loadingMessage 
    - don't use loadingMessage any more


- **grecaptcha:**
    - show inner html in grecaptcha directive until recaptcha box be loaded


<a name="1.1.3"></a>
# 1.1.3 (2015-10-25)

## Features

- **grecaptchaLanguageCodes:**
    - provide available languageCodes list


- **$grecaptcha:**
    - validate the languageCode and throw error if invalid


## Bug Fixes

- **$grecaptcha:**
    - fix a error that provided languageCode was not applied


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