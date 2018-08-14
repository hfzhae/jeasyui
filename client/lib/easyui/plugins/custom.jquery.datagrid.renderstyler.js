/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/4/24
改造jeasyui的datagrid插件，新增方法renderformatterstyler，处理render字段和fieldstyle字段的显示函数

针对columns中的render字段获取显示函数参数
针对columns中的fieldstyle字段设置单元格的css
新增方法：renderformatterstyler
*****************************************************************/

$.extend($.fn.datagrid.methods,{
	renderformatterstyler: function(d){
		var ots = d.datagrid('options'),
			columns = ots.columns;
		if(d.parent().parent().parent().hasClass('propertygrid')){//针对propertygrid控件的处理
			columns[0][0].formatter = function(value, rowData, rowIndex) {//标题字段
				var v = value;
				return v;
			}
			columns[0][1].formatter = function(value, rowData, rowIndex) {//设置值字段返回值
				return ebx.Render.setRender(rowData.render, value, rowIndex);
				return v;
			}
			columns[0][1].styler = function(value, rowData, rowIndex){//设置单元格样式
				if(rowData.fieldstyle){
					return rowData.fieldstyle;
				}
			}
			ots.rowStyler = function(index,row){
				if(row.hidden){//hidden属性为true时，隐藏该行
					return 'display:none';
				}
				if(row.rowstyle){//行式样
					return row.rowstyle;
				}
			}
		}else{//针对datagrid控件
			for(var i in columns[0]){
				var _c = columns[0][i];
				if(_c.render){
					if(_c.render.toLowerCase() == 'hiddenrender'){//隐藏列显示函数特殊处理
						d.datagrid('hideColumn', columns[0][i].field);
					}
					_c.formatter = function(value, rowData, rowIndex){//设置返回值
						return ebx.Render.setRender(this.render, value, rowIndex);
					}
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