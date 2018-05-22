/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/4/24
改造jeasyui的datagrid插件，新增方法renderformatterstyler，处理render字段和fieldstyle字段的回调函数

针对columns中的render字段获取回调函数参数
针对columns中的fieldstyle字段设置单元格的css
新增方法：renderformatterstyler
*****************************************************************/

$.extend($.fn.datagrid.methods,{
	renderformatterstyler: function(d){
		var columns = d.datagrid('options').columns;
		if(d.parent().parent().parent().hasClass('propertygrid')){//针对propertygrid控件的处理

			columns[0][0].formatter = function(value, rowData, rowIndex) {//标题字段
				var v = ebx.UnescapeJson(value);
				return v;
			}
			columns[0][1].formatter = function(value, rowData, rowIndex) {//设置值字段返回值
				var v = _setRender(rowData.render, value, rowIndex);
				return v;
			}
			columns[0][1].styler = function(value, rowData, rowIndex){//设置单元格样式
				if(rowData.fieldstyle){
					return rowData.fieldstyle;
				}
			}
		}else{//针对其他datagrid控件
			for(var i in columns[0]){
				var _c = columns[0][i];
				if(_c.render.toLowerCase() == 'hiddenrender'){//隐藏列回调函数特殊处理
					d.datagrid('hideColumn', columns[0][i].field);
				}
				_c.formatter = function(value, rowData, rowIndex){//设置返回值
					return _setRender(this.render, value, rowIndex);
				}
				if(_c.fieldstyle){
					_c.styler = function(value, rowData, rowIndex, d){//设置单元格样式
						if(d != undefined){
							return d.fieldstyle;
						}
						if(this.fieldstyle != undefined){
							return this.fieldstyle;
						}
					}
				}
			}
		}
	}
});

function _setRender(r, v, n){//renter返回值处理
	if(v == null)return ''; 
	if(r){
		switch(r.toLowerCase()){
			case 'boolrender'://布尔
				if(v == '' || v == undefined || v == 'undefined' || v == null || v == 'null' || v == 0 || v == '0'){
					return '';
				}else{
					v = '√';
					return '√';
				}
				break;
			case 'linenumberrender'://行序号
				return n + 1;
				break;
			case 'hiddenrender'://隐藏列
				return '';
				break;
			case 'currencyrender'://金额
				v = ebx.validFloat(v, 0);
				if(v == 0){
					v = '';
				}else{
					v = v.toFixed(ebx.decimal);
				}
				return v;
				break;
			case 'costcurrencyrender'://成本金额
				return _setRender('currencyrender', v, n);
			case 'percentrender'://百分数
				v = ebx.validFloat(v, 0);
				if(v == 0){
					v = '';
				}else{
					v = v * 100;
					v = (v.toFixed(ebx.decimal)) + '%';
				}
				return v;
				break;
			case 'daterender'://日期
				return new Date(v).Format("yyyy-MM-dd");
				break;
			default:
				if(typeof(v) == 'string'){
					v = ebx.UnescapeJson(v);
				}
				return v;
				break;
		}
	}else{
		if(typeof(v) == 'string'){
			v = ebx.UnescapeJson(v);
		}
		return v;
	}
}

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
			var reg = /^[1-9]\d*|0$/;  
			return reg.test(value);  
		},  
		message: '请输入非负整数'  
	},
	//英文字母|数字 
	LetterInteger: {  
		validator: function (value) {  
			var reg = /^[a-zA-Z#][a-zA-Z0-9#]{1,30}$/;  
			return reg.test(value);  
		},  
		message: '只能输入英文字母、数字或#；<br>必须以字母开头；<br>最少2个字符，最多30个字符。'  
	},
	//任何字符
	String: {  
		validator: function (value) {  
			var reg = /[^]/;  
			return reg.test(value);  
		},  
		message: ''  
	}	 
});

Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) 
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
