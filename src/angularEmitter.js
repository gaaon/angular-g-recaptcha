function AngularEmitterFactory($rootScope) {
    function AngularEmitter () {
    }
    
    
    AngularEmitter.prototype = {
        evtName: function(name) {
            return "Gre:"+this.getGreId()+":"+name;    
        },
        
        
        on: function (name, callback, ctx, once) {
            var that = this, e = (this.e || (this.e = {}));
            
            var deReg = $rootScope.$on(this.evtName(name), function(){
                callback.apply(ctx, [].slice.call(arguments, 1));
                
                if(once) {
                    that.off(name, callback); deReg();
                }
            });
            
            (e[name] || (e[name] = [])).push({
                fn: callback,
                deReg: deReg
            });
            
            return this;
        },
        
        
        once: function (name, callback, ctx) {
            return this.on(name, callback, ctx, true);
        },
        
        
        off: function (name, callback) {
            var e = this.e || (this.e = {});
            var evts = e[name];
            var liveEvents = [];
            
            if(evts && callback) {
                for(var i = 0, len = evts.length ; i < len ; i++) {
                    if (evts[i].fn !== callback)
                        liveEvents.push(evts[i]);
                }
            }
            
            
            (liveEvents.length)
            ? e[name] = liveEvents
            : delete e[name];
        
            return this;
        },
        
        emit: function (name) {
            var data = [].slice.call(arguments, 1);
            $rootScope.$broadcast.bind($rootScope, this.evtName(name)).apply($rootScope, data);
            
            return this;
        },
    
        destroyEmitter: function() {
            var names = Object.keys(this.e), that = this;
            
            for(var i = 0, names_len = names.length ; i < names_len ; i++) {
                var name = names[i];
                
                for(var j = 0 ; j < that.e[name].length ; j++) {
                    that.e[name][j]();
                }
            };
            
            
            delete this.e;
        }
    };
    
    return AngularEmitter;
}
