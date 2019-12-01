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
            me.convert(data,key,data[key]);
        })
    },
    convert(data,key,val){
        this.defineReactive(data,key,val)//响应式数据
    },
    defineReactive(data,key,val){
        let dep = new Dep();
        let childObj = observe(val);//递归,监听所有层次的属性
        Object.defineProperty(data,key,{
            enumerable:true,//可枚举
            configurable:false,//不能改
            get(){//Dep和watcher建立关系 , 编译模板时建立关系
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
    this.subs = [];//订阅者 n个相关的watcher容器
}
Dep.prototype = {
    addSub(sub){
        this.subs.push(sub)
    },
    depend(){//Dep和watcher建立关系
        Dep.target.addDep(this);
    },
    notify(){
        this.subs.forEach((sub)=>{//sub代表每个watcher
            sub.update();
        })
    }
}
Dep.target = null;