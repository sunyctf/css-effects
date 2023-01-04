## 透视按钮悬停效果

#### 效果演示：

[Demo预览](https://sunyctf.github.io/front-end-demos/css-effects/透视按钮悬停效果/index.html)

#### 代码部分：

```css
<ul>
  <li>home</li>
  <li>products</li>
  <li>services</li>
  <li>contact</li>
</ul>
body {
    margin: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: cornsilk; 
}

ul {
    padding: 0;
    list-style-type: none; /*去掉无序列表的默认样式*/
}

ul li {
    box-sizing: border-box;
    width: 15em;  /*以20px为基准，此处是300px*/
    height: 3em;  
    font-size: 20px;
    border-radius: 0.5em;
    margin: 0.5em;
    box-shadow: 0 0 1em rgba(0,0,0,0.2);/*阴影效果的设置*/
    color: white;
    font-family: sans-serif;
    text-transform: capitalize;/*首字母大写*/
    line-height: 3em;
    transition: 0.3s;/*改变时的过渡效果*/
    cursor: pointer;
}

ul li:nth-child(odd) {
    background: linear-gradient(to right, orange, tomato);/*从左至右的渐变色效果*/
    text-align: left;
    padding-left: 10%;
    transform: perspective(500px) rotateY(45deg);/*3D透视效果和旋转的设置，图形沿着Y轴逆时针旋转45°*/
}

ul li:nth-child(even) {
    background: linear-gradient(to left, orange, tomato);
    text-align: right;
    padding-right: 10%;
    transform: perspective(500px) rotateY(-45deg);/*距离视图的距离，参数越大说明距离视图越远，看着就越小*/
}

ul li:nth-child(odd):hover {  /*鼠标悬停时的效果*/
    transform: perspective(200px) rotateY(45deg);
    padding-left: 5%;
}

ul li:nth-child(even):hover {
    transform: perspective(200px) rotateY(-45deg);
    padding-right: 5%;
}
```

#### 涉及知识点：

**1. 颜色设置：background: cornsilk;英文翻译是康丝兰等价于background: #FFF8DC;**

**2. 新接触的vh单位**

  说明： 相对于视口的高度。视口被均分为100单位的vh

  示例代码：

```css
  h1 {font-size: 8vh; }
```

  如果视口的高度是200mm，那么上述代码中h1元素的字号将为16mm，即(8x200)/100

**3. box-shadow 向框添加一个或多个阴影。**

box-shadow: h-shadow v-shadow blur spread color inset;

h-shadow 必需。水平阴影的位置。允许负值。

v-shadow 必需。垂直阴影的位置。允许负值。

blur 可选。模糊距离。(模糊半径的大小)

spread 可选。阴影的尺寸。(扩展半径的大小）

color 可选。阴影的颜色。

inset 可选。默认阴影在边框外。使用 inset 后，阴影在边框内（即使是透明边框），背景之上内容之下。
声明多个shadow时，用逗号将shadow隔开。

**4. rgb和rgba**

rgb(0,0,0)——黑色

rgb(255,255,255)——白色

rgba(0,0,0,.2):透明度0-1-->逐渐不透明，为1时不透明，为0时全透明

**5.线性渐变色设置：**

```css
background: linear-gradient(direction, color-stop1, color-stop2, ...);
```

**6. 衬线字体(serif)/非衬线字体(sans serif)的区别**

（1）serif 是有衬线字体，意思是在字的笔画开始、结束的地方有额外的装饰，而且笔画的粗细会有所不同。相反的，sans serif 就没有这些额外的装饰，而且笔画的粗细差不多。

（2）serif 字体容易识别，它强调了每个字母笔画的开始和结束，因此易读性比较高，sans serif 则比较醒目。在中文阅读的情况下，适合使用 serif 字体(如宋体)进行排版，易于换行阅读的识别性，避免发生行间的阅读错误。

（3）在小字体的场合，通常Sans Serif 比Serif 更清晰。