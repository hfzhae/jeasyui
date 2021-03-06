/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/27
查询模板客户端对象，包括单据的表头、表体，功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/

ebx.qt = {
	id: 0,
	billType: 0,
	ParentId: 0,
	data:{},
	tabs: [],
	tab: [],
	layout: [],
	northPanel: [],
	eastPanel: [],
	centerPanel: [],
	parament: {},
	biribbon: [],
	centerStorage: [],
	eastStorage: [],
	showLock:0,
	init: function(callBack){//单据初始化函数。callBack：回掉函数对象
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.parament = ebx.getMenuparamenter(this.tabs);
		this.id = ebx.validInt(this.parament.id);
		if(ebx.validInt(this.parament.lock) == 1){
			this.showLock = 1;
		}
		this.layout = $('<div>').appendTo(this.tabs)
		this._default();
		
		this.eastPanel = this.layout.layout('panel', 'east');
		this.eastStorage = $('<div>').appendTo(this.eastPanel);
		this._east(callBack.east);
		
		this.northPanel = this.layout.layout('panel', 'north');
		this.biribbon = $('<div>').appendTo(this.northPanel);
		this._north(callBack.north);
		
		this.centerPanel = this.layout.layout('panel', 'center');
		this.centerStorage = $('<div>').appendTo(this.centerPanel);
		this._center(callBack.center, callBack.center1);
	},
	_export: function(ExportBtn, _layout, _tab){//导入函数方法，参数：ExportBtn：点击的按钮对象，_layout：当前页的layout对象，_tab：当前页的tab对象
		ebx.importExcel.fileInput = $('<input type="file" accept=".xls,.xlsx">').appendTo('body');
		ebx.importExcel.fileInput.change(function(){
			ExportBtn.linkbutton('disable');
			ebx.importExcel.datagridObj = _layout.layout('panel', 'center').find('.datagrid-f');
			ebx.importExcel.tabObj = _tab;
			ebx.importExcel.btnObj = ExportBtn;
			ebx.importExcel.getFile(this);
		});
		ebx.importExcel.fileInput.trigger("click");
	},
	_default: function(){//单据页面框架 2018-8-10 zz
		this.layout.layout({
			width:'100%',
			height:'100%'
		});
		
		this.layout.layout('add',{
			region: 'center',
			title: '',
			//href: 'client/SimpChinese/' + this.parament.modedit + '/center.html',
			//hideExpandTool: false,
			//hideCollapsedContent: false,
			border: false,
			split: true
		}).layout('add',{
			region: 'east',
			width: '30%',
			maxWidth: '50%',
			minWidth: 300,
			//title: '基本信息',
			//href: 'client/SimpChinese/' + this.parament.modedit + '/east.html',
			hideExpandTool: false,
			hideCollapsedContent: false,
			border: false,
			split: true,
			collapsedContent: function(title){
				var region = $(this).panel('options').region;
				if(region =='north'|| region =='south'){
					//返回标题;
				} else {
					return '<div class="panel-title layout-expand-title layout-expand-title-down">属性</ div>';
				}
			}
		}).layout('add', {
			region: 'north',
			//title:'功能',
			height: 113,
			//href: 'client/SimpChinese/' + this.parament.modedit + '/north.html',
			border: false,
			split: false,
			hideCollapsedContent: false,
			collapsedContent: function(title){
				var region = $(this).panel('options').region;
				if(region =='east'|| region =='south'){
					//返回标题;
				} else {
					return '<div class="panel-title layout-expand-title-down">功能</ div>';
				}
			}
		});
	},
	_center: function(callBack, callBack1){//单据表体对象，参数：callBack：回掉函数，datagrid装载前执行，callBack1：回掉函数，datagrid装载后执行
		var bd = this,
			_layout = this.layout,
			_centerPanel = this.centerPanel,
			_parament = this.parament,
			_tab = this.tab,
			_centerStorage = this.centerStorage;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/DataProvider/style/',
			data: {style:'QueryColumns',_:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					columnsData = [result.data];
					ebx.setListVies(columnsData[0]);
					ebx.setDatagridEditor.editorType(columnsData[0], 'source', 'combogrid', {
						columns:[[    
							{field:'alias',title:'列',width:100},
							{field:'memo',title:'说明',width:150},
						]],
						idField:"alias",
						textField:"alias",
						hasDownArrow:false,
						panelWidth:300,
						fitColumns:true,
						prompt:'选择列',
						editable:true,
						width:100,
						onShowPanel:function(newValue,oldValue){
							var d = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('options').WizardData,
								grid = $(this).combogrid('grid');
								
							grid.datagrid('loadData', d);
						},
						onChange: function(newValue, oldValue){
							var row = _centerStorage.datagrid('getSelected');
							if(newValue == ''){
								for(var i in row){
									if(i != 'order'){
										row[i] = '';
									}
								}
							}else{
								row.alias = (row.alias=='')||(row.source!=newValue)?newValue:row.alias;
								row.id = ((row.alias!='')&&(row.id!=''))&&((row.id==row.source&&row.id!=''))?newValue:row.id;
								row.output = row.source!=newValue?1:row.output;
								row.width = row.source!=newValue?80:row.width;
							}
						}
					});
					/*
					ebx.setDatagridEditor.editorType(columnsData[0], 'id', 'combogrid', {
						columns:[[    
							{field:'alias',title:'列',width:100},
							{field:'memo',title:'说明',width:150},
						]],
						idField:"alias",
						textField:"alias",
						hasDownArrow:false,
						panelWidth:300,
						fitColumns:true,
						prompt:'选择列',
						width:100,
						onShowPanel:function(newValue,oldValue){
							var d = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('options').WizardData,
								grid = $(this).combogrid('grid');
								
							grid.datagrid('loadData', d);
						},
						onChange: function(newValue, oldValue){
							if(newValue == '') return;
							var row = _centerStorage.datagrid('getSelected');
							row.alias = (row.alias=='')||(row.source!=newValue)?newValue:row.alias;
							row.source = newValue;
							row.output = row.id!=newValue?1:row.output;
							row.width = row.id!=newValue?80:row.width;
						}
					});
					*/
					ebx.setDatagridEditor.editorType(columnsData[0], 'groupby', 'combobox', {
						idField:'value',
						textField:'title',
						panelHeight:'auto',
						editable:false,
						data:[
							{
								title: '合计',
								value: 'Sum'
							},{
								title: '最大',
								value: 'Max'
							},{
								title: '最小',
								value: 'Min'
							},{
								title: '平均',
								value: 'Avg'
							},{
								title: '计数',
								value: 'Count'
							},{
								title: '无',
								value: ''
							}
						],
						hasDownArrow:false//隐藏右边得下箭头
					});
					
					ebx.setDatagridEditor.editorType(columnsData[0], 'output', 'checkbox', {on:'1',off:''});
					ebx.setDatagridEditor.editorType(columnsData[0], 'sum', 'checkbox', {on:'1',off:''});
					
					ebx.setDatagridEditor.editorType(columnsData[0], 'sort', 'combobox', {
						idField:'value',
						textField:'title',
						panelHeight:'auto',
						editable:false,
						data:[
							{
								title: '顺序',
								value: '1'
							},{
								title: '倒序',
								value: '2'
							},{
								title: '无',
								value: ''
							}
						],
						hasDownArrow:false//隐藏右边得下箭头
					});
					
					ebx.setDatagridEditor.editorType(columnsData[0], 'render', 'combobox', {
						valueField:'value',    
						textField:'label',
						hasDownArrow:false,//隐藏右边得下箭头
						panelHeight:'auto',
						reversed:false,
						editable:false,
						data: ebx.render.render  
					});

					if(callBack)callBack(columnsData, _centerStorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
					_centerStorage.datagrid({
						//view:scrollview,
						//pageSize:ebx.pageSize,
						remoteSort:false,
						rownumbers:true,
						singleSelect:true,
						pagination:false,
						border:false,
						fit:false,
						fitColumns:false,
						striped:true,
						url:'server/SimpChinese/'+_parament.modedit+'/center/',
						nowrap:true,//禁用自动换行
						method:'post',
						queryParams:{_:(new Date()).getTime(),id:_parament.id},
						multiSort:false,
						checkOnSelect:false,
						columns:columnsData,
						height: '100%',
						border:result.bd[0].border,
						showFooter:result.bd[0].footer?true:false,
						showHeader:result.bd[0].header
					}).datagrid('renderformatterstyler');//启用显示式样回调函数
				}
				if(callBack1)callBack1(_centerStorage);
			}
		});
	},
	_save:function(asSave, _layout, _parament, _tab, bdx, callBack){//保存方法，参数：asSave：是否另存，1为另存，_layout：单据页面的layout对象，_parament：参数数组，_tab：tabs的tab对象用来标识编辑状态，bdx：全局对象，callBack回到函数
		var bdList = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('getData'),
			bd = ebx.convertDicToJson(_layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData')),
			ParentId = asSave?_parament.id:0,
			saveText = asSave?'另存':'保存',
			paramenter = {bdList: ebx.convertDicToJson(bdList), bd: bd, _: (new Date()).getTime(), id: _parament.id, parentid: ParentId};

		if(bdList.total == 0){
			$.messager.alert('错误', saveText + '失败！数据库表不能为空。', 'error');
			callBack();
			return;
		}
		
		if(!ebx.checkedBdValidateBox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callBack();
			return;
		}
		$.messager.progress({title:'正在保存...',text:''}); 
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + _parament.modedit + '/save/',
			data: paramenter,
			dataType: "json",
			success: function(result){
				$.messager.progress('close');
				if(result.result){
					$.messager.show({
						title: '提示',
						msg: saveText + '成功！',
						timeout: 3000,
						showType: 'slide'
					});	
					ebx.setEditStatus(_tab, false);
					bdx.id = result.id;
					
					//_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:bdx.id, _:(new Date()).getTime(), page:1, rows: ebx.pageSize});
					//bdx.init('center');
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:bdx.id, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', saveText + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callBack()
			}
		});
	},
	_new: function(options){
		var paramenter = {};
		for(var i in options._parament){
			switch(typeof(options._parament[i])){
				case 'string':
					paramenter[i.toLowerCase()] = options._parament[i].toString().toLowerCase();
					break;
				case 'number':
					paramenter[i.toLowerCase()] = options._parament[i];
					break;
			}
		}
		paramenter.id = 0;
		var tabsId = 'tabs_'+ebx.rndNum(20)
		ebx.center.tabs('add', {
			id: tabsId,
			title: '新建-' + options._parament.text,
			href: 'client/SimpChinese/' + options._parament.modedit + '/',
			paramenters:paramenter,
			//iconCls:node.iconCls,
			selected: true,
			closable:true
		});
	},
	_east: function(callBack){//单据属性对象
		var _eastStorage = this.eastStorage,
			_tabs = this.tabs,
			_layout = this.layout,
			_tab = this.tab,
			_WizardData = this.WizardData;
		
		_eastStorage.propertygrid({
			url: 'server/SimpChinese/'+this.parament.modedit+'/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.parament.id},
			showGroup: true,
			width:'100%',
			height:'100%',
			border:false,
			lastinsertRow:false,
			columns: [[
				{field:'name',title:'名称',width:100,resizable:true,sortable:true},
				{field:'value',title:'值',width:100,resizable:true}
			]],
			showHeader: true,
			onLoadSuccess: function(data){
				var _biribbon = _tabs.find('.layout').layout('panel', 'north').find('.ribbon-tab'),
					deleted = ebx.getBiribbonObj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.getBiribbonObj(_biribbon, 'undeleted', 'linkbutton');
					
				if(undeleted)undeleted.linkbutton('disable');
				if(deleted)deleted.linkbutton('disable');
					
				for(var i in data.rows){
					if(data.rows[i].field == '_isDeleted'){//处理删除显示
						if(ebx.validInt(data.rows[i].value) == 0){
							if(undeleted)undeleted.linkbutton('disable');
							if(deleted)deleted.linkbutton('enable');
						}else{
							if(deleted)deleted.linkbutton('disable');
							if(undeleted)undeleted.linkbutton('enable');
						}
					}
				}
				if(callBack)callBack(data, _eastStorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
				 
				_eastStorage.datagrid('options').WizardData = {total:0, rows: []}//初始化查询设计字段数据
				 
				var WizardID = 0;
				
				for(var i in data.rows){
					if(data.rows[i].field == 'wizardid'){
						WizardID = data.rows[i].value;
					}
				}
				
				if(WizardID > 0){//装载查询设计字段数据
					$.ajax({
						type: 'post', 
						url: 'server/SimpChinese/querytemplate/columns/',
						data:{id:WizardID,_:(new Date()).getTime()},
						dataType: "json",
						success: function(result){
							if(result){
								_eastStorage.datagrid('options').WizardData = result;
							}
						}
					});
				}
				ebx.setDatagridEditor.editorMethods(data.rows, 'wizard', 'combogrid', {//查询设计编辑器选择事件重造
					onSelect: function(rowIndex, rowData){
						var r = _eastStorage.datagrid('getData').rows,
							otp = _eastStorage.datagrid('options');
							
						for(var i in r){
							if(r[i].field == 'wizardid'){
								r[i].value = rowData.id;
							}
						}
						$.ajax({
							type: 'post', 
							url: 'server/SimpChinese/querytemplate/columns/',
							data:{id:rowData.id,_:(new Date()).getTime()},
							dataType: "json",
							success: function(result){
								if(result){
									otp.WizardData = result;
								}
							}
						});
					}
				});
				ebx.setDatagridEditor.editorMethods(data.rows, 'wizard', 'combogrid', {//查询设计编辑器更新事件重造
					onChange: function(newValue, oldValue){
						if(oldValue != ''){
							_layout.layout('panel', 'center').find('.datagrid-f').datagrid('loadData', {total:0, rows:[]});
						}
					}
				});
				ebx.setDatagridEditor.editorType(data.rows, 'privilege', 'textbox', {
					buttonText:'分配权限',
					onClickButton:function(){
						var value = $(this).val();
						
						$.messager.progress({title:'正在读取...',text:''}); 
						$.ajax({
							type: 'post', 
							url: 'server/SimpChinese/privilege/getall/',
							data:{_:(new Date()).getTime()},
							dataType: "json",
							success: function(result){
								$.messager.progress('close');
								if(result){
									var win = $('<div>').appendTo($('body')),
										privilegelayout = $('<div>').appendTo(win),
										privilege1 = $('<div>'),
										toolbar1 = $('<div>'),
										search1 = $('<div>').appendTo(toolbar1),
										setprv = $('<div>').appendTo(toolbar1),
										setprvall = $('<div>').appendTo(toolbar1),
										privilege2 = $('<div>'),
										toolbar2 = $('<div>'),
										search2 = $('<div>').appendTo(toolbar2),
										delprv = $('<div>').appendTo(toolbar2),
										delprvall = $('<div>').appendTo(toolbar2),
										data1 = {total: 0, rows:[]},
										data2 = {total: 0, rows:[]},
										valueArr = value.split(',');
									
									for(var i in result.rows){
										var x = 0;
										for(var j in valueArr){
											if(ebx.validInt(result.rows[i].id) === ebx.validInt(valueArr[j])){
												x = 1;
												data2.rows.push(result.rows[i]);
												data2.total++;
											}
										}
										if(x === 0){
											data1.rows.push(result.rows[i])
											data1.total++;
										}
									}
									
									win.window({
										title: '权限',
										width:800,    
										height:600, 
										maxWidth:'90%',
										maxHeight:'90%',
										modal:true,
										noheader:true,
										collapsible:false,
										minimizable:false,
										maximizable:false,
										resizable:false,
										border:'thin',
										shadow:false,
										onBeforeClose: function(){
											if(search1.searchbox('getValue') != ''){
												search1.searchbox('setValue', '');//退出前清空未分配搜索框
												search1.searchbox('options').searcher('');//退出前重置未分配列表
											}
											if(search2.searchbox('getValue') != ''){
												search2.searchbox('setValue', '');//退出前清空已分配搜索框
												search2.searchbox('options').searcher('');//退出前重置已分配列表
											}

											var data = privilege2.datagrid('getData').firstRows,
												v = '',
												oldv = _eastStorage.datagrid('getRows')[_eastStorage.datagrid('getRowIndex', _eastStorage.datagrid('getSelected'))].value;
											
											for(var i in data){
												v += data[i].id + ',';
											}
											v = v.substr(0, v.length - 1);

											_eastStorage.datagrid('updateRow', {
												index:_eastStorage.datagrid('getRowIndex', _eastStorage.datagrid('getSelected')),
												row:{
													value: v
												}
											});
											if(oldv != v)ebx.setEditStatus(_tab, true);
											win.remove();
										}
									});
									$('body').find('.window-mask').on('click', function(){
										win.window('close');
									}); 
									
									privilegelayout.layout({
										fit: true
									}).layout('add',{    
										region: 'west',    
										width: '50%',    
										title: '未分配权限',    
										split: true,
										border:false,
										collapsible:false,
										maxWidth:'50%',
										minWidth:'50%'
									}).layout('add',{    
										region: 'center',    
										width: '50%',    
										title: '已分配权限',
										border:false
									});
									
									privilegelayout.layout('panel', 'west').append(privilege1);
									privilegelayout.layout('panel', 'center').append(privilege2);
									
									search1.searchbox({    
										prompt:'搜索权限',
										searcher:function(value, name){
											var filterdata = [],
												data = privilege2.datagrid('getData').firstRows;
												
											for(var i in result.rows){
												var x = 0
												for(var j in data){
													if(result.rows[i].id === data[j].id){
														x = 1;
													}
												}
												if(x === 0){
													filterdata.push(result.rows[i]);
												}
											}
											privilege1.datagrid('loadData', {total: filterdata.length, rows: filterdata});
											//}else{
											if(value != ''){
												var data = privilege1.datagrid('getData').firstRows;
												filterdata = data.filter(function(e){
													return (e.title.toLowerCase().indexOf(value.toLowerCase())>=0)||(e.memo.toLowerCase().indexOf(value.toLowerCase())>=0);
												});
												privilege1.datagrid('loadData', {total: filterdata.length, rows: filterdata});
											}
										}
									});
									search1.searchbox('textbox').focus(function(){//未分配搜索框焦点激活时处理已分配的内容
										var v = search2.searchbox('getValue');
										if(v != ''){
											search2.searchbox('setValue', '');//清空已分配搜索框
											search2.searchbox('options').searcher('');//重置已分配列表
										}
									})
									setprv.linkbutton({
										text:'分配',
										plain:true,
										iconCls:'icon-TableInsertColumnsRightprv',
										onClick:function(){
											var row = privilege1.datagrid('getSelected');
											if(!row){
												$.messager.show({
													title: '提示',
													msg: '请先选择一行未分配权限。',
													timeout: 3000,
													showType: 'slide'
												});	
												return;
											}
											var index = privilege1.datagrid('getRowIndex',row);
											privilege2.datagrid('appendRow', row);
											privilege1.datagrid('deleteRow', index);
											
											if(index >= privilege1.datagrid('getData').firstRows.length && index > 0) index--;
											if(privilege1.datagrid('getData').firstRows.length == 0 || index < 0){
												privilege1.datagrid('loadData', { total: 0, rows: [] }); 
											}else{
												privilege1.datagrid('selectRow', index);
											}
										}
									});
									setprvall.linkbutton({
										text:'全部分配',
										plain:true,
										iconCls:'icon-TableInsertColumnsRightprvall',
										onClick: function(){
											var data1 = privilege1.datagrid('getData').firstRows,
												data2 = privilege2.datagrid('getData').firstRows,
												data = [];
											if(data1.length <= 0) return;
											for(var i in data2){
												data.push(data2[i]);
											}
											for(var i in data1){
												data.push(data1[i])
											}
											privilege1.datagrid('loadData', {total: 0, rows: []});
											privilege2.datagrid('loadData', {total: data.length, rows: data});
										}
									});
									
									search2.searchbox({    
										prompt:'搜索权限',
										searcher:function(value, name){
											var filterdata = [],
												data = privilege1.datagrid('getData').firstRows;
												
											for(var i in result.rows){
												var x = 0
												for(var j in data){
													if(result.rows[i].id === data[j].id){
														x = 1;
													}
												}
												if(x === 0){
													filterdata.push(result.rows[i]);
												}
											}
											privilege2.datagrid('loadData', {total: filterdata.length, rows: filterdata});
											if(value != ''){
												var data = privilege2.datagrid('getData').firstRows;
												filterdata = data.filter(function(e){
													return (e.title.toLowerCase().indexOf(value.toLowerCase())>=0)||(e.memo.toLowerCase().indexOf(value.toLowerCase())>=0);
												});
												privilege2.datagrid('loadData', {total: filterdata.length, rows: filterdata});
											}
										}   
									});
									search2.searchbox('textbox').focus(function(){//已分配搜索框焦点激活时处理未分配的内容
										var v = search1.searchbox('getValue');
										if(v != ''){
											search1.searchbox('setValue', '');//清空未分配搜索框
											search1.searchbox('options').searcher('');//重置未分配列表
										}
									})
									delprv.linkbutton({
										text:'删除',
										plain:true,
										iconCls:'icon-CellsDelete',
										onClick:function(){
											var row = privilege2.datagrid('getSelected');
											if(!row){
												$.messager.show({
													title: '提示',
													msg: '请先选择一行已分配权限。',
													timeout: 3000,
													showType: 'slide'
												});	
												return;
											}
											var index = privilege2.datagrid('getRowIndex',row);
											privilege1.datagrid('appendRow', row);
											privilege2.datagrid('deleteRow', index);
											
											if(index >= privilege2.datagrid('getData').firstRows.length && index > 0) index--;
											if(privilege2.datagrid('getData').firstRows.length == 0 || index < 0){
												privilege2.datagrid('loadData', { total: 0, rows: [] }); 
											}else{
												privilege2.datagrid('selectRow', index);
											}
										}
									});
									delprvall.linkbutton({
										text:'全部删除',
										plain:true,
										iconCls:'icon-TableDelete',
										onClick: function(){
											var data1 = privilege1.datagrid('getData').firstRows,
												data2 = privilege2.datagrid('getData').firstRows,
												data = [];
											if(data2.length <= 0) return;
											for(var i in data1){
												data.push(data1[i]);
											}
											for(var i in data2){
												data.push(data2[i])
											}
											privilege2.datagrid('loadData', {total: 0, rows: []});
											privilege1.datagrid('loadData', {total: data.length, rows: data});
										}
									});
									privilege1.datagrid({
										view:scrollview,
										pageSize:ebx.pageSize,
										columns:[[    
											{field:'id',title:'ID',width:30},
											{field:'title',title:'权限',width:100},
											{field:'memo',title:'说明',width:100}
										]],
										fitColumns:true,
										height:'100%',
										rownumbers:true,
										striped:true,
										border:false,
										singleSelect:true,
										toolbar:toolbar1,
										data:data1,
										onClickCell:function(){},//阻止自定义keyboar控件影响双击事件
										onDblClickRow: function(index, row){
											privilege2.datagrid('appendRow', row);
											privilege1.datagrid('deleteRow', index);
										}
									});
									privilege2.datagrid({
										view:scrollview,
										pageSize:ebx.pageSize,
										columns:[[    
											{field:'id',title:'ID',width:30},
											{field:'title',title:'权限',width:100},
											{field:'memo',title:'说明',width:100}
										]],
										fitColumns:true,
										height:'100%',
										rownumbers:true,
										striped:true,
										singleSelect:true,
										border:false,
										toolbar:toolbar2,
										data:data2,
										onClickCell:function(){},//阻止自定义keyboar控件影响双击事件
										onDblClickRow: function(index, row){
											privilege1.datagrid('appendRow', row);
											privilege2.datagrid('deleteRow', index);
										}
									});
								}
							}
						});

						
					}
				});
			}
		}).datagrid('renderformatterstyler');//启用显示式样回调函数
	},
	_north: function (callBack){//单据表头按钮对象 2018-7-9 zz
		var bd = this,
			_layout = this.layout,
			_eastPanel = this.eastPanel,
			_parament = this.parament,
			_tabs = this.tabs,
			_tab = this.tab,
			_biribbon = this.biribbon,
			_centerStorage = this.centerStorage,
			_save = this._save,
			_ID = this.id,
			_showLock = this.showLock,
			_new = this._new,
			hideNorthBtn = $('<div>').appendTo(_layout.layout('panel', 'north')),
			hideEastBtn = $('<div>').appendTo(_layout.layout('panel', 'east')),
			data = {
				selected:0,
				tabs:[{
					title:'开始',
					groups:[{
						title:'基本操作',
						tools:[{
							type:'splitbutton',
							name:'save',
							text:'保存',
							iconCls:'icon-FileSave-large',
							iconAlign:'top',
							size:'large',
							menuItems:[{
								name:'saveas',
								text:'另存为',
								iconCls:'icon-FileSaveAs',
								onClick: function(){
									$.messager.confirm('提示', '是否需要另存？', function(r){
										if (r){
											_save(1, _layout, _parament, _tab, bd, function(){ });
										}
									});
								}
							}],
							onClick: function(){
								var lockbtn = ebx.getBiribbonObj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn && _showLock == 1){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this);
								saveBtn.linkbutton('disable');
								_save(0, _layout, _parament, _tab, bd, function(){
									if(lockbtn){
										lockbtn.find('.l-btn-icon').removeClass('icon-unLock-large').addClass('icon-Lock-large');
										lockbtn.linkbutton('unselect');
									}
									saveBtn.linkbutton('enable');
								});
							}
						},{
							type:'toolbar',
							dir:'v',
							tools:[{
								name:'new',
								text:'新建',
								iconCls:'tree-file',
								onClick: function(){
									var options = {
										_parament: _parament,
										browserType: 'bd',
										_tabs: _tabs,
										_layout: _layout
									}; 
									_new(options);
								}
							},{
								name:'deleted',
								text:'删除',
								iconCls:'icon-Delete',
								disable:true,
								onClick:function(){
									var btn = $(this),
										undeleted = ebx.getBiribbonObj(_biribbon, 'undeleted', 'linkbutton'),
										_eastStorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._deleted(_ID, _parament.modedit, function(result){
										if(result.result){
											$.messager.show({
												title: '提示',
												msg: '删除成功！',
												timeout: 2000,
												showType: 'slide'
											});	
											btn.linkbutton('disable');
											if(undeleted)undeleted.linkbutton('enable');
											//_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eastStorage.propertygrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '删除失败！<br>' + JSON.stringify(result.msg), 'error');
										}
									});
								}
							},{
								name:'undeleted',
								text:'恢复',
								iconCls:'icon-reload',
								disable:true,
								onClick:function(){
									var btn = $(this),
										deleted = ebx.getBiribbonObj(_biribbon, 'deleted', 'linkbutton'),
										_eastStorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._undeleted(_ID, _parament.modedit, function(result){
										if(result.result){
											$.messager.show({
												title: '提示',
												msg: '恢复成功！',
												timeout: 2000,
												showType: 'slide'
											});	
											btn.linkbutton('disable');
											if(deleted)deleted.linkbutton('enable');
											//_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eastStorage.propertygrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '恢复失败！<br>' + JSON.stringify(result.msg), 'error');
										}
									});
								}
							}]
						}]
					},{
						type:'toolbar',
						title:'行操作',
						tools:[{
							text:'新行',
							iconCls:'icon-CellsInsertDialog-large',
							iconAlign:'top',
							size:'large',
							onClick:function(){
								var rows = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getRows'),
									WizardID = 0;
									
								for(var i in rows){
									if(rows[i].field == 'wizardid'){
										WizardID = ebx.validInt(rows[i].value);
									}
								}
								
								if(WizardID == 0){
									$.messager.alert('错误', '请先选择查询设计。', 'error');
									return;
								}
								var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
									opts = listdatagrid.datagrid('options'),
									fields = listdatagrid.datagrid('options').columns[0],
									field = fields[0].field;
								
								opts.editIndex = listdatagrid.datagrid('getData').total;
								listdatagrid.datagrid('appendRow',{
									order: listdatagrid.datagrid('getRows').length + 1
								});
								listdatagrid.datagrid('scrollTo', listdatagrid.datagrid('getData').total - 1);//滚动到新增的行
								listdatagrid.datagrid('selectRow', listdatagrid.datagrid('getData').total - 1);
								
								for(var i in fields){
									if(fields[i].editor && !fields[i].hidden){
										field = fields[i].field;
										break;
									}
								}

								listdatagrid.datagrid('editkeyboard', {index: listdatagrid.datagrid('getData').total - 1, field: 'source'}); 
								
								ebx.setEditStatus(_tab, true);
								//listdatagrid.datagrid('reload');
							}
						},{
							type:'toolbar',
							dir:'v',
							tools:[{
								name:'deleterow',
								text:'删行',
								//disabled: true,
								iconCls:'icon-CellsDelete',
								onClick:function(){
									var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
										index = listdatagrid.datagrid('getRowIndex', listdatagrid.datagrid('getSelected'));
									if(index < 0){
										$.messager.show({
											title: '提示',
											msg: '请先选中一行。',
											timeout: 3000,
											showType: 'slide'
										});									
										return;
									}
									$.messager.confirm('确认对话框', '您想要删除吗？删除操作后数据将无法恢复。', function(r){
										if (r){
											listdatagrid.datagrid('deleteRow', index);

											if(index >= listdatagrid.datagrid('getData').total && index > 0) index--;
											
											if(listdatagrid.datagrid('getData').total == 0 || index < 0){
												listdatagrid.datagrid('loadData', { total: 0, rows: [] }); 
											}else{
												listdatagrid.datagrid('selectRow', index);
											}
											
											ebx.setEditStatus(_tab, true);
										}
									});
								}
							},{
								name:'empty',
								text:'清空',
								iconCls:'icon-TableDelete',
								onClick:function(){
									$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
										if (r){
											var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
												total = listdatagrid.datagrid('getData').total;
											listdatagrid.datagrid('loadData', { total: 0, rows: [] }); 
											ebx.setEditStatus(_tab, true)
										}
									});
								}
							}]
						}]
					},{
						title:'内容',
						tools:[{
							text:'导出',
							iconCls:'icon-AdpStoredProcedureEditSql-large',
							iconAlign:'top',
							size:'large',
							onClick:function(){
								var id = ebx.validInt(_parament.id);

								if(id == 0){
									$.messager.alert('错误', '请先保存查询模板。', 'error');
									return;
								}
								$.messager.progress({title:'正在保存...',text:''}); 
								$.ajax({
									type: 'post', 
									url: 'server/SimpChinese/' + _parament.modedit + '/sql/',
									data: {id: id, isDeleted: -1, _: (new Date()).getTime()},
									dataType: "json",
									success: function(result){
										$.messager.progress('close');
										if(result.result){
											var sql = unescape(result.sql);
											
											sql = sql.replaceAll('select ', 'select \n');
											sql = sql.replaceAll('],', '],\n');
											sql = sql.replaceAll('and ', 'and \n');
											sql = sql.replaceAll('or ', 'or \n');
											sql = sql.replaceAll('from ', '\n\nfrom \n');
											sql = sql.replaceAll('where ', '\n\nwhere \n');
											sql = sql.replaceAll('group by ', '\n\ngroup by \n');
											sql = sql.replaceAll('order by ', '\n\norder by \n');
											sql = sql.replaceAll('union all ', '\n\nunion all \n\n');
											
											ebx.clipBoardString(sql);
										}
									}
								});
							}
						}]
					},{
						title:'安全',
						tools:[{
							type:'toolbar',
							tools:[{
								name:'lock',
								text:'编辑锁',
								iconCls:'icon-Lock-large',
								iconAlign:'top',
								size:'large',
								onClick: function(){
									var btnicon = $(this).find('.l-btn-icon');
									if(btnicon.hasClass('icon-Lock-large')){
										btnicon.removeClass('icon-Lock-large').addClass('icon-unLock-large');
										$(this).linkbutton('unselect');
									}else{
										btnicon.removeClass('icon-unLock-large').addClass('icon-Lock-large');
										$(this).linkbutton('unselect');
									}
								}
							}]
						}]
					}/*,{
						title:'显示/隐藏',
						tools:[{
							type:'toolbar',
							dir:'v',
							tools:[{
								text:'功能',
								iconCls:'icon-TableInsertRowsAbove',
								onClick: function(){
									_layout.layout('collapse', 'north');
									_layout.find('.layout-expand-north').find('.panel-header').css({'border-top':0,'border-left':0,'border-right':0});
								}
							},{
								text:'属性',
								iconCls:'icon-TableInsertColumnsRight',
								onClick: function(){
									if(_layout.layout("panel", "east")[0].clientWidth > 0){
										_layout.layout('collapse', 'east');
										_layout.find('.layout-expand-east').find('.panel-header').css({'border-top':0,'border-right':0});
										_layout.find('.layout-expand-east').find('.panel-body').css({'border-top':0,'border-right':0,'border-bottom':0});
									}else{
										_layout.layout('expand', 'east');
									}
								}
							}]
						}]
					}*/]
				}]
			};
			
		if(callBack)callBack(data);//回掉函数处理功能按钮的添加删除；
		
		_biribbon.ribbon({
			data:data,
			width:'100%',
			height:'100%',
			border: false,
			plain:true,
			showHeader: false
		});
		
		hideNorthBtn.linkbutton({
			iconCls: 'icon-uparrow',
			iconAlign:'right',
			plain:true,
			onClick:function(){
				_layout.layout('collapse', 'north');
				_layout.find('.layout-expand-north').find('.panel-header').css({'border-top':0,'border-left':0,'border-right':0});
			}
		}).css({
			'position':'absolute',
			//'z-index':99999,
			'right':0,
			'bottom':0
		});
		
		hideEastBtn.linkbutton({
			iconCls: 'icon-rightarrow',
			iconAlign:'right',
			plain:true,
			onClick:function(){
				_layout.layout('collapse', 'east');
				_layout.find('.layout-expand-east').find('.panel-header').css({'border-top':0,'border-right':0});
				_layout.find('.layout-expand-east').find('.panel-body').css({'border-top':0,'border-right':0,'border-bottom':0});
			}
		}).css({
			'position':'absolute',
			//'z-index':99999,
			'left':0,
			'top':0,
			'width':14
		}).find('.icon-rightarrow').css({
			'position':'absolute',
			'left':-2
		});

		if(this.showLock == 0){
			var lockgroup = ebx.getBiribbonObj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
	}
}
