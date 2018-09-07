/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/5/23
自定义validatebox校验
*****************************************************************/
$.extend($.fn.validatebox.defaults.rules, {//validatebox自定义校验
	//日期时间
	Datetime: {    
		validator: function (value) {    
			var reg =/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
			return reg.test(value);    
		},    
		message: '日期时间格式不正确，正确格式为：2018-01-01 12:00:00'    
	}, 
	//日期
	Date: {    
		validator: function (value) {    
			var reg =/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
			return reg.test(value);    
		},    
		message: '日期格式不正确，正确格式为：2018-01-01'    
	}, 
	//金额
	Money: {    
		validator: function (value) {    
			var reg =/^(([1-9]\d{0,9})|0)(\.\d{1,4})?$/; //四位小数
			return reg.test(value);    
		},    
		message: '请输入正确的金额，小数点后最多四位。'    
	}, 
	//整数
	Number: {    
		validator: function (value) {    
			var reg =/^[0-9]*$/;    
			return reg.test(value);    
		},    
		message: '只能输入整数。'    
	}, 
	//0和1
	ZeroOrOne: {    
		validator: function (value) {    
			var reg =/^[0-1]*$/;    
			return reg.test(value);    
		},    
		message: '只能输入 0 或 1 。'    
	}, 
	//只能输入中文
	CHS: {    
		validator: function (value) {    
			return /^[\u0391-\uFFE5]+$/.test(value);    
		},    
		message: '只输入汉字。'    
	},    
	//移动手机号码验证    
	Mobile: {//value值为文本框中的值    
		validator: function (value) {    
			var reg = /^1[3|4|5|6|7|8|9]\d{9}$/;    
			return reg.test(value);    
		},    
		message: '请输入正确的手机号码'    
	},    
	//国内邮编验证    
	ZipCode: {    
		validator: function (value) {    
			var reg = /^[0-9]\d{5}$/;    
			return reg.test(value);    
		},    
		message: '请输入正确的邮政编码。'    
	},    
	//非负整数  
	Integer: {  
		validator: function (value) {  
			var reg = /^\d+$/;  
			return reg.test(value);  
		},  
		message: '请输入非负整数'  
	},
	//英文字母|数字 
	LetterInteger: {  
		validator: function (value) {  
			var reg = /^[a-zA-Z\.#][a-zA-Z0-9\.#]{1,30}$/;  
			return reg.test(value);  
		},  
		message: '只能输入英文字母、数字、小数点或#；<br>必须以字母开头；<br>最少2个字符，最多30个字符。'  
	},
	//任何字符
	String: {  
		validator: function (value) {  
			var reg = /[^]/;  
			return reg.test(value);  
		},  
		message: ''  
	},
	SQLCheck:{//查询设计用，校验SQL语句不支持：INSERT、UPDATE、DELETE 或 MERGE 语句
		validator: function (value) {
			var check = 0;
			if(value.toLowerCase().indexOf('insert ') >= 0)check = 1
			if(value.toLowerCase().indexOf('update ') >= 0)check = 1
			if(value.toLowerCase().indexOf('delete ') >= 0)check = 1
			if(value.toLowerCase().indexOf('merge ') >= 0)check = 1
			return (check==0);  
		},  
		message: '此输入框不支持：INSERT、UPDATE、DELETE 或 MERGE 关键字，<br>你可以试试：SELECT、UNION ALL 或 LEFT JOIN等其他语法。'  
	},
	Email:{
	    validator: function(value){
	        var reg=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
	        return reg.test(value);
	    },
	    message:'请输入正确的邮箱地址'
	}
});