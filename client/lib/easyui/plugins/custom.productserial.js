/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/5
单据串号编辑对象

*****************************************************************/

ebx.productserial = {
	open: function(title, seriallength, d, index){//打开串号编辑界面
		var v = d.datagrid('getRows')[index].productserial,
			win = $('<div>').appendTo($('body')),
			productserial = $('<div>').appendTo(win),
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newbtn = $('<div>').appendTo(toolbar),
			delbtn = $('<div>').appendTo(toolbar),
			removebtn = $('<div>').appendTo(toolbar),
			outbtn = $('<div>').appendTo(toolbar),
			inputbtn = $('<div>').appendTo(toolbar),
			seriallengthtext = ebx.validInt(seriallength)==0?'不限制':ebx.validInt(seriallength)+'位',
			columnsData = [[    
				{field:'productserial',title:'串号',width:300,
					editor:{
						type:'textbox',
						options:{
							validType:seriallength>0?['string','length[' + seriallength + ', ' + seriallength + ']']:'string',
							invalidMessage:'串号长度必须为：' + seriallengthtext,
							required:seriallength>0?true:false
						}
					}
				}  
			]],
			inputbtntemplate = $('<div>');
			
		win.window({
			title: title + ' 的串号，长度：' + seriallengthtext,
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
			shadow:false,
			onBeforeClose: function(){
				var data = productserial.datagrid('getRows'),
					data1 = [],
					data2 = [],
					reserialcount = 0,
					reserial = '';
				for(var i in data){
					reserialcount = 0
					if(data[i].productserial != '' && data[i].productserial != undefined){
						data1.push(data[i]);
						data2.push(data[i].productserial);
						if(data[i].productserial.length != ebx.validInt(seriallength) && ebx.validInt(seriallength) > 0){
							$.messager.show({
								title: '错误',
								msg: '串号：' + data[i].productserial + ' 的长度有误！串号长度应该为：' + seriallengthtext,
								timeout: 3000,
								showType: 'slide'
							});
							//productserial.datagrid('scrollTo', i);
							productserial.datagrid('editkeyboard', {index: i, field:'productserial'});
							productserial.datagrid('selectRow', i);
							return false;
						}
					}
				}
				var nary=data2.sort();
				for(var i=0;i<data2.length;i++){
					if (nary[i]==nary[i+1]){
						if(reserial.indexOf(nary[i]) < 0){
							reserial += nary[i] + ',';
						}
					}
				}

				if(reserial.length > 0){
					productserial.datagrid('clearSelections');
					$.messager.alert('错误','串号：' + reserial.substr(0, reserial.length - 1) + ' 存在重复','error');
					return false;
				}
				var oldquantity = d.datagrid('getRows')[index].quantity;
				d.datagrid('updateRow', {
					index: index,
					row:{
						productserial: data1.length>0?{total: data1.length, rows: data1}:[],
						quantity: data1.length==0?1:data1.length
					}
				})
				if(oldquantity != data1.length && data1.length > 0){
					d.datagrid('editkeyboard', {index: index, field:'quantity'});
				}
			}
		});
		$('body').find('.window-mask').on('click', function(){
			win.window('close');
		}); 
		productserial.datagrid({    
			//view:scrollview,
			//pageSize:ebx.pagesize,
			data: v,
			border:false,
			rownumbers:true,
			singleSelect:true,
			width:'100%',
			height:'100%',
			columns:columnsData,
			toolbar: toolbar
		});
		searchtext.textbox({    
			buttonText:'搜索',
			onClickButton: function(){
				productserial.datagrid('clearSelections');
				var find = searchtext.textbox('getValue'),
					data = productserial.datagrid('getData').rows;
				if(find.length <= 0) return;
				for(var i in data){
					if(data[i].productserial != undefined && data[i].productserial != ''){
						if(find.toLowerCase() == data[i].productserial.toLowerCase()){
							productserial.datagrid('selectRow', i);
							//productserial.datagrid('scrollTo', i);
						}
					}
				}
			}
		});
		searchtext.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) { 
				productserial.datagrid('clearSelections');
				var find = searchtext.textbox('getValue'),
					data = productserial.datagrid('getData').rows;
				if(find.length <= 0) return;
				for(var i in data){
					if(data[i].productserial != undefined && data[i].productserial != ''){
						if(find.toLowerCase() == data[i].productserial.toLowerCase()){
							productserial.datagrid('selectRow', i);
							//productserial.datagrid('scrollTo', i);
						}
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
		outbtn.linkbutton({
			text:'导出',
			iconCls: 'icon-ImportExcel',
			plain:true,
			onClick: function(){
				var data = productserial.datagrid('getRows')
				ebx.clipboardData(columnsData, {total: data.length, rows: data} );
			}
		});
		inputbtntemplate.menu({}).menu('appendItem', {
			text: '导入模板',
			iconCls:'icon-FileSaveAsExcelXlsx',
			onclick:function(){
				ebx.importTemplate(columnsData, '串号');
			}
		})
		inputbtn.splitbutton({
			text:'导入',
			iconCls: 'icon-ExportExcel',
			plain:true,
			onClick: function(){
				var ExportBtn = $(this);
				
				ebx.importExcel.fileinput = $('<input type="file" accept=".xls,.xlsx">').appendTo('body');
				ebx.importExcel.fileinput.change(function(){
					ExportBtn.linkbutton('disable');
					ebx.importExcel.datagridObj = productserial;
					//ebx.importExcel.tabObj = [];
					ebx.importExcel.btnObj = ExportBtn;
					ebx.importExcel.getFile(this);
				});
				ebx.importExcel.fileinput.trigger("click");
			},
			menu:inputbtntemplate
		});
	}
}
