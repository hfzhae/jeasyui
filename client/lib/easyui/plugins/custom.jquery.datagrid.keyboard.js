/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/4/26
改造jeasyui的datagrid插件的onClickCell属性，增加editkeyboard方法，支持编辑状态下全键盘操作

存在的问题：
1、datebox和combobox控件编辑器不支持失去焦点自动结束编辑状态
2、新增lastinsertRow属性，默认为true，默认编辑到表格最后一行最后一个字段回车时自动添加一行
*****************************************************************/

$.extend($.fn.datagrid.methods, {
	editkeyboard: function(jq,param){
		return jq.each(function(){
			var opts = $(this).datagrid('options'),
				k = 0,
				fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields')),
				editorfields = [];
			
			$(this).datagrid('highlightRow', param.index);
			$(this).datagrid('endEdit', param.index);

			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if(col.editor1 != undefined && col.editor1 != '' && !col.hidden){
					editorfields.push(col.field);//获取可编辑字段数组
				}
				if (fields[i] != param.field){
					col.editor = null;
				}else{
					if(col.hidden == true){//支持隐藏列//支持隐藏列
						col.editor = null;
					}else{
						k = 1;
					}
				}
				if(col.hidden == true && fields[i] == param.field && k == 0)param.field = fields[i + 1];//如果存在隐藏列，设置字段为下一个
			}
			$(this).datagrid('beginEdit', param.index);
			
			var obj = $(this).datagrid('getEditor', {index:param.index, field:param.field}),//获取激活的输入框对象
				thisGrid = $(this);
			
			if(obj != null){
				setColumnleft($(this), param.field);
				if($(obj.target).hasClass('textbox-f') == true){//判断是否是textbox-f对象还是text输入框，选用不同的获取对象方法
					var inputObj = $(obj.target).parent().find('input:eq(1)')
				}else{
					var inputObj = $(obj.target);//输入框自动激活焦点并全选
				}
				inputObj.select();
				
				//':not(.datagrid-row)',
				/*
				
				$('body').bind('click', function(e){
					e.stopPropagation();
					var grid = $('body').find('.datagrid-f');
					grid.each(function(index,item){
						var eaRows = $(this).datagrid('getRows');
						for(var i in eaRows){    
							$(this).datagrid('endEdit',i);    
						}; 
					})
				})
				*/
				switch(obj.type){
					case 'droplist':
						setTimeout(function(){
							obj.target.combo("showPanel");
						},200);
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								obj.target.combo("hidePanel");
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						break;
					case 'combogrid':
						setTimeout(function(){
							obj.target.combo("showPanel");
						},200);
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'datetimebox':
						setTimeout(function(){
							obj.target.combo("showPanel");
						},200);
						/*
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						*/
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'datebox':
						setTimeout(function(){
							obj.target.combo("showPanel");
						},200);
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						break;
					case 'combobox':
						setTimeout(function(){
							obj.target.combo("showPanel");
						},200);
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					case 'textbox':
						if(obj.target.parent().find('.textbox-button').length == 0){
							inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
								setTimeout(function(){
									thisGrid.datagrid('endEdit', param.index);
									thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								},0);
							});
						}
						//不支持失去焦点时，结束编辑状态，因会导致点击下拉框按钮无效
						break;
					default:
						inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
							setTimeout(function(){
								thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
							},0);
						});
						break;
				}
				/*
				if($(obj.target).hasClass('textbox-f') == false){
					inputObj.blur(function(){//编辑控件失去焦点时，结束编辑状态
						setTimeout(function(){
							thisGrid.datagrid('endEdit', param.index);
							thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
						},0);
					});
				}
				*/
				inputObj.keyup(function(event){//全键盘操作
					switch(event.keyCode){
						case 40://down
							if(obj.type == 'combogrid' || obj.type == 'droplist' || obj.type == 'combobox'){//combogrid控件不支持下键自动跳转下一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index + 1,field:param.field});
								},0);
							}
							break;
						case 38://up
							if(obj.type == 'combogrid' || obj.type == 'droplist' || obj.type == 'combobox'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index - 1,field:param.field});
								},0);
							}
							break;
						case 37://left
							if(obj.type == 'combogrid' || obj.type == 'droplist' || obj.type == 'combobox'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								var nextfield;
								
								for(var i=editorfields.length; i>0; i--){
									if(editorfields[i] == param.field){
										nextfield = editorfields[ebx.validInt(i) - 1];
									}
								}
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index,field:nextfield});
								},0);
							}
							break;
						case 39://right
							if(obj.type == 'combogrid' || obj.type == 'droplist' || obj.type == 'combobox'){//combogrid控件不支持上键自动跳转上一个编辑框
								
							}else{
								thisGrid.datagrid('endEdit', param.index);
								thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
								var nextfield;
								
								for(var i in editorfields){
									if(editorfields[i] == param.field){
										nextfield = editorfields[ebx.validInt(i) + 1];
									}
								}
								
								setTimeout(function(){
									thisGrid.datagrid('editkeyboard', {index:param.index,field:nextfield});
								},0);
							}
							break;
						case 13://enter
							if(obj.type == 'combogrid' || obj.type == 'droplist' || obj.type == 'combobox'){//combogrid控件支持搜索快捷键，当panel显示时，不跳转下一个编辑对象
								if(!$(obj.target).combogrid('panel').is(":hidden")){
									return;
								}
							}
							
							thisGrid.datagrid('endEdit', param.index);
							thisGrid.datagrid('cancelEdit', param.index);//针对validatebox校验失败无法endEdit的调用cancelEdit方法
							
							var nextfield = "", 
								//nextfieldname = param.field, 
								firstfield = editorfields[0],
								firstindex = param.index;
								
							for(var i in editorfields){
								if(editorfields[i] == param.field){
									nextfield = editorfields[ebx.validInt(i) + 1];
								}
							}
							
							if(nextfield == "" || nextfield == undefined){
								nextfield = firstfield;
								firstindex++;
								opts.editIndex++;
							}
							setTimeout(function(){
								var datacount = thisGrid.datagrid('getData').total,
									lastinsertRow = thisGrid.datagrid('options').lastinsertRow;
									
								if(lastinsertRow){
									if(firstindex >= datacount){//如果最后一行最后一个字段，回车后自动新增一行
										thisGrid.datagrid('appendRow',{});
										thisGrid.datagrid('selectRow', firstindex);
									}
								}
								thisGrid.datagrid('editkeyboard', {index:firstindex,field:nextfield});
							},0);
							break;
						case 27://esc
							thisGrid.datagrid('cancelEdit', param.index);
							break;
						case 46://del
							if(obj.type == 'combogrid' || obj.type == 'droplist'){//combogrid控件按下删除键时清空value字段内容
								var r = thisGrid.datagrid('getData').rows[param.index];
								r[param.field] = '';								
							}
							break;
						case 8://backspace
							if(obj.type == 'combogrid' || obj.type == 'droplist'){//combogrid控件按下退格键时清空value字段内容
								var r = thisGrid.datagrid('getData').rows[param.index];
								r[param.field] = '';								
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
	},
	//onLoadSuccess: function(data){//unescape所有文本数据
	//	var dg = $(this);
	//	dg.datagrid('fixRowHeight');
	//	ebx.unEscapeJson(data);
	//},
	onAfterEdit: function(rowIndex, rowData, changes){//完成编辑时修改编辑状态，用于判断是否需要保存提醒
		try{
			var tabs = ebx.center.tabs('getSelected'),
				tab = tabs.panel('options');
				
			if(Object.keys(changes).length){
				ebx.setEditStatus(tab, true);
			}
		}catch(e){}
	},
	lastinsertRow: true//编辑状态，最后一行最后一个字段会车时是否新增一行标志，true为新增，默认true
});
$.extend($.fn.propertygrid.defaults, {
	onAfterEdit: function(rowIndex, rowData, changes){//完成编辑时修改编辑状态，用于判断是否需要保存提醒
		try{
			var tabs = ebx.center.tabs('getSelected'),
				tab = tabs.panel('options');
				
			if(Object.keys(changes).length){
				ebx.setEditStatus(tab, true);
			}
		}catch(e){}
	}

});

function setColumnleft(s, Column){//调整编辑框的滚动位置 2018-8-4 zz，参数：s：datagrid对象，Column：列名
	if(typeof(s) != 'object') return;
	if(typeof(Column) != 'string') return;
	var w = 0,
		f = 0,
		c = s.datagrid('getColumnFields'),
		firstW = ebx.validFloat(s.datagrid('getColumnOption', c[0]).width);
	for(var i in c){
		if(c[i].toLowerCase() == Column.toLowerCase())f++;
		if(f == 0){
			w += (ebx.validFloat(s.datagrid('getColumnOption', c[i]).width) + 1);
		};
	}
	w -= firstW;
	s.prev().find('div.datagrid-body').animate({scrollLeft:  w - s.prev().width() / 3}, 200);
}
