<a name="TODO"></a>
# TODO

## What to add someday

- **grecaptcha:**
    - transclusde


- **$grecaptcha:**
    - hide global grecaptcha
    - allow loading message template


<a name="NOTTODO"></a>
# NOTTODO

## What not to add

- **$grecaptcha:**
    - verfiy the response in client side (Recaptcha secret key will be exposed to the client..)

<a name="1.1.0"></a>
# 1.1.0 (2015-10-20)

## Feature

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

## Feature

- **grecaptcha:**
    - handle grecaptcha object of google recaptcha
    - create recaptcha script asynchronously when it is needed
    - callback and expire-callback are in scope digest cycle.
    - allow to set and get various parameters(sitekey, theme, languageCode etc)


- **grecaptchaProvider:** allow to set various parameters(sitekey, theme, languageCode etc)