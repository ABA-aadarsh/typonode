// basic event passer - built for data transfer between screen manager and screens
class EventBus {
    private events: {[key:string]: ((data:any)=>void)[]} = {};
    on(event:string, listener: (data:any)=>void){
        if(!this.events[event]){
            this.events[event] = []
        }
        this.events[event].push(listener)
    }
    emit(event:string, data:any=null){
        if(this.events[event]){
            this.events[event].forEach(cb=>cb(data))
        }
    }
}

export default EventBus