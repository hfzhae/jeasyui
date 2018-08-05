/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/5
单据串号编辑对象

*****************************************************************/

ebx.productserial = {
	seriallength: 0,
	title: '',
	init: function(seriallength, title){//单据初始化函数。参数：layoutName：初始化区域名称，包括：list，default，browsertype：类型，包括：'bd','bi',callback：回掉函数
		this.seriallength = ebx.validInt('seriallength');
		this.title = title;
	},
	open: function(v){//打开串号编辑界面
		var win = $('<div>').appendTo($('body')),
			productserial = $('<div>').appendTo(win),
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newbtn = $('<div>').appendTo(toolbar),
			delbtn = $('<div>').appendTo(toolbar),
			removebtn = $('<div>').appendTo(toolbar),
			inputbtn = $('<div>').appendTo(toolbar);
			
		win.window({
			title: this.title + ' 的串号',
			width:640,    
			height:480, 
			maxWidth:'90%',
			maxHeight:'90%',
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			resizable:false,
			border:'thin',
			shadow:false
		})
		$('body').find('.window-mask').on('click', function(){
			win.window('close');
		}); 
		productserial.datagrid({    
			view:scrollview,
			pageSize:ebx.pagesize,
			data: v,
			border:false,
			rownumbers:true,
			singleSelect:true,
			width:'100%',
			height:'100%',
			columns:[[    
				{field:'productserial',title:'串号',width:300,editor:'text',sortable:true,sorter:function(a,b){  
						//a = a.split('/');  
						//b = b.split('/');  
						if (a[2] == b[2]){  
							if (a[0] == b[0]){  
								return (a[1]>b[1]?1:-1);  
							} else {  
								return (a[0]>b[0]?1:-1);  
							}  
						} else {  
							return (a[2]>b[2]?1:-1);  
						}  
					}
				}  
			]],
			toolbar: toolbar
		});
		
		searchtext.textbox({    
			buttonText:'搜索',
			onClickButton: function(){
				productserial.datagrid('clearSelections');
				for(var i in v.rows){
					if(searchtext.textbox('getValue').toLowerCase() == v.rows[i].productserial.toLowerCase()){
						productserial.datagrid('selectRow', i);
						productserial.datagrid('scrollTo', i);
					}
				}
			}
		});
		searchtext.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) { 
				productserial.datagrid('clearSelections');
				for(var i in v.rows){
					if(searchtext.textbox('getValue').toLowerCase() == v.rows[i].productserial.toLowerCase()){
						productserial.datagrid('selectRow', i);
						productserial.datagrid('scrollTo', i);
					}
				}
			}  
		});
		newbtn.linkbutton({
			text:'新行',
			iconCls: 'icon-CellsInsertDialog',
			plain:true,
			onClick: function(){
				productserial.datagrid('appendRow', {});
				productserial.datagrid('selectRow', productserial.datagrid('getData').total - 1);
				productserial.datagrid('editkeyboard', {index: productserial.datagrid('getData').total - 1, field:'productserial'});
			}
		});
		delbtn.linkbutton({
			text:'删行',
			iconCls: 'icon-CellsDelete',
			plain:true,
			onClick: function(){
				var index = productserial.datagrid('getRowIndex', productserial.datagrid('getSelected'));
				if(index < 0){
					$.messager.show({
						title: '提示',
						msg: '请先选中一行。',
						timeout: 3000,
						showType: 'slide'
					});									
					return;
				}
				productserial.datagrid('deleteRow', index);
				if(index >= productserial.datagrid('getData').total && index > 0) index--;
				if(productserial.datagrid('getData').total == 0 || index < 0){
					productserial.datagrid('loadData', { total: 0, rows: [] }); 
				}else{
					productserial.datagrid('selectRow', index);
				}
					
			}
		});
		removebtn.linkbutton({
			text:'清空',
			iconCls: 'icon-TableDelete',
			plain:true,
			onClick: function(){
				$.messager.confirm('确认对话框', '您想要清空所有串号吗？', function(r){
					if (r){
						productserial.datagrid('loadData', { total: 0, rows: [] }); 
					}
				});
			}
		});
		inputbtn.linkbutton({
			text:'导入',
			iconCls: 'icon-ExportExcel',
			plain:true,
			onClick: function(){
				
			}
		});
	}
}
