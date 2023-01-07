## 纯CSS3实现地球自转实现代码

### 效果图展示

利用纯CSS3实现地球自转，下图为最终效果：

![img](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/最终效果.gif)

#### 在线预览

[Github仓库](https://github.com/sunyctf/css-effects) | [Demo预览](https://sunyctf.github.io/css-effects/other/css3实现地球自转/index.html) 🌐 [Gitee仓库](https://gitee.com/sunyctf/css-effects) | [Demo预览](https://sunyctf.gitee.io/css-effects/other/css3实现地球自转/index.html)

### 素材

两张图片，espaco.jpg(1600*1000)、terra.jpg(900*450)

![背景太空](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/terra.jpg)

![背景太空](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/espaco.jpg)



### 实现步骤

**第一步，形成静态图（地球背景全屏，地球大小为450px\*450px，地球位置为上下左右居中）：**

代码如下：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Planet Earth</title>
<style type="text/css">
body{
background: url(espaco.jpg) no-repeat 0 0;
/*背景图片被拉伸为全屏*/
background-size: 100%; 
}
.earth{
/*背景图片在水平方向平铺*/
background: url(terra.jpg) repeat-x 0 0; 
/*下面的属性可实现地球在当前浏览器窗口水平和垂直方向上都居中*/
height: 450px;
left: 50%;
margin: -225px 0 0 -225px;
position: absolute;
top: 50%;
width: 450px;
}
</style>
</head>
<body>
<div class="earth"></div>
</body>
</html>
```


效果图：

![img](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/static.jpg)

**第二步，形成圆形地球效果，同时添加月晕效果**：

代码如下:

```html
/*在div.earth中添加以下属性样式*/
/*形成圆边效果，视觉效果更好，当然也可以不用*/
border: 1px solid rgba(26,18,101,0.3); 
/*使地球形成圆形效果*/
border-radius: 225px;
/*填加2个阴影，形成圆形外面的模糊月晕效果*/
box-shadow: -8px 0 25px rgba(256,256,256,0.3), -1px -2px 14px rgba(256,256,256,0.5) inset;
```


效果图：

![圆形地球效果](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/round-earth.jpg)

**第三步，形成白天黑夜效果**：

代码如下:

```html
.earth:before{
content: "";
border-radius: 225px;
/*设置弧形阴影，形成白天黑夜效果*/
box-shadow: -150px -6px 25px rgba(0,0,0,0.7) inset;
left: 0;
position:absolute;
top: 0;
height: 450px;
width: 450px;
}
```


效果图：

![img](https://raw.githubusercontent.com/sunyctf/css-effects/main/other/CSS3实现地球自转/arc-shadow.jpg)

**最后一步，形成地球自转效果**：

代码如下:

```html
@-webkit-keyframes loop {
0% { 
	background-position: 0 0;
}
100% {  
	/*世界地图的大小为900*450，所以background-position-x: -900px*/ 
 	background-position: -900px 0;}
}
/*在div.earth中添加如下样式*/
/*这里的时间是可以自定义设置的，如果你想地球转速快一点的话，时间改小点即可，比如10s*/
-webkit-animation: loop 20s linear infinite; 
```

