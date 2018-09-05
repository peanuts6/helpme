; (function (win, doc, $) {
    var FormValidate = function (options) {
        log("FormValidate");
        this.o = $.extend(true, {}, this.defaults, options);
        var inputs = !!this.o.formID ? $(this.o.formID).find("input[rules]") : $("input[rules]"), elems = [];
        inputs.each(function (e) {
            if ($(this).attr("rules") != "") {
                elems.push({ "type": $(this).attr("rules"), "node": this.id, "val": this.value });
            }
        });
        this.doinit(elems);
        log("elems length:" + elems.length);
    }
    FormValidate.prototype = {
        defaults: {
            rules: {
                "idcard": "idcard",
                "number": "number",
                "numberAndEnglish": "numberAndEnglish",
                "english": "english",
                "chinese": "chinese",
                "mobilePhone": "mobilePhone",
                "areaCode": "areaCode",
                "phoneNumber": "phoneNumber",
                "tel": "tel",
                "email": "email",
                "postCode": "postCode",
                "validCode": "validCode",
                "password": "password",
                "password2": "password2",
                "range": "range",
                "min": "min",
                "max": "max",
                "mobilePhoneAndEmail": "mobilePhoneAndEmail"/*,
				"defaults":"defaults"*/
            },
            regx: {
                "number": /\d+/,
                "numberAndEnglish": /\w+/,
                "english": /[A-Za-z_]+/,
                "chinese": /[\4e00-\9fa0]+/,
                "mobilePhone": /^1[3|4|5|8]\d{9}$/,
                "areaCode": /\d{3,4}/,
                "phoneNumber": /\d{7,8}/,
                "tel": /\d{3,4}\d{7,8}|\d{3,4}[-\s]\d{7,8}([-\s]\d{3,6})?/,
                "email": /^[\w.-]+@\w+(\.\w+)?\.\w{2,3}/gi,
                "postCode": /\d{6}/,
                "validCode": /\d{6}/,
                "password": /((?=.*[A-Za-z~!@#$%^&*()-+=|{}<>\?])(?=.*\d)|(?=.*\d)(?=.*A-Za-z~!@#$%^&*()-+=|{}<>\?))[\w\~!@#$%\^&\*\(\)-+=|<>\?]{8,16}/
            },
            errmsg: {
                "nonEmpty": "必填项",
                "empty": "",
                "idcard": "身份证号码有误",
                "number": "请输入数字",
                "numberAndEnglish": "请输入数字或字母",
                "english": "请输入英文字母或下划线",
                "chinese": "请输入中文字符",
                "mobilePhone": "请输入正确的手机号码",
                "areaCode": "请输入正确的区号",
                "phoneNumber": "请输入正确的电话号码",
                "tel": "请输入正确的电话号码",
                "email": "请输入正确的Email地址",
                "postCode": "请输入正确的邮政编码",
                "validCode": "请输入正确的验证码",
                "password": "密码必须是8-16位英文字母和数字的组合",
                "password2": "两次输入的密码不一致",
                "charRange": "字符长度不在区间内",
                "charMin": "字符长度超出限制",
                "charMax": "字符长度必须大于设定值",
                "mobilePhoneAndEmail": "请输入手机号码或电子邮箱地址",
                "defaults": "验证错误"
            },
            urls: {
            },
            success: { "valid": true, "msg": "验证通过" }
        },
        errors: {},
        doinit: function (elems) {
            log("init validator...");
            var _parent = this;
            if (elems.length > 0) {
                for (var k in elems) {
                    (function (k, elem) {
                        $("#" + elem["node"]).bind("blur", function () {
                            _parent.validate.call(_parent, elem, k);
                        });
                    })(k, elems[k]);
                }
            }
        },
        validate: function (elem, k) {
            if (!elem["type"]) {
                return { "valid": false, "msg": "验证错误" };
            }
            var patterns = elem["type"].split(","), i = 0, l = patterns.length;
            this.doValid(patterns, elem, i, l, k);
        },
        doValid: function (type, elem, i, l, k) {
            var errs;
            if (i < l && typeof (this[type[i]]) == "function") {
                if (this[type[i]](elem)) {
                    errs = this.errors[type[i] + "_" + k] = this.o.success;
                    this.showErrorTip(errs["valid"], elem["node"], errs["msg"]);
                    if (type[i] != "empty") {
                        i++;
                        this.doValid.call(this, type, elem, i, l, k);
                    } else {
                        this.resetMsg(type, i, k);
                    }
                } else {
                    if (type[i] == "empty") {
                        errs = this.errors[type[i] + "_" + k] = this.o.success;
                        this.showErrorTip(errs["valid"], elem["node"], errs["msg"]);
                        i++;
                        this.doValid.call(this, type, elem, i, l, k);
                    } else {
                        errs = this.errors[type[i] + "_" + k] = { "valid": false, "msg": this.o.errmsg[type[i]] };
                        this.showErrorTip(errs["valid"], elem["node"], errs["msg"]);
                    }
                }
            }
        },
        resetMsg: function (type, i, k) {
            var rules;
            if (type.length > i) {
                for (var j = i + 1; j < type.length; j++) {
                    delete this.errors[type[j] + "_" + k];
                }
            }
        },
        isValid: function () {
            var isvalid = true;
            for (var i in this.errors) {
                if (!this.errors[i]["valid"]) {
                    isvalid = this.errors[i]["valid"];
                    break;
                }
            }
            return isvalid;
        },
        blur: function () {
            var elems = !!this.o.formID ? $(this.o.formID).find("input[rules]:visible") : $("input[rules]:visible"), rules, errs;
            for (var i = 0; i < elems.length; i++) {
                rules = $(elems[i]).attr("rules").split(",");
                for (var k in rules) {
                    // if(!this.errors[rules[k]]){
                    $(elems[i]).blur();
                    // }
                }
            }
        },
        isEmpty: function (obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        showErrorTip: function (valid, elem, msg) {
            var _elm = $("#" + elem);
            if (valid) {
                if (!!this.o.tipbox) {
                    $(this.o.tipbox).find(".vt_" + elem).html("").hide();
                } else {
                    _elm.parent().find(".validate_tip").html("").hide();
                }
                _elm.removeClass("validate_br");
            } else {
                if (!!this.o.tipbox) {
                    if ($(this.o.tipbox).find(".vt_" + elem).length == 0) {
                        $(this.o.tipbox).append("<em class=\"validate_tip vt_" + elem + "\">" + msg + "</em>").show();
                    } else {
                        $(this.o.tipbox).find(".vt_" + elem).html(msg).show();
                    }
                } else {
                    if (_elm.parent().find(".validate_tip").length == 0) {
                        _elm.parent().append("<em class=\"validate_tip\">" + msg + "</em>").show();
                    } else {
                        _elm.parent().find(".validate_tip").html(msg).show();
                    }
                }
                _elm.addClass("validate_br");
            }
        },

        // 数字
        number: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["number"]).test(elem["val"]);
        },

        // 数字或字母或数字字母的组合
        numberAndEnglish: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["numberAndEnglish"]).test(elem["val"]);
        },

        // 英文字符
        english: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["english"]).test(elem["val"]);
        },

        // 中文字符
        chinese: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["chinese"]).test(elem["val"]);
        },

        // 手机号码
        mobilePhone: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["mobilePhone"]).test(elem["val"]);
        },

        // 区号
        areaCode: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["areaCode"]).test(elem["val"]);
        },

        // 电话号码
        phoneNumber: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["phoneNumber"]).test(elem["val"]);
        },

        // 电话号码(020123456、020-123456、0755123456、0755-123456、755-123456-1234)
        tel: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["tel"]).test(elem["val"]);
        },

        // 电子邮箱地址，\w 英文字母、数字、下划线
        email: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["email"]).test(elem["val"]);
        },

        // 邮政编码
        postCode: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return new RegExp(this.o.regx["postCode"]).test(elem["val"]);
        },

		// 邮政编码
		postCode:function(elem){
			elem["val"] = $("#"+elem["node"]).val();
			return new RegExp(this.o.regx["postCode"]).test(elem["val"]);
		},
		
		// 验证码
		validCode:function(elem){
			elem["val"] = $("#"+elem["node"]).val();
			return new RegExp(this.o.regx["validCode"]).test(elem["val"]);
		},
		
		// 密码，必须包含字母和数字
		password:function(elem){
			elem["val"] = $("#"+elem["node"]).val();
			if(!new RegExp(this.o.regx["password"]).test(elem["val"])){
				return false;
			}else{
				if($("#"+$("#"+elem["node"]).attr("refId")).length!=0){
					$("#"+$("#"+elem["node"]).attr("refId")).blur();
				}
				return true;
			}
		},
		password2:function(elem){
			elem["val"] = $("#"+elem["node"]).val();
			var pwd = $("#"+$("#"+elem["node"]).attr("refId")).val();
			return pwd==elem["val"];
        },

        // 手机号码或电子邮箱
        mobilePhoneAndEmail: function (elem) {
            // var rules = elem["type"].split(",");
            elem["val"] = $("#" + elem["node"]).val();
            if (this.mobilePhone(elem)) {
                return true;
            } else {
                if (this.email(elem)) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        // 字符长度限制
        charRange: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            var len = elem["val"].match(/[^ -~]/g) == null ? elem["val"].length : elem["val"].length + elem["val"].match(/[^ -~]/g).length;
            return len >= parseInt($("#" + elem["node"]).attr("min")) && len <= parseInt($("#" + elem["node"]).attr("max"));
        },
        // 至少
        charMin: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            var len = elem["val"].match(/[^ -~]/g) == null ? elem["val"].length : elem["val"].length + elem["val"].match(/[^ -~]/g).length;
            return len >= parseInt($("#" + elem["node"]).attr("min"));
        },
        // 最多
        charMax: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            var len = elem["val"].match(/[^ -~]/g) == null ? elem["val"].length : elem["val"].length + elem["val"].match(/[^ -~]/g).length;
            return len <= parseInt($("#" + elem["node"]).attr("max"));
        },
        // 非空
        nonEmpty: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return elem["val"].trim() != "";
        },
        // 
        empty: function (elem) {
            elem["val"] = $("#" + elem["node"]).val();
            return elem["val"].trim() == "";
        }
    }

    function log () {
        try {
            console.log.apply(console, arguments);
        } catch (e) {
            try {
                opera.postErrors.apply(opera, arguments);
            } catch (e) {
                return false;
            }
        }
    }

    win.FormValidate = FormValidate;
})(window, document, jQuery);