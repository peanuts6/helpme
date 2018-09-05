# helpme

## utils

#### LTE IE8 placeholder
```javascript
var placeholder = require('./placeholder.js');
setTimeout(function () {
    placeholder();
}, 100);
```

#### form validator
```html
<!-- ... -->
<html>
    <head>
    </head>
<body>
    <form id="form1">
        <!-- 验证电子邮箱 -->
        <input type="text" name="email" id="email" class="input" rules="email" />
        <!-- 验证手机号码 -->
        <input type="text" name="mobilePhone" id="mobilePhone" class="input" rules="mobilePhone" />
        <!-- 验证密码 -->
        <label>密码设置：</label>
        <input type="password" name="password" id="password" class="input" rules="password" refId="password2" />
        <label>密码确认：</label>
        <input type="password" name="confirmPwd" id="password2" class="input" rules="password2" refId="password" />
        <!-- 验证非空 -->
        <input type="text" name="userName" id="userName" class="input" rules="nonEmpty" />
        <!-- 验证可为空，当输入框不为空时，校验数据有效性 -->
        <input type="text" name="nickName" id="nickName" class="input" rules="empty,chinese" />
        <!-- 校验身份证号码 -->
        <input type="text" name="idcard" id="idcard" class="input" rules="idcard" />
        <!-- 校验数字 -->
        <input type="text" name="age" id="age" class="input" rules="number" />
        <!-- 校验字符长度 -->
        <input type="text" name="liklyhood" id="liklyhood" class="input" rules="charRange" min="3" max="30" />
        <!-- 校验电话号码 -->
        <input type="text" name="tel" id="tel" class="input" rules="phoneNumber" />
        <!-- 多规则验证，以“,”号分割，当第一个规则通过时，才会验证第二个规则 -->
        <input type="text" name="tel" id="tel" class="input" rules="nonEmpty,english" />
    </form>
    <script type="text/javascript" src="vendor/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="scripts/FormValidator.js"></script>
    <script>
        // normal
        var validator = new FormValidate();

        // 自定义验证错误信息
        var validator2 = new FormValidate({errmsg:{"email":"你输入的邮箱地址不正确"}});

        // 错误信息都显示在一个框内
        var validator3 = new FormValidate({tipbox:"#tipbox"}});

        // 页面多个表单验证，一个表单new一次验证组件
        var validator4 = new FormValidate({formID:"#form1"}});
        var validator5 = new FormValidate({formID:"#form2"}});

        $('#submit').on("click", function (e) {
            validator.blur();
            if(!validator.isValid()){
                e.preventDefault();
                return false;
            }
            // 执行你的代码
            // ... ...
        });
    </script>
</body>
</html>
```

#### Find a field of an object
```javascript
var validField = require('./jsonRegex.js');
console.log("Find age which is less then 100:");
console.log('{"name":"chen","age":100} ', validField({"name":"chen","age":100},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
console.log('{"name":"chen","age":90} ', validField({"name":"chen","age":90},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
console.log('{"name":"chen","age":120} ', validField({"name":"chen","age":120},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
```

