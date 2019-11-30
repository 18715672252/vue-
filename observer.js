function observe(value,vm){
    if(!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}
function Observer(data) {
    this.data = data;
    this.walk(data);

}
Observer.prototype = {
    walk(data){
        var me = this;
        Object.keys(data).forEach((key)=>{
            me.convert(key,data[key]);
        })
    },
    convert(key,val){
        this.defineReactive(data,key,val)//响应式数据
    },
    defineReactive(data,key,val){
        let dep = new Dep();
        let childObj = observe(val);//递归,监听所有层次的属性
        Object.defineProperty(data,key,{
            enumerable:true,//可枚举
            configurable:false,//不能改
            get(){
                if(Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set(newVal){
                if(newVal === val) {
                    return;
                }
                val = newVal;
                childObj = observe(newVal);
                dep.notify();//通知订阅者
            }
        })
    }
}
let uid = 0;
function Dep(){
    this.id = uid++;
    this.subs = [];//订阅者
}
Dep.prototype = {
    addSub(sub){
        this.subs.push(sub)
    },
    depend(){
        Dep.target.addDep(this);
    }
}