## 下载：
> git clone git@github.com:BrexitProject/visualization.git
  
## 部署运行
> npm install //安装依赖包
> npm start //启动项目

```打开http://localhost:3000/XX(对应图名) ```

========================================================
## 备注

### 文件结构
1. public/data: 存放数据
2. views: 存放html文件
3. index.js: 路由信息

### 开发框架
nodejs+express

### 绘图
d3

### 开发:
  在index.js中添加路由,然后在views中新建html进行开发。数据统一存放在public/data下。

### git相关
一般流程：
```
                          //开始修改
git checkout -b branchA
                          //修改中……

                          //修改完毕

git status                //查看修改状态
git add fileName          //add文件
git commit -m "log"       //在branchA中commit 
git checkout branchB      //切换回BranchA父分支branchB
git pull                  //从远程数据库拉取代码
git merge branchA         //合并分支
git push                  //将修改提交到远程数据库
git branch -d branchA     //将branchA删除
```
