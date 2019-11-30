//更新节点属性值
let updater = {
    textUpdater(node,value){
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    htmlUpdater(node,value){//更新节点的innerHTML属性值
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },
    classUpdater(node,value,oldValue){//更新节点的className属性值
        let className = node.className;
        className = className.replace(oldValue,'').replace(/\s$/,'');
        let space = className && String(value) ? ' ' : '';
        node.className = className + space + 'value';
    },
    modelUpdater(node,value,oldValue) {//更新节点的value属性值
        node.value = typeof value == 'undefined' ? '' : value;
    }
}
//包含多个解析指令的方法的工具对象
let compileUtil = {
    text(node,vm,exp) {//解析v-text/{{}}
        console.log(vm)
        console.log('text')
        this.bind(node,vm,exp,'text');
    },
    html(node,vm,exp){//解析v-html

    },
    model(node,vm,exp){////解析v-model

    },
    class(){//解析v-class

    },
    bind(node,vm,exp,dir){//
        console.log(vm)
        console.log('bind')
        let updaterFn = updater[dir + 'Updater'];//拿到更新节点的对应函数
        updaterFn && updaterFn(node,this._getVMVal(vm,exp));//updaterFn如果函数不存在不执行 , 存在的执行,更新节点
        // new Watcher(vm,exp,function(value,oldValue){
        //     updaterFn && updaterFn(node,value,oldValue);
        // })
    },
    eventHandler(node,vm,exp,dir){
        let eventType = dir.split(':')[1];//得到事件类型 click
        fn = vm.$options.methods && vm.$options.methods[exp];//从methods中得到对应的事件回调函数
        if(eventType && fn) {//如果都存在
            node.addEventListener(eventType,fn.bind(vm),false);//给节点绑定指定的事件类型和回调函数DOM事件监听
        }
       
    },
    _getVMVal(vm,exp) {//从vm得到表达式所对应的值
        let val = vm._data;
        exp = exp.split('.');
        exp.forEach((k)=>{
            val = val[k]
        })
        console.log(val)
        return val;
    },
    _setVMVal(vm,exp,value){

    }
}

function Compile(el,vm){//el:绑定的元素  vm:实例对象
    console.log(vm)
    this.$vm  = vm;
    this.$el = this.isElementNote(el) ? el : document.getElementById(el);//存储dom元素
    console.log(this.$el)
    if(this.$el) {
        console.log(1)
        this.$fragment = this.node2Fragment(this.$el);//el里面所有的子节点转移到文档碎片中,即:实例绑定的元素里面的内容转移到文档碎片中(内存)
        this.init();//解析模板,编译文档碎片中所有层次的子节点,即内存中节点
        this.$el.appendChild(this.$fragment);//编译好的文档碎片 , 重新放回实例绑定的元素里面
    }
}
Compile.prototype = {
    isElementNote(el){//返回true,代表元素节点
        return el.nodeType === 1;
    },
    node2Fragment(el){
        var fragment  = document.createDocumentFragment();//创建一个文档碎片,存放实例绑定的元素里面的内容(el里面所有的节点转移到文档碎片中)
        var child;
        //这个while会把实例绑定的元素里面的内容清空 , 并把里面的全部放进fragment文档碎片中
        while(child = el.firstChild){//一个节点只能有一个父级
            fragment.appendChild(child)//appendChild的作用 1.先将child从原先父级中移除 2.在添加到fragment文档碎片中
        }
        return fragment;
    },
    init(){
        //编译指定元素(所有层次子节点)
        this.compileElement(this.$fragment);
    },
    compileElement(fragment) {//编译fragment节点所有层次子节点
        let childNodes = fragment.childNodes;//获取最外层的所有子节点包括换行什么的(即:文档碎片里面所有的内容) 节点数组:伪数组
        let me = this;
        Array.prototype.slice.call(childNodes).forEach(node => { //遍历所有最外层子节点,伪数组转化为真数组 , 并遍历
            let text = node.textContent;//获取节点的文本内容
            let reg = /\{\{(.*)\}\}/ //匹配{{}}表达式
            if(me.isElementNote(node)) {//判断节点是不是元素节点 ,是的话编译元素节点
                me.compile(node)//编译解析指令
            }else if(me.isTextNode(node) && reg.test(text)) { //判断节点是否是{{}}的格式文本节点
                //console.log(2)
                me.compileText(node,RegExp.$1);//RegExp.$1代表{{name}}中name , 编译大括号表达式文本节点
            }
            if(node.childNodes && node.childNodes.length) {//判断节点是否有子节点?通过递归调用实现所有层次节点的编译
                me.compileElement(node)
            }
        });
    },
    compile(node){
        let nodeAttrs = node.attributes;//伪数组 , 获得标签的所有属性
        let me = this;
        Array.prototype.slice.call(nodeAttrs).forEach((attr)=>{
            let attrNmae = attr.name;//得到属性名v-on:click
            if(me.isDirective(attrNmae)) {//判断是否是指令属性
                console.log(attrNmae)
                let exp = attr.value;//该标签某个属性的属性值show,同时也是绑定的methods里面方法名
                let dir = attrNmae.substring(2);//得到指令名on:click
                console.log(dir,exp)
                //判断是否是事件指令
                if(me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node,me.$vm,exp,dir)//解析事件指令
                }else {//一般指令
                    compileUtil[dir] && compileUtil[dir](node,me.$vm,exp)
                }
                node.removeAttribute(attrNmae)//移除指令属性
            }
        })
    },
    compileText(node,exp){
        console.log('compileText')
        compileUtil.text(node,this.$vm,exp);
    },
    isTextNode(node) {
        return true;
    },
    isDirective(attr){
        return attr.indexOf('v-') == 0;
    },
    isEventDirective(dir){
        return dir.indexOf('on') === 0;
    }
}