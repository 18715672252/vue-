function Watcher(vm,exp,cb){
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.depIds = {};
    this.value = this.get();
}
Watcher.prototype = {
    update(){
        this.run();
    },
    run(){
        let value
    }
}