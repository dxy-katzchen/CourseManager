<a name="top"></a>
# CourseManager课程管理系统接口文档 v1.0.0

课程管理系统接口文档

# Table of contents

- [Course](#Course)
  - [根据类型获取课程列表(common)](#根据类型获取课程列表(common))
  - [根据cid删除课程(Admin)](#根据cid删除课程(Admin))
  - [管理员创建课程(Admin)](#管理员创建课程(Admin))
  - [管理员更新课程信息(Admin)](#管理员更新课程信息(Admin))
- [CourseStudent](#CourseStudent)
  - [学生给这门课程打分(Stu)](#学生给这门课程打分(Stu))
  - [学生根据cid选课(Stu)](#学生根据cid选课(Stu))
- [CourseTeacher](#CourseTeacher)
  - [给我的学生打分(Teacher)](#给我的学生打分(Teacher))
  - [获取我的学生列表(Teacher)](#获取我的学生列表(Teacher))
  - [获取我教的课程列表(Teacher)](#获取我教的课程列表(Teacher))
- [studentManage](#studentManage)
  - [创建文章(Admin)](#创建文章(Admin))
  - [根据类型获取文章列表](#根据类型获取文章列表)
  - [根据mid获取文章详情](#根据mid获取文章详情)
  - [根据mid将文章放入回收站(Admin)](#根据mid将文章放入回收站(Admin))
  - [根据mid删除回收站内的文章(Admin)](#根据mid删除回收站内的文章(Admin))
  - [更新文章信息(Admin)](#更新文章信息(Admin))
  - [获取回收站文章列表(Admin)](#获取回收站文章列表(Admin))
- [User](#User)
  - [登录](#登录)
  - [发送验证码](#发送验证码)
  - [验证用户邮箱](#验证用户邮箱)
  - [重置密码](#重置密码)
  - [注册](#注册)
  - [自然人验证](#自然人验证)
- [UserInfo](#UserInfo)
  - [查询用户基本信息](#查询用户基本信息)
  - [修改用户基本信息](#修改用户基本信息)
  - [修改用户密码](#修改用户密码)
- [UserPage](#UserPage)
  - [创建用户主页](#创建用户主页)
  - [更新用户主页信息](#更新用户主页信息)
  - [获取用户主页信息](#获取用户主页信息)

___


# <a name='Course'></a> Course

## <a name='根据类型获取课程列表(common)'></a> 根据类型获取课程列表(common)
[Back to top](#top)

<p>按条件查询课程的公开信息(common),可以根据cname,tname,cid,is_open筛选,没传就是全部</p>

```
GET /course/getCourseList
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pageSize | `int` | <p>一页请求多少条数据,必填</p> |
| pageCurr | `int` | <p>现在是多少页,必填</p> |
| type | `int` | <p>课程类型,1--必修,2--限选,3--选修,选填</p> |
| tname | `string` | <p>教师名称,选填</p> |
| cname | `string` | <p>课程名称,选填</p> |
| is_open | `int` | <p>是否开放,0--未开放选课,1--开放选课,选填</p> |
| cid | `int` | <p>课程id,选填</p> |

### Examples

请求示例:

```js
{
      cid: 2,
      cname: "大学物理",
      is_open: 1,
      tname: "教师1",
      type: 1,
      pageSize: 10,
      pageCurr: 1,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "成功获取课程信息",
    "data": [
        {
            "cid": 2,
            "is_open": 1,
            "cname": "大学物理",
            "credit": 10,
            "type": 1,
            "tid": "201900301086",
            "tname": "教师1"
        }
    ]
}
```

## <a name='根据cid删除课程(Admin)'></a> 根据cid删除课程(Admin)
[Back to top](#top)

<p>根据cid删除课程,必须有管理员权限</p>

```
POST /course/delete
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `int` | <p>课程id,必填</p> |

### Examples

请求示例:

```js
{
        cid: 20
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "删除成功"
}
```

## <a name='管理员创建课程(Admin)'></a> 管理员创建课程(Admin)
[Back to top](#top)

<p>管理员创建课程</p>

```
POST /course/create
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| is_open | `number` | <p>是否开放选课,0表示未开放,1表示开放,必填</p>_Allowed values: 0,1_ |
| cname | `string` | <p>课程名称,必填</p> |
| credit | `number` | <p>课程学分 必须是大于1的整数,必填</p>_Size range: 1.._<br> |
| type | `number` | <p>课程类型 1--必修课,2--限选课,3--选修课,必填</p>_Size range: 1..3_<br> |
| tid | `string` | <p>任课老师工号,必填</p> |

### Examples

请求示例:

```js
{
   is_open: 0,
   cname: "数据库课程设计",
   credit: 2,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "添加课程成功!",
    "cid": 3
}
```

## <a name='管理员更新课程信息(Admin)'></a> 管理员更新课程信息(Admin)
[Back to top](#top)

<p>管理员更新课程信息(Admin),可以用作列表更新,因为可以更新单个属性</p>

```
POST /course/update
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `number` | <p>课程id,必填</p> |
| is_open | `number` | <p>是否开放选课,0表示未开放,1表示开放,选填</p>_Allowed values: 0,1_ |
| cname | `string` | <p>课程名称,选填</p> |
| credit | `number` | <p>课程学分 必须是大于1的整数,选填</p>_Size range: 1.._<br> |
| type | `number` | <p>课程类型 1--必修课,2--限选课,3--选修课,选填</p>_Size range: 1..3_<br> |
| tid | `string` | <p>任课老师工号,选填</p> |

### Examples

请求示例:

```js
{
   cid:1,
   is_open: 0,
   cname: "数据库课程设计",
   credit: 2,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "更新课程信息成功!"
}
```

# <a name='CourseStudent'></a> CourseStudent

## <a name='学生给这门课程打分(Stu)'></a> 学生给这门课程打分(Stu)
[Back to top](#top)

<p>学生给这门课程打分</p>

```
POST /course/student/evaluste
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `int` | <p>课程id,必填</p> |
| ev_score | `int` | <p>学生给该课程打的分数,可以打1-100分,必填</p>_Size range: 1...100_<br> |

### Examples

请求示例:

```js
{
        cid: 2,
        ev_score:69
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "打分成功"
}
```

## <a name='学生根据cid选课(Stu)'></a> 学生根据cid选课(Stu)
[Back to top](#top)

<p>学生根据cid选课(Stu)</p>

```
POST /course/student/choose
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `int` | <p>课程id,必填</p> |

### Examples

请求示例:

```js
{
        cid: 2
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "选课成功"
}
```

# <a name='CourseTeacher'></a> CourseTeacher

## <a name='给我的学生打分(Teacher)'></a> 给我的学生打分(Teacher)
[Back to top](#top)

<p>给我的学生打某课程的分(Teacher)</p>

```
POST /course/teacher/mark
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `int` | <p>课程id,必填</p> |
| stu_id | `string` | <p>学生学号,必填</p> |
| score | `int` | <p>老师给学生的分数,1-100之间的整数,必填</p> |

### Examples

请求示例:

```js
{
        cid: 2,
        stu_id:"201900301083",
        score:100
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 1,
    "message": "打分成功"
}
```

## <a name='获取我的学生列表(Teacher)'></a> 获取我的学生列表(Teacher)
[Back to top](#top)

<p>根据cid获取我教的课程的学生列表(Teacher)</p>

```
POST /course/teacher/getCourseStuList
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| cid | `int` | <p>课程id,必填</p> |

### Examples

请求示例:

```js
{
        cid: 2,
        ev_score:69
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "获取成功",
    "data": [
        {
            "uid": "201900301083",
            "cid": 18,
            "ev_score": null,
            "stu_score": null,
            "stu_name": "学生用户名"
        }
    ]
}
```

## <a name='获取我教的课程列表(Teacher)'></a> 获取我教的课程列表(Teacher)
[Back to top](#top)

<p>获取我教的课程列表(Teacher)</p>

```
POST /course/teacher/getMyCourseList
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "length": 3,
    "message": "获取您的教课列表成功!",
    "data": [
        {
            "cid": 13,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 14,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 15,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
     
    ]
}
```

# <a name='studentManage'></a> studentManage

## <a name='创建文章(Admin)'></a> 创建文章(Admin)
[Back to top](#top)

<p>创建学工管理公告，什么都不用发</p>

```
POST /manage/create
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 1,
    "message": {
        "status": 0,
        "message": "创建公告成功",
        "mid": 6
    }
}
```

## <a name='根据类型获取文章列表'></a> 根据类型获取文章列表
[Back to top](#top)

<p>根据类型获取学工管理文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)</p>

```
GET /manage/getList
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `int` | <p>文章类型,1--社会实践,2--课外活动,3--研究成果,必填</p> |
| pageSize | `int` | <p>一页请求多少条数据,必填</p> |
| pageCurr | `iny` | <p>现在是多少页,必填</p> |

### Examples

请求示例:

```js
{
      type:2,
      pageSize: 3,
      pageCurr: 1,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "获取成功",
    "is_lastPage": false,
    "data_number": 3,
    "data": [
        {
            "mid": 20,
            "title": "山东大学学生种树",
            "edit_time": "2022-10-08 10:27",
            "author": "(*^_^*)"
        },
        {
            "mid": 10,
            "title": "山东大学学生种树",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)"
        },
        {
            "mid": 11,
            "title": "山东大学学生种树",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)"
        }
    ]
}
```

## <a name='根据mid获取文章详情'></a> 根据mid获取文章详情
[Back to top](#top)

<p>根据mid获取文章详情,无论有没有放入回收站都能看</p>

```
GET /manage/getPageDetails
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| mid | `int` | <p>文章id,必填</p> |

### Examples

请求示例:

```js
{
        mid: 20
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "获取文章详情成功!",
    "data": {
        "mid": 20,
        "uid": "201900301082",
        "type": 2,
        "title": "山东大学学生种树",
        "content": "山东大学学生开展种树活动,非常好",
        "create_time": "2022-10-08 10:26",
        "edit_time": "2022-10-08 10:27",
        "author": "(*^_^*)",
        "banner_pic": "https://sm.ms/image/8yBIwEGVKxNeadM",
        "is_delete": 0
    }
}
```

## <a name='根据mid将文章放入回收站(Admin)'></a> 根据mid将文章放入回收站(Admin)
[Back to top](#top)

<p>根据mid将文章放入回收站</p>

```
POST /manage/toBin
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| mid | `int` | <p>文章id,必填</p> |

### Examples

请求示例:

```js
{
        mid: 19
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "删除成功!"
}
```

## <a name='根据mid删除回收站内的文章(Admin)'></a> 根据mid删除回收站内的文章(Admin)
[Back to top](#top)

<p>根据mid删除回收站内的文章,必须有管理员权限</p>

```
POST /manage/delete
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| mid | `int` | <p>文章id,必填</p> |

### Examples

请求示例:

```js
{
        mid: 20
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "删除成功"
}
```

## <a name='更新文章信息(Admin)'></a> 更新文章信息(Admin)
[Back to top](#top)

<p>更新学工管理文章信息</p>

```
POST /manage/update
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| mid | `int` | <p>文章id,必填</p> |
| type | `int` | <p>文章类型,1--社会实践,2--课外活动,3--研究成果,选填</p> |
| title | `string` | <p>题目,选填</p> |
| content | `string` | <p>内容,选填</p> |
| author | `string` | <p>作者,选填</p> |
| banner_pic | `string` | <p>照片地址,选填</p> |

### Examples

请求示例:

```js
{
        mid: 19
        type: 2
        banner_pic: "https://sm.ms/image/8yBIwEGVKxNeadM"
        author: "(*^_^*)"
        title: "山东大学学生种树"
        content: "山东大学学生开展种树活动,非常好"
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "更新文章信息成功!"
}
```

## <a name='获取回收站文章列表(Admin)'></a> 获取回收站文章列表(Admin)
[Back to top](#top)

<p>获取学工管理回收站文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)</p>

```
GET /manage/getBinList
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| pageSize | `int` | <p>一页请求多少条数据,必填</p> |
| pageCurr | `iny` | <p>现在是多少页,必填</p> |

### Examples

请求示例:

```js
{
      pageSize: 3,
      pageCurr: 1,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "获取成功",
    "is_lastPage": true,
    "data_number": 3,
    "data": [
        {
            "mid": 19,
            "title": "山东大学学生种树",
            "create_time": "2022-10-08 07:46",
            "edit_time": "2022-10-08 09:29",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 13,
            "title": "山东大学学生种树",
            "create_time": "2022-10-08 06:54",
            "edit_time": "2022-10-08 08:00",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 14,
            "title": "山东大学学生种树",
            "create_time": "2022-10-08 06:54",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)",
            "type": 2
        }
    ]
}
```

# <a name='User'></a> User

## <a name='登录'></a> 登录
[Back to top](#top)

<p>用户登录</p>

```
POST /user/login
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| uid | `string` | <p>学/工号 ,只能12位</p>_Size range: 12_<br> |
| password | `string` | <p>密码,可以有数字和字母</p>_Size range: 6..12_<br> |

### Examples

请求示例:

```js
{
    uid:"201900301082",
    password:"666666",
}
```


### Success response example

#### Success response example - `返回内容:`

```json

{
    "status": 0,
    "message": "登录成功!",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

## <a name='发送验证码'></a> 发送验证码
[Back to top](#top)

<p>向用户邮箱发送有验证码的邮件</p>

```
POST /user/lostPwd/sendEmail
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | <p>邮箱,必须符合邮箱格式</p> |

### Examples

请求示例:

```js
{
    email:"55555@126.com",
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
  
 "status": 0,
 "message": "发送成功"

}
```

## <a name='验证用户邮箱'></a> 验证用户邮箱
[Back to top](#top)

<p>用户发送验证码找回密码</p>

```
POST /user/lostPwd/varify
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | <p>邮箱,必须符合邮箱格式</p> |
| checkCode | `string` | <p>验证码,必须6位</p>_Size range: 6_<br> |

### Examples

请求示例:

```js
{
    email:"55555@126.com",
    checkCode:"666666"
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "验证成功"
}
```

## <a name='重置密码'></a> 重置密码
[Back to top](#top)

<p>用户重置密码</p>

```
POST /user/lostPwd/resetPwd
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | <p>邮箱,必须符合邮箱格式</p> |
| password | `string` | <p>密码,可以有数字和字母</p>_Size range: 6..12_<br> |
| passwordRepeat | `string` | <p>确认输入密码,必须和password值相同</p>_Size range: 6..12_<br> |

### Examples

请求示例:

```js
{
    email:"55555@126.com",
    password:"12345678",
    passwordRepeat:"12345678"
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "修改密码成功!"
}
```

## <a name='注册'></a> 注册
[Back to top](#top)

<p>用户注册</p>

```
POST /user/register
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| username | `string` | <p>用户名</p>_Size range: 1..12_<br> |
| password | `string` | <p>密码,可以有数字和字母</p>_Size range: 6..12_<br> |
| uid | `string` | <p>学/工号 ,只能12位</p>_Size range: 12_<br> |
| email | `string` | <p>邮箱,必须符合邮箱格式</p> |
| role | `number` | <p>身份,1为学生,2为老师,3为管理员</p>_Default value: 1_<br>_Allowed values: 1,2,3_ |

### Examples

请求示例:

```js
{
    uid:"201900301082",
    username:"dxxxxy",
    password:"666666",
    email:"55555@126.com",
    role:1,
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "注册成功!"
}
```

## <a name='自然人验证'></a> 自然人验证
[Back to top](#top)

<p>自然人验证,发给前台一个svg,一个验证码内容</p>

```
GET /user/captcha
```

### Success response example

#### Success response example - `返回内容:`

```json
{
   "status": 0,
   "message": "成功获取验证码",
   "data":{
"text": "502f",
   "svg_img": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"0,0,150,..."
   }
  
}
```

# <a name='UserInfo'></a> UserInfo

## <a name='查询用户基本信息'></a> 查询用户基本信息
[Back to top](#top)

<p>查询用户基本信息</p>

```
GET /my/userinfo
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "查询用户基本信息成功!",
    "data": {
        "uid": "201900301082",
        "username": "dxy",
        "email": "1363867975@qq.com",
        "avatar": null,
        "role": 1,
        "upid": null
    }
}
```

## <a name='修改用户基本信息'></a> 修改用户基本信息
[Back to top](#top)

<p>修改用户基本信息</p>

```
POST /my/userinfo
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| username | `string` | <p>用户名</p>_Size range: 1..12_<br> |
| email | `string` | <p>邮箱,必须符合邮箱格式</p> |
| avatar | `string` | <p>头像地址,可选</p> |

### Examples

请求示例:

```js
{
    username:"dxxxxy",
    email:"55555@126.com",
    upid:1,//可选
    avatar:"https://sm.ms/image/8yBIwEGVKxNeadM"//可选
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "修改基本信息成功!"
}
```

## <a name='修改用户密码'></a> 修改用户密码
[Back to top](#top)

<p>修改用户密码,之所以这个接口单独写,是为了防止token盗用而修改密码的情况</p>

```
POST /my/updatepwd
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| oldPwd | `string` | <p>旧密码,原来的密码,6-12位数字和字母的组合</p>_Size range: 6..12_<br> |
| newPwd | `string` | <p>新密码,和旧密码不能一样,格式同上</p>_Size range: 6..12_<br> |

### Examples

请求示例:

```js
{
      oldPwd:"123456789",
      newPwd:"dxy666666"
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "修改密码成功!"
}
```

# <a name='UserPage'></a> UserPage

## <a name='创建用户主页'></a> 创建用户主页
[Back to top](#top)

<p>创建用户主页，什么都不用发</p>

```
POST /userpage/create
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "创建用户主页成功!",
    "data": {
        "upid": 6
    }
}
```

## <a name='更新用户主页信息'></a> 更新用户主页信息
[Back to top](#top)

<p>更新用户主页信息</p>

```
POST /userpage/update
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| upid | `int` | <p>用户主页id,必填</p> |
| comment | `string` | <p>简介,选填(学生,教师)</p> |
| photo | `string` | <p>照片地址,选填(学生,教师)</p> |
| blog | `string` | <p>博客地址,选填(学生)</p> |
| book | `string` | <p>论文著作,选填(教师)</p> |
| search | `string` | <p>研究方向,选填(教师)</p> |
| teachcourse | `string` | <p>教授课程,选填(教师)</p> |

### Examples

请求示例:

```js
{
upid: 7,
comment: "我是dxy",
book: "《计算机图形学》",
search: "计算机图形学",
blog: "https://github.com/",
photo: "https://sm.ms/image/t5cHgLMCO1XshQj",
teachcourse: "数据结构与算法,计算机引论",
}
```


### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "更新用户主页成功"
}
```

## <a name='获取用户主页信息'></a> 获取用户主页信息
[Back to top](#top)

<p>获取用户主页信息，什么都不用发</p>

```
GET /userpage/info
```

### Header examples

Header-Example:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
```

### Success response example

#### Success response example - `返回内容:`

```json
{
    "status": 0,
    "message": "获取主页信息成功！",
    "data": [
        {
            "upid": 7,
            "type": 1,
            "comment": "我是dxy",
            "photo": "照片地址",
            "blog": "博客",
            "teachcourse": "教授课程",
            "search": "研究方向",
            "book": "论文著作"
        }
    ]
}
```

