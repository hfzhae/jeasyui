/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/4/26
改造jeasyui的datagrid插件的onClickCell属性，增加editkeyboard方法，支持编辑状态下全键盘操作

存在的问题：
1、datebox和combobox控件编辑器不支持失去焦点自动结束编辑状态
*****************************************************************/

$.extend($.fn.datagrid.methods, {
	editkeyboard: function(jq,param){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
			$(this).datagrid('highlightRow', param.index);
			$(this).datagrid('endEdit', param.index);
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field){
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
			var obj = $(this).datagrid('getEditor', {index:param.index, field:param.field}),//获取激活的输入框对象
				thisGrid = $(this);
			if(obj != null){
				if(obj.type == 'datebox' || obj.type == 'combobox' || obj.type == 'datetimebox' || obj.type == 'combogrid'){
					var inputObj = $(obj.target).parent().find('input:eq(1)')
				}else{
					var inputObj = $(obj.target);//输入框自动激活焦点并全选
				}
				inputObj.select();
				switch(obj.type){
					case 'combogrid':
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'datetimebox':
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'datebox':
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'combobox':
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					default:
						inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
							setTimeout(function(){
								thisGrid.datagrid('endEdit', param.index);
							},0);
						});
						break;
				}
				inputObj.keyup(function(event){//全键盘操作
					switch(event.keyCode){
						case 40://down
							if(obj.type == 'combogrid'){//combogrid控件不支持下键自动跳转下一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index + 1,field:param.field});
								},0);
							}
							break;
						case 38://up
							if(obj.type == 'combogrid'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index - 1,field:param.field});
								},0);
							}
							break;
						case 37://left
							if(obj.type == 'combogrid'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								var nextfield, nextfieldname = param.field;
								for(var i=fields.length; i>0; i--){
									var col = thisGrid.datagrid('getColumnOption', fields[i - 1]);
									if (fields[i] == nextfieldname && col != null){
										if(col.editor == undefined){
											nextfieldname = fields[i - 1];
										}else{
											if(col.editor.type == 'text' || col.editor.type == 'numberbox' || col.editor == 'text' || col.editor == 'numberbox' || col.editor.type == 'checkbox' || col.editor.type == 'datebox' || col.editor.type == 'combobox' || col.editor.type == 'datetimebox' || col.editor == 'datetimebox' || obj.type == 'combogrid'){
												nextfield = fields[i - 1];
											}
										}
									}
								}
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index,field:nextfield});
								},0);
							}
							break;
						case 39://right
							if(obj.type == 'combogrid'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								var nextfield, nextfieldname = param.field;
								for(var i=0; i<fields.length; i++){
									var col = thisGrid.datagrid('getColumnOption', fields[i + 1]);
									if (fields[i] == nextfieldname && col != null){
										if(col.editor == undefined){
											nextfieldname = fields[i + 1];
										}else{
										if(col.editor.type == 'text' || col.editor.type == 'numberbox' || col.editor == 'text' || col.editor == 'numberbox' || col.editor.type == 'checkbox' || col.editor.type == 'datebox' || col.editor.type == 'combobox' || col.editor.type == 'datetimebox' || col.editor == 'datetimebox' || obj.type == 'combogrid'){
												nextfield = fields[i + 1];
											}
										}
									}
								}
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index,field:nextfield});
								},0);
							}
							break;
						case 13://enter
							if(obj.type == 'combogrid'){//combogrid控件支持搜索快捷键，当panel显示时，不跳转下一个编辑对象
								if(!$(obj.target).combogrid('panel').is(":hidden")){
									return;
								}
							}
							
							thisGrid.datagrid('endEdit', param.index);
							var nextfield = "", 
								nextfieldname = param.field, 
								firstfield = "",
								firstindex = param.index;
							for(var i=0; i<fields.length; i++){
								var col = thisGrid.datagrid('getColumnOption', fields[i + 1]),
									col1 = thisGrid.datagrid('getColumnOption', fields[i]);
								if(col1 != null){
									if(col1.editor != undefined && firstfield == ""){
										firstfield = fields[i];
									}
								}
								if (fields[i] == nextfieldname && col != null){
									if(col.editor == undefined){
										nextfieldname = fields[i + 1];
									}else{
										if(col.editor.type == 'text' || col.editor.type == 'numberbox' || col.editor == 'text' || col.editor == 'numberbox' || col.editor.type == 'checkbox' || col.editor.type == 'datebox' || col.editor.type == 'combobox' || col.editor.type == 'datetimebox' || col.editor == 'datetimebox' || obj.type == 'combogrid'){
											nextfield = fields[i + 1];
										}
									}
								}
							}
							if(nextfield == ""){
								nextfield = firstfield;
								firstindex++
							}
							setTimeout(function(){
								thisGrid.datagrid('editkeyboard', {index:firstindex,field:nextfield});
							},0);
							break;
						case 27://esc
							thisGrid.datagrid('cancelEdit', param.index);
							break;
						case 46://del
							if(obj.type == 'combogrid'){//combogrid控件按下删除键时清空value字段内容
								//thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('updateRow',{
									index: param.index,
									row: {
										value: ''
									}
								});
								//thisGrid.datagrid('selectRow', param.index).datagrid('editkeyboard', {index:param.index,field:param.field});
							}
							break;
						case 8://backspace
							if(obj.type == 'combogrid'){//combogrid控件按下退格键时清空value字段内容
								thisGrid.datagrid('updateRow',{
									index: param.index,
									row: {
										value: ''
									}
								});
								//thisGrid.datagrid('selectRow', param.index).datagrid('editkeyboard', {index:param.index,field:param.field});
							}
							break;
						default:
							break;
					}
				});
			}
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	}
});
$.extend($.fn.datagrid.defaults, {
	onClickCell: function(index, field){
		var opts = $(this).datagrid('options');
		if(opts.editIndex>=0){
			$(this).datagrid('endEdit', opts.editIndex);
		}
		$(this).datagrid('selectRow', index).datagrid('editkeyboard', {index:index,field:field});
		opts.editIndex = index
	}
});
