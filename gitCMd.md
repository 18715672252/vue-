本地分支与远程分之的关联操作1111
    查看本地与远程的分支 git branch -av
    1-本地分支推送到远程(本地有远程没有)
        方法一（dev是分支名）
        (1)-创建一个新分支并切换到该分之 git checkout -b dev
        (2)-推送到远程 git push -u origin dev
        方法二
        (1)-创建一个新分支并切换到该分之 git checkout -b dev
        (2)-推送到远程 git push --set-upstream origin dev
    2-远程分支拉取到本地(远程有本地没有)
        方法一（dev是分支名）
        (1)-git pull
        (2)-git checkout -b dev origin/dev  #解释：意思是创建并切换到dev分支，并且dev分支会拉取远程上的dev分支的内容并关联       
        ps:(创建并切换的分支名必须和远程上面的分支名一样，才能拉取关联对应分支和对应分支的内容)
        方法二（dev是分支名）
        (1)-git pull
        (2)-get checkout --track origin/dev #解释：在本创建一个dev分支,并且和远程上的dev分支相关联