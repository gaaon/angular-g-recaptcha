# angular-g-recaptcha
Angular module for google recaptcha

---
<a name="get_started"></a>
## Get Started

### [1] Installation

Install with npm


```shell
npm install angular-g-recaptcha
```

Install with bower


```shell
bower install angular-g-recaptcha --save
```

### [2] Usage

In html


```html
<!doctype html>
<html ng-app="myApp">
    <head>
        ...
    </head>
    <body>
        ...
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script> 
        <script src="path/to/bower_components/angular-g-recaptcha/angular-g-recaptcha.js"></script> 
        <script>
            var myApp = angular.module('myApp', ['wo.grecaptcha']);
        </script> 
    </body>
</html>
```

---

<a name="feature"></a>
## Features

- Load recaptcha script automatically
- Wrap callbacks with $rootScope.$apply
- Inherit event emitter so that handle events easily and well

---

<a name="api"></a>
## API

[API document link](http://wooooo.github.io/angular-g-recaptcha/docs)

### Provider

**$grecaptchaProvider**

Allow set recaptcha 'default' config, languageCode, onLoadMethodName in config phase.


```javascript
var app = angular.moudule('myApp', ['wo.grecaptcha'])
.config(function($grecaptchaProvider) {
    $grecaptchaProvider.set({ // default recaptcha config

        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // google official test site key
        
        theme: 'Light',     // 'light', 'dark' (not case sensitive)
        
        type: 'image',      // 'image', 'audio' (not case sensitive)
        
        size: 'NORMAL',     // 'normal', 'compact' (not case sensitive)
        
        tabindex: 0,        // number
        
        callback: [         // function or array of functions, 
                            // function returning promise is supported
            function(res) {
                console.log(res);   // response provided by recaptcha box
                return res;
            },
            
            function(res) {
                res += 'suffix';
                return res;         // 'suffix' will be appended
            }
        ],
        
        'expired-callback': function() {    // function or array of functions
                                            // function returning promise is supported
            console.log('expired!!');
        },
        
        languageCode: 'ko', // languageCodes available in $greLanguageCodes
        
        onLoadMethodName: 'onRecaptchaApiLoaded'    // name of method executed when
                                                    // recaptcha script be loaded
    })
    .setType('image');      // can chain set method because it returns self
                            // can also set property with appending its capitalizing name 
                            // e.g. 'setType', 'setSize', 'setTabindex', etc
});
```


### Directive

**grecaptcha**

- Insert response into ngModel.
- Insert promise and widget id about gre object into given greInfo object.
- Update ngModel value to undefined when resetting recaptcha box is done.

```html
<!-- index.html -->
<div data-ng-controllers="greCtrl">
    <div grecaptcha="{sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', theme: 'dark'}" 
        data-ng-model="response" gre-info="info">
        Loading..
    </div>
    
    <div data-ng-bind="respone"> </div>
</div>
```

```javascript
// ctrl.js
app.controllers('greCtrl', function($scope) {
    $scope.info = {};   // an object where gre promise and widget id will be contained
    
    $scope.$on('response', function() {
        console.log($scope.response);               // resposne of recaptcha box
    });
    
    $scope.$on('info', function() {
        $scope.info.promise.then(function(gre) {
            console.log($scope.info.widgetId);      // widget id of gre instance
        });
    });
});
```

### Service

**$grecaptcha**

- Return existing gre instance or create new gre instance according to parameters

```javascript
app.directive('greDirective', function($scope, $grecaptcha, $timeout, $q, $document) {
    var options = { // own config, not default recaptcha config!!
        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        theme: 'DARK',
        type: 'audio',
        size: 'compact',
        tabindex: 10,
        callback: [
            function(res) {
                return $q(function(resolve, reject) {
                    $timeout(function() {
                        resolve(res);
                    }
                }, 1000);
            },
            
            function(res) {
                $scope.response = res;
                
                return res;
            }
        ],
        'expired-callback': function() {
            $scope.response = undefined;
        }
    };
    
    var gre = $grecaptcha(options);         // create new gre instance with options
    
    var el = $document[0].querySelector('.g-recaptcha');
    
    gre.render(el).then(function() {
        
        var gre2 = $grecaptcha(gre.getWidgetId());  // return the gre instance
        
        if( gre === gre2 ) console.log(true);       // true
    });
})
```

- Get onLoadMethodName, private grecaptcha object, languageCode.


```javascript
//after init is finished
$grecaptcha.getOnLoadMethodName();      // 'onLoadMethodName'

$grecapcha.getGrecaptcha();             // Object {render: function{...}, reset: function{...}, getResponse: function{...}}
$grecaptcha.getLanguageCode();          // 'ko'

```

### Type
**gre**

- Init a private grecaptcha object if not exist.
- Set recaptcha config and validate them. (cannot set onLoadMethodName, languageCode)
- Render a recaptcha box at the provided element with its own config.
- Register event listeners and emit events like 'destroy', 'reset'.
- Get recaptcha config value.

```javascript
var gre = $grecaptcha();

gre     // These options are its own config.
.set('sitekey', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')
.set('theme', 'LIGHT')
.set('size', 'NoRmAl');
.set('callback', function(res) {
    $scope.response = res;
});

gre.get('sitekey');     // '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
gre.get('theme');       // 'light'
gre.get('size');        // 'normal'

gre.on('reset', function() {        // register a listener to 'reset' event
    $scope.response = undefined;
});

gre.on('destroy', function() {
    console.log('Destroy!!!');
});

gre.init().then(function() {                // init grecaptcha object

    return gre.render(el).then(function() { //render recaptcha box
    
        console.log(gre.getWidgetId()); //  widget id of recaptcha box
    });
});
```


---

<a name="license"></a>
## License

[MIT](LICENSE)