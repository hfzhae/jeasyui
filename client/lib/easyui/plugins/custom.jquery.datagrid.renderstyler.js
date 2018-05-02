/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/4/24
改造jeasyui的datagrid插件，新增方法renderformatterstyler，处理render字段和fieldstyle字段的回调函数

针对columns中的render字段获取回调函数参数
针对columns中的fieldstyle字段设置单元格的css
新增方法：renderformatterstyler
*****************************************************************/

$.extend($.fn.datagrid.methods,{
	renderformatterstyler: function(d, t){
		var columns = d.datagrid('options').columns;
		if(t == 'propertygrid'){//针对propertygrid控件的处理
			columns[0][1].formatter = function(value, rowData, rowIndex) {//设置返回值
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
				if(_c.render){
					if(_c.render.toLowerCase() == 'hiddenrender'){//隐藏列回调函数特殊处理
						d.datagrid('hideColumn', columns[0][i].field);
					}
					_c.formatter = function(value, rowData, rowIndex){//设置返回值
						return _setRender(this.render, value, rowIndex);
					}
				}
				if(_c.fieldstyle){
					_c.styler = function(value, rowData, rowIndex){//设置单元格样式
						return this.fieldstyle;
					}
				}
			}
		}
	}
});

function _setRender(r, v, n){//renter返回值处理
	if(!r)return v;
	switch(r.toLowerCase()){
		case 'boolrender'://布尔回调函数
			if(v == '' || v == undefined || v == 'undefined' || v == null || v == 'null' || v == 0 || v == '0'){
				return '';
			}else{
				v = '√';
				return '√';
			}
			break;
		case 'linenumberrender'://显示行号
			return n + 1;
			break;
		case 'hiddenrender'://隐藏列
			return '';
			break;
		default:
			return v;
			break;
	}
}
