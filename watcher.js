function Watcher(vm,exp,cb){
    this.cb = cb;//用于更新界面的回调
    this.vm = vm;
    this.exp = exp;//对应的表达式
    this.depIds = {};//n个dep的容器对象
    this.value = this.get();//当前表达式的对应的value
}
Watcher.prototype = {
    update(){
        this.run();
    },
    run(){
        let value = this.get();
        let oldVal = this.value;
        if(value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm,value,oldVal)
        }
    },
    get(){//获取当前值
        Dep.target = this;//把watcher赋值给 Dep.target
        let value = this.getVMVal();//取data里面的数据 , 会调用data里面某个属性的get方法
        Dep.target = null;
        return value;
    },
    getVMVal(){
        let exp = this.exp.split('.');
        let val = this.vm._data;
        exp.forEach(k => {
            val = val[k];
        });
        return val;
    },
    addDep(dep){
        console.log('addDep')
        if(!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
            console.log(this.depIds)
        }
    }
}