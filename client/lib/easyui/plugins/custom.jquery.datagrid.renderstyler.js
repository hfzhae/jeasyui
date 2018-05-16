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
