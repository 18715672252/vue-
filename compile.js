//更新节点
let updater = {
    textUpdater(node,value){
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
}
//指令处理集合
let compileUtil = {
    text:function(node,vm,exp) {
        console.log(vm)
        console.log('text')
        this.bind(node,vm,exp,'text');
    },
    bind:function(node,vm,exp,dir){
        console.log(vm)
        console.log('bind')
        let updaterFn = updater[dir + 'Updater'];//拿到更新节点的对应函数
        updaterFn && updaterFn(node,this._getVMVal(vm,exp));//updaterFn如果函数不存在不执行 , 存在的执行
        // new Watcher(vm,exp,function(value,oldValue){
        //     updaterFn && updaterFn(node,value,oldValue);
        // })
    },
    _getVMVal(vm,exp) {
        console.log(vm)
        console.log('_getVMVal')
        let val = vm._data;
        console.log(exp)
        exp = exp.split('.');
        console.log(exp)
        exp.forEach((k)=>{
            val = val[k]
        })
        return val;
    }
}

function Compile(el,vm){//el:绑定的元素  vm:实例对象
    console.log(vm)
    this.$vm  = vm;
    this.$el = this.isElementNote(el) ? el : document.getElementById(el);//存储dom元素
    console.log(this.$el)
    if(this.$el) {
        console.log(1)
        this.$fragment = this.node2Fragment(this.$el);//el里面所有的节点转移到文档碎片中,即:实例绑定的元素里面的内容转移到文档碎片中(内存)
        this.init();//解析模板,编译文档碎片中节点,即内存中节点
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
        this.compileElement(this.$fragment);
    },
    compileElement(fragment) {//编译fragment节点所有子节点
        let childNodes = fragment.childNodes;//获取节点的所有子节点包括换行什么的(即:文档碎片里面所有的内容) 节点数组:伪数组
        let me = this;
        Array.prototype.slice.call(childNodes).forEach(node => { //节点伪数组转化为真数组 , 并遍历
            let text = node.textContent;//获取节点的文本内容
            let reg = /\{\{(.*)\}\}/ //匹配{{}}表达式
            if(me.isElementNote(node)) {//判断节点是不是元素节点
                me.compile(node)
            }else if(me.isTextNode(node) && reg.test(text)) {
                console.log(2)
                me.compileText(node,RegExp.$1);//RegExp.$1代表{{name}}中name
            }
            if(node.childNodes && node.childNodes.length) {//判断节点有子节点不?
                me.compileElement(node)
            }
        });
    },
    compile(node){

    },
    compileText(node,exp){
        console.log('compileText')
        compileUtil.text(node,this.$vm,exp);
    },
    isTextNode(node) {
        return true;
    }
}