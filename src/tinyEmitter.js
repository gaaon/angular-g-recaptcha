function TinyEmitterFactory() {
    /**
     *  This code is made by scottcorgan.
     * 
     *  And updated by Taewoo a little.
     * 
     *  https://github.com/scottcorgan/tiny-emitter
     */
     
    /**
     * Is it right to delete this Emitter?
     * Can AngualrEmitter be a alternative?
     * 
     */
    function TinyEmitter () {
    	// Keep this empty so it's easier to inherit from
      // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
    }
    
    TinyEmitter.prototype = {
        addListener: function (event, callback, ctx, once) {
            var listeners = this.$$listeners || (this.$$listeners = {});
            
            (listeners[event] || (listeners[event] = [])).push({
                callback: callback,
                ctx: ctx,
                once: once
            });
    
            return this;
        },
        
        
        on : function() {
            return this.addListener.apply(this, arguments);
        },
        
        
        once: function (event, listener, ctx) {
            return this.on(event, listener, ctx, true);
        },
        
        
        emit: function (event) {
            var data = [].slice.call(arguments, 1);
            var lstArr = ((this.$$listeners || (this.$$listeners = {}))[event] || []).slice();
            
            
            for (var i = 0, len = lstArr.length ; i < len ; i++) {
                var lst = lstArr[i];
                
                lst.callback.apply(lst.ctx, data);
                
                if(lst.once) this.off(event, lst.callback);
            }
    
            return this;
        },
        
            
        removeListener: function (event, callback) {
            var listeners = (this.$$listeners || (this.$$listeners = {}))[event];
            var live = [];
    
            
            if (listeners && callback) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i].callback !== callback)
                        live.push(listeners[i]);
                }
            }
    
            (live.length) ? this.$$listeners[event] = live : delete this.$$listeners[event];
        
            return this;
        },
        
        
        off: function() {
            return this.removeListener.apply(this, arguments);  
        },
        
        
        removeAllListener: function(event) {
            event ? this.removeListener(event) : delete this.listeners;
            
            return this;
        },
        
        
        //added
        destroyEmitter: function() {
            this.removeAllListener();
        }
    };
    
    return TinyEmitter;
}