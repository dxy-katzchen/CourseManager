<a name="top"></a>

# CourseManager课程管理系统接口文档 v1.0.0

课程管理系统接口文档

# Table of contents

[toc]

___


# Course

## 根据类型获取课程列表(common)
 

按条件查询课程的公开信息(common),可以根据cname,tname,cid,is_open筛选,没传就是全部

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
| pageSize | `int` | 一页请求多少条数据,必填 |
| pageCurr | `int` | 现在是多少页,必填 |
| type | `int` | 课程类型,1--必修,2--限选,3--选修,选填 |
| tname | `string` | 教师名称,选填 |
| cname | `string` | 课程名称,选填 |
| is_open | `int` | 是否开放,0--未开放选课,1--开放选课,选填 |
| cid | `int` | 课程id,选填 |

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

## 根据cid删除课程(Admin)
 

根据cid删除课程,必须有管理员权限

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
| cid | `int` | 课程id,必填 |

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

## 管理员创建课程(Admin)
 

管理员创建课程

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
| is_open | `number` | 是否开放选课,0表示未开放,1表示开放,必填_Allowed values: 0,1_ |
| cname | `string` | 课程名称,必填 |
| credit | `number` | 课程学分 必须是大于1的整数,必填_Size range: 1.._<br> |
| type | `number` | 课程类型 1--必修课,2--限选课,3--选修课,必填_Size range: 1..3_<br> |
| tid | `string` | 任课老师工号,必填 |

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

## 管理员更新课程信息(Admin)
 

管理员更新课程信息(Admin),可以用作列表更新,因为可以更新单个属性

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
| cid | `number` | 课程id,必填 |
| is_open | `number` | 是否开放选课,0表示未开放,1表示开放,选填_Allowed values: 0,1_ |
| cname | `string` | 课程名称,选填 |
| credit | `number` | 课程学分 必须是大于1的整数,选填_Size range: 1.._<br> |
| type | `number` | 课程类型 1--必修课,2--限选课,3--选修课,选填_Size range: 1..3_<br> |
| tid | `string` | 任课老师工号,选填 |

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

# CourseStudent

## 学生给这门课程打分(Stu)
 

学生给这门课程打分

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
| cid | `int` | 课程id,必填 |
| ev_score | `int` | 学生给该课程打的分数,可以打1-100分,必填_Size range: 1...100_<br> |

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

## 学生根据cid选课(Stu)
 

学生根据cid选课(Stu)

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
| cid | `int` | 课程id,必填 |

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

# CourseTeacher

## 给我的学生打分(Teacher)
 

给我的学生打某课程的分(Teacher)

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
| cid | `int` | 课程id,必填 |
| stu_id | `string` | 学生学号,必填 |
| score | `int` | 老师给学生的分数,1-100之间的整数,必填 |

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

## 获取我的学生列表(Teacher)
 

根据cid获取我教的课程的学生列表(Teacher)

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
| cid | `int` | 课程id,必填 |

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

## 获取我教的课程列表(Teacher)
 

获取我教的课程列表(Teacher)

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

# studentManage

## 创建文章(Admin)
 

创建学工管理公告，什么都不用发

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

## 根据类型获取文章列表
 

根据类型获取学工管理文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)

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
| type | `int` | 文章类型,1--社会实践,2--课外活动,3--研究成果,必填 |
| pageSize | `int` | 一页请求多少条数据,必填 |
| pageCurr | `iny` | 现在是多少页,必填 |

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

## 根据mid获取文章详情
 

根据mid获取文章详情,无论有没有放入回收站都能看

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
| mid | `int` | 文章id,必填 |

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

## 根据mid将文章放入回收站(Admin)
 

根据mid将文章放入回收站

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
| mid | `int` | 文章id,必填 |

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

## 根据mid删除回收站内的文章(Admin)
 

根据mid删除回收站内的文章,必须有管理员权限

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
| mid | `int` | 文章id,必填 |

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

## 更新文章信息(Admin)
 

更新学工管理文章信息

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
| mid | `int` | 文章id,必填 |
| type | `int` | 文章类型,1--社会实践,2--课外活动,3--研究成果,选填 |
| title | `string` | 题目,选填 |
| content | `string` | 内容,选填 |
| author | `string` | 作者,选填 |
| banner_pic | `string` | 照片地址,选填 |

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

## 获取回收站文章列表(Admin)
 

获取学工管理回收站文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)

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
| pageSize | `int` | 一页请求多少条数据,必填 |
| pageCurr | `iny` | 现在是多少页,必填 |

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

# User

## 登录
 

用户登录

```
POST /users/login
```


### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| uid | `string` | 学/工号 ,只能12位_Size range: 12_<br> |
| password | `string` | 密码,可以有数字和字母_Size range: 6..12_<br> |

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

## 发送验证码
 

向用户邮箱发送有验证码的邮件

```
POST /users/lostPwd/sendEmail
```


### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | 邮箱,必须符合邮箱格式 |

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

## 验证用户邮箱
 

用户发送验证码找回密码

```
POST /users/lostPwd/varify
```


### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | 邮箱,必须符合邮箱格式 |
| checkCode | `string` | 验证码,必须6位_Size range: 6_<br> |

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

## 重置密码
 

用户重置密码

```
POST /users/lostPwd/resetPwd
```


### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `string` | 邮箱,必须符合邮箱格式 |
| password | `string` | 密码,可以有数字和字母_Size range: 6..12_<br> |
| passwordRepeat | `string` | 确认输入密码,必须和password值相同_Size range: 6..12_<br> |

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

## 注册
 

用户注册

```
POST /users/register
```


### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| username | `string` | 用户名_Size range: 1..12_<br> |
| password | `string` | 密码,可以有数字和字母_Size range: 6..12_<br> |
| uid | `string` | 学/工号 ,只能12位_Size range: 12_<br> |
| email | `string` | 邮箱,必须符合邮箱格式 |
| role | `number` | 身份,1为学生,2为老师,3为管理员_Default value: 1_<br>_Allowed values: 1,2,3_ |

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

## 自然人验证
 

自然人验证,发给前台一个svg,一个验证码内容

```
GET /users/captcha
```


### Success response example

#### Success response example - `返回内容:`

```json
{
   "status": 0,
   "message": "成功获取验证码",
   "text": "502f",
   "svg_img": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"0,0,150,..."
}
```

# UserInfo

## 查询用户基本信息
 

查询用户基本信息

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

## 修改用户基本信息
 

修改用户基本信息

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
| username | `string` | 用户名_Size range: 1..12_<br> |
| email | `string` | 邮箱,必须符合邮箱格式 |
| avatar | `string` | 头像地址,可选 |

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

## 修改用户密码
 

修改用户密码,之所以这个接口单独写,是为了防止token盗用而修改密码的情况

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
| oldPwd | `string` | 旧密码,原来的密码,6-12位数字和字母的组合_Size range: 6..12_<br> |
| newPwd | `string` | 新密码,和旧密码不能一样,格式同上_Size range: 6..12_<br> |

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

# UserPage

## 创建用户主页
 

创建用户主页，什么都不用发

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

## 更新用户主页信息
 

更新用户主页信息

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
| upid | `int` | 用户主页id,必填 |
| comment | `string` | 简介,选填(学生,教师) |
| photo | `string` | 照片地址,选填(学生,教师) |
| blog | `string` | 博客地址,选填(学生) |
| book | `string` | 论文著作,选填(教师) |
| search | `string` | 研究方向,选填(教师) |
| teachcourse | `string` | 教授课程,选填(教师) |

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

## 获取用户主页信息
 

获取用户主页信息，什么都不用发

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

