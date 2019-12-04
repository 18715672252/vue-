function observe(value,vm){
    if(!value || typeof value !== 'object') {//被观察者必须是一个对象
        return;
    }
    return new Observer(value);//创建对应Observer,
}
function Observer(data) {
    this.data = data;//保存data
    this.walk(data);//开启对data的劫持

}
Observer.prototype = {
    walk(data){
        var me = this;
        Object.keys(data).forEach((key)=>{
            me.convert(data,key,data[key]);//对指定的属性进行劫持,实现响应式的数据绑定
        })
    },
    convert(data,key,val){
        this.defineReactive(data,key,val)//响应式数据
    },
    defineReactive(data,key,val){
        let dep = new Dep();//创建属性对应的dep(订阅器)
        let childObj = observe(val);//递归,监听所有层次的属性的数据劫持
        //给data重新定义属性 , 给每个属性添加get/set方法添加
        Object.defineProperty(data,key,{
            enumerable:true,//可枚举
            configurable:false,//不能改
            get(){//Dep和watcher建立关系 , 编译模板时建立关系
                if(Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set(newVal){//监视data中属性的变化 , 更新界面
                if(newVal === val) {
                    return;
                }
                val = newVal;
                childObj = observe(newVal);//新的值如果obj继续劫持
                dep.notify();//通知所有相关的订阅者(watcher)
            }
        })
    }
}
let uid = 0;
//每个data的属性对应一个dep对象 , 这个属性在模板中出现几次就会有new Watcher实例对象与之对应,并全部保存到这个data属性的dep.subs数组里面的元素
function Dep(){
    this.id = uid++;
    this.subs = [];//订阅者 n个相关的watcher容器
}
Dep.prototype = {
    //添加watcher带dep种
    addSub(sub){
        this.subs.push(sub)
    },
    depend(){//Dep和watcher建立关系 
        Dep.target.addDep(this);//将watcher添加到dep中 , 同时也将dep添加到watcher
        console.log(this.subs)
    },
    notify(){
        this.subs.forEach((sub)=>{//sub代表每个watcher
            sub.update();
        })
    },
    removeSub(sub){
        let index = this.subs.indexOf(sub);
        if(index != -1) {
            this.subs.splice(index,1)
        }
    }
}
Dep.target = null;