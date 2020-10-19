window.addEventListener('load',function(){
    var btn1 = document.querySelector('.btn1');
    var btn2 = document.querySelector('.btn2');
    var box = document.querySelector('.box');
    var ul = document.querySelector('ul');
    var ol = document.querySelector('ol');
    var circle = 0;
    var flag = true
    box.addEventListener('mouseenter',function(){
        btn1.style.display = 'block';
        btn2.style.display = 'block';
        clearInterval(timer);
        timer = null;
    })
    box.addEventListener('mouseleave',function(){
        btn1.style.display = 'none';
        btn2.style.display = 'none';
        timer = setInterval(function(){
            btn2.click()
        },2000)
    })
    for(var i = 0;i<ul.children.length;i++){
        var lis= document.createElement('li');
        lis.setAttribute('index',i)
        ol.appendChild(lis) ;
        // console.log(index);
        ol.children[0].style.background = 'red';
        ol.children[i].addEventListener('click',function(){
            var index = this.getAttribute('index');
            console.log(index);
            circle = num = index;
            for(var i = 0;i<ul.children.length-1;i++){
                ol.children[i].style.background = '';
            }
            this.style.background = 'red';
            animate(ul,-index*box.offsetWidth);
        })
    }
    ul.children[0].cloneNode(true);
    ul.appendChild(ul.children[0].cloneNode(true));
    var num = 0;
    btn2.addEventListener('click',function(){
        if(flag){
            //这个if一定要包括整个事件，不然影响不了animate
            flag = false
        if(num==4){
            ul.style.left=0;
            num=0
        }
        num++
        circle++
        for(var i=0;i<ol.children.length;i++){
            ol.children[i].style.background='';
        }
        if(circle==4){
            circle=0
        }
        // console.log(ol.children[4]);
        ol.children[circle].style.background='red';
        animate(ul,num*-box.offsetWidth,function(){
            flag = true
        })
    }
    })
     btn1.addEventListener('click',function(){
        if(flag){
            flag = false
        if(num==0){
            ul.style.left=4*-box.offsetWidth+'px';
            num=4
        }
        num--
        for(var i=0;i<ol.children.length;i++){
            ol.children[i].style.background='';
        }
        if(circle==0){
            circle=4
        }
        //先判断再--，因为circle本来设定的就是0，直接-就为负数，
        //所以找不到
        circle--
        ol.children[circle].style.background='red';
        animate(ul,num*-box.offsetWidth,function(){
            flag = true
        })
        }
    })
 var timer = setInterval(function(){
     //手动调用点击事件
     btn2.click()
    },2000)
})