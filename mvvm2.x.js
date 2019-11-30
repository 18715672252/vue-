
//代理方向:实例对象来代理data对象中的属性操作
//数据代理流程
//1.通过Object.defineProperty()给实例添加与data对象的属性对应的属性描述符
//2.所有添加的属性都包含get/set
//3.get和set内部去操作data中对应的数据
function Mvvm(options) {//相当于Vue的构造函数
    this.$options = options;//将配置对象保存到vm
    var data = this._data = this.$options.data;//将data对象保存到vm和变量data中
    var me = this;//保存vm到变量me
    //数据代理
    //实现vm.xxxx -> vm.data.xxx
    Object.keys(data).forEach((key)=>{//遍历data中所有的属性
        me._proxy(key);//对options.data中的属性进行数据代理,options.data中的属性添加到实例上
    })
    // observe(data,this);
    this.$compile = new Compile(options.el || document.body , this)

}
Mvvm.prototype = {
    $watch:function(){

    },
    _proxy:function(key){//数据代理方法
        var me = this;//保存实力
        Object.defineProperty(me,key,{//给对象添加属性(使用的是描述符的方式Object.defineProperty)
            configurable:false,//不可修改(不能重新定义)
            enumerable:true,//可枚举遍历
            get:function proxyGetter() {//当读取属性值时,从data中获取对应的属性值返回 , 代理读的操作
               // console.log('通过this.XXX取数据取得是options.data.XXX的值')
                return me._data[key]//当通过this.XXX取数据时就会执行 , 通过this.XXX取数据取得是options.data.XXX的值
            },
            set:function proxySetter(newVal){//当设置属性时 , vm.xxx = value时 , value被保存到data中对应的属性上 , 代理写操作
                //console.log('当设置属性时 , vm.xxx = value时 , value被保存到data中对应的属性上 , 代理写操作')
                me._data[key] = newVal
            }
        })
    }
}

