/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/27
查询设计客户端对象，包括单据的表头、表体，功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/

ebx.qw = {
	ID: 0,
	billtype: 0,
	ParentID: 0,
	data:{},
	tabs: [],
	tab: [],
	layout: [],
	northPanel: [],
	eastPanel: [],
	centerPanel: [],
	Paramet: {},
	biribbon: [],
	centerstorage: [],
	eaststorage: [],
	showLock:0,
	init: function(layoutName, callback, callback1){//单据初始化函数。参数：layoutName：初始化区域名称，包括：default，center，east，north，callback：回掉函数，datagrid装载前执行，callback1：回掉函数，datagrid装载后执行
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Paramet = ebx.getMenuParameter(this.tabs);
		this.ID = ebx.validInt(this.Paramet.id);
		if(ebx.validInt(this.Paramet.lock) == 1){
			this.showLock = 1;
		}
		
		switch(layoutName.toLowerCase()){
			case 'north':
				this.layout = this.tabs.find('.layout');
				this.northPanel = this.layout.layout('panel', 'north');
				this.biribbon = $('<div>').appendTo(this.northPanel);
				this._north(callback);
				break;
			case 'east':
				this.layout = this.tabs.find('.layout');
				this.eastPanel = this.layout.layout('panel', 'east');
				this.eaststorage = $('<div>').appendTo(this.eastPanel);
				this._east(callback);
				break;
			case 'center':
				this.layout = this.tabs.find('.layout');
				this.centerPanel = this.layout.layout('panel', 'center');
				this.centerstorage = $('<div>').appendTo(this.centerPanel);
				this._center(callback, callback1);
				break;
			case 'default':
				this.layout = $('<div>').appendTo(this.tabs)
				this._default();
				break;
		}
	},
	_export: function(ExportBtn, _layout, _tab){//导入函数方法，参数：ExportBtn：点击的按钮对象，_layout：当前页的layout对象，_tab：当前页的tab对象
		ebx.importExcel.fileinput = $('<input type="file" accept=".xls,.xlsx">').appendTo('body');
		ebx.importExcel.fileinput.change(function(){
			ExportBtn.linkbutton('disable');
			ebx.importExcel.datagridObj = _layout.layout('panel', 'center').find('.datagrid-f');
			ebx.importExcel.tabObj = _tab;
			ebx.importExcel.btnObj = ExportBtn;
			ebx.importExcel.getFile(this);
		});
		ebx.importExcel.fileinput.trigger("click");
	},
	_default: function(){//单据页面框架 2018-8-10 zz
		this.layout.layout({
			width:'100%',
			height:'100%'
		});
		
		this.layout.layout('add',{
			region: 'center',
			title: '',
			href: 'client/SimpChinese/' + this.Paramet.modedit + '/center.html',
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
			href: 'client/SimpChinese/' + this.Paramet.modedit + '/east.html',
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
			href: 'client/SimpChinese/' + this.Paramet.modedit + '/north.html',
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
	_center: function(callback, callback1){//单据表体对象，参数：callback：回掉函数，datagrid装载前执行，callback1：回掉函数，datagrid装载后执行
		var bd = this,
			_layout = this.layout,
			_centerPanel = this.centerPanel,
			_Paramet = this.Paramet,
			_tab = this.tab;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/'+_Paramet.modedit+'/center/',
			data: {id:_Paramet.id+'list',_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					var qwlayout = $('<div>').appendTo(_centerPanel),
						otp = _centerPanel.panel('options'),
						tables = $('<div>'),
						tablestoolbar = $('<div>'),
						tablesadd = $('<div>').appendTo(tablestoolbar),
						tablesdel = $('<div>').appendTo(tablestoolbar),
						tablesclear = $('<div>').appendTo(tablestoolbar),
						columns = $('<div>'),
						columnstoolbar = $('<div>'),
						coltable = $('<div>').appendTo(columnstoolbar),
						colcolumns = $('<div>').appendTo(columnstoolbar),
						columnsadd = $('<div>').appendTo(columnstoolbar),
						columnsdel = $('<div>').appendTo(columnstoolbar),
						columnsclear = $('<div>').appendTo(columnstoolbar),
						relates = $('<div>'),
						relatestoolbar = $('<div>'),
						relatesadd = $('<div>').appendTo(relatestoolbar),
						relatesdel = $('<div>').appendTo(relatestoolbar),
						relatesclear = $('<div>').appendTo(relatestoolbar),
						filter = $('<div>'),
						tabs = $('<div>');
						
					qwlayout.layout({
						width:'100%',
						height:'100%'
					});    

					qwlayout.layout('add',{    
						region: 'center',
						//title:'列和关系',
						border:false
					}).layout('add',{    
						region: 'south',    
						height: 150,
						maxHeight: '50%',
						minHeight: 150,
						title: '条件',
						iconCls:'icon-GroupSortFilter',
						hideExpandTool:false,
						hideCollapsedContent:false,
						//collapsible:false,
						collapsedContent: function(title){
							var region = $(this).panel('options').region;
							if (region == 'north' || region == 'west'){
								return title;
							} else {
								return '<div class="panel-title layout-expand-title-down">条件</ div>';
							}
						},
						border:false,
						split: true,
						onCollapse:function(){
							qwlayout.find('.layout-expand-south').find('.panel-header').css({'border-bottom':0,'border-right':0,'border-left':0});
							qwlayout.find('.layout-expand-south').find('.panel-body').css({'border-bottom':0,'border-left':0,'border-right':0});
						}
					}).layout('add',{    
						region: 'west',    
						width: 250,
						maxWidth: '50%',
						minWidth: 250,
						title: '数据库表',
						iconCls:'icon-GroupImport',
						hideExpandTool:false,
						hideCollapsedContent:false,
						collapsedContent: function(title){
							var region = $(this).panel('options').region;
							if (region == 'north' || region == 'south'){
								return title;
							} else {
								return '<div class="panel-title layout-expand-title layout-expand-title-down">数据库表</ div>';
							}
						},
						border:false, 
						//collapsible:false,
						split: true,
						onCollapse:function(){
							qwlayout.find('.layout-expand-west').find('.panel-header').css({'border-top':0,'border-left':0});
							qwlayout.find('.layout-expand-west').find('.panel-body').css({'border-top':0,'border-left':0,'border-bottom':0});
						}
					}); 
					qwlayout.layout('panel', 'west').panel('header').css({'height':18});
					qwlayout.layout('panel', 'west').append(tables);
					
					tables.datagrid({
						columns:[[    
							{field:'id',title:'表名',width:200,editor:{'type':'validatebox', 'options':{'required':true,'validType':'SQLCheck'}}},    
							{field:'alias',title:'别名',width:100,editor:{'type':'validatebox', 'options':{'required':true,'validType':'SQLCheck'}}}  
						]],
						data: result.tables,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:true,
						striped:true,
						border:false,
						lastinsertRow:false,
						toolbar:tablestoolbar,
						onLoadSuccess:function(data){
							var d = $(this);
							setTimeout(function(){
								d.datagrid('resize');
							}, 0);
						}
					});
					
					tablesadd.combogrid({
					//tablesadd.droplist({
						//style:"QueryWizardTablesBrowse",
						columns:[[    
							{field:'id',title:'表名',width:100}
						]],
						idField:"id",
						textField:"id",
						//rownumbers:true,
						panelWidth:250,
						fitColumns:true,
						url:'server/SimpChinese/querywizard/table/',
						prompt:'选择数据库表',
						width:100,
						onChange:function(newValue,oldValue){
							var tc = $(this);
							tc.combogrid('hidePanel');
							if(newValue != ''){
								tables.datagrid('appendRow',{
									id:newValue,
									alias:newValue,
								});
								tables.datagrid('selectRow', tables.datagrid('getData').total-1);
								tables.datagrid('editkeyboard', {index:tables.datagrid('getData').total-1, field: 'alias'});
								ebx.setEditstatus(_tab, true);
							}
						}
					});
					tablesdel.linkbutton({
						text:'删除',
						iconCls:'icon-CellsDelete',
						plain:true,
						onClick:function(){
							var index = tables.datagrid('getRowIndex', tables.datagrid('getSelected'));
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
									tables.datagrid('deleteRow', index);

									if(index >= tables.datagrid('getData').total && index > 0) index--;
									
									if(tables.datagrid('getData').total == 0 || index < 0){
										tables.datagrid('load', {total: 0, rows: []}); 
									}else{
										tables.datagrid('selectRow', index);
									}
									
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					tablesclear.linkbutton({
						text:'清空',
						iconCls:'icon-TableDelete',
						plain:true,
						onClick:function(){
							$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
								if (r){
									tables.datagrid('loadData', {total: 0, rows: []});
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					qwlayout.layout('panel', 'center').append(tabs);
					
					tabs.tabs({  
						border:false,
						width:'100%',
						height:'100%',
						plain:false,
						tabPosition:'top',
						onSelect:function(title){    

						}    
					});
					tabs.tabs('add', {
						title:'列',    
						content:columns,    
						closable:false,
						iconCls:'icon-PivotFieldList'
					}).tabs('add', {
						title:'关系',    
						content:relates,    
						closable:false,
						iconCls:'icon-AdpDiagramRelationships'
					}).tabs('select', 0);
					
					columns.datagrid({
						columns:[[
							{field:'datatype',title:'类型',width:80,editor:{
								"type":"combogrid",
								"options":{
									columns:[[    
										{field:'datatype',title:'数据类型',width:200}
									]],
									hasDownArrow:false,//隐藏右边得下箭头
									idField:"datatype",
									textField:"datatype",
									panelHeight:'auto',
									showHeader:false,
						            editable:false,
									data: [{
										datatype: 'string'
									},{
										datatype: 'numeric'
									},{
										datatype: 'date'
									}]
								}
							}},
							{field:'alias',title:'别名',width:100,editor:{'type':'validatebox', 'options':{'required':true,'validType':'SQLCheck'}}},    
							{field:'column',title:'字段',width:300,editor:{'type':'validatebox', 'options':{'required':true,'validType':'SQLCheck'}}},    
							{field:'statistic',title:'统计',width:50,editor:{'type':'validatebox', 'options':{'validType':'SQLCheck'}},hidden:false}, 
							{field:'datasource',title:'可选的数据源',width:150,editor:{'type':'validatebox', 'options':{'validType':'SQLCheck'}},hidden:false}, 
							{field:'memo',title:'备注',width:150,editor:'text'}
						]],
						data: result.columns,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:false,
						striped:true,
						border:false,
						toolbar:columnstoolbar,
						onLoadSuccess:function(data){
							var d = $(this);
							setTimeout(function(){
								d.datagrid('resize');
							}, 0);
						}
					});
					
					columnsadd.linkbutton({
						text:'添加',
						iconCls:'icon-CellsInsertDialog',
						plain:true,
						onClick:function(){
							var title = colcolumns.combogrid('getValue'),
								column = '[' + coltable.combogrid('getText') + '].[' + title + ']',
								datatype = '';
								
							for(var i in colcolumns.combogrid('grid').datagrid('getRows')){
								if(colcolumns.combogrid('grid').datagrid('getRows')[i].title === title){
									datatype = colcolumns.combogrid('grid').datagrid('getRows')[i].type;
								}
							}
							
							if(title != ''){
								columns.datagrid('appendRow', {
									datatype:datatype,
									alias:title,
									column:column
								});
								columns.datagrid('scrollTo', columns.datagrid('getData').total - 1);//滚动到新增的行
								columns.datagrid('selectRow', columns.datagrid('getData').total - 1);
								columns.datagrid('editkeyboard', {index: columns.datagrid('getData').total - 1, field: 'alias'}); //自动触发编辑第一个字段
							}else{
								columns.datagrid('appendRow', {
									column: coltable.combogrid('getText')==''?'':'[' + coltable.combogrid('getText') + '].'
								});
								columns.datagrid('scrollTo', columns.datagrid('getData').total - 1);//滚动到新增的行
								columns.datagrid('selectRow', columns.datagrid('getData').total - 1);
								columns.datagrid('editkeyboard', {index: columns.datagrid('getData').total - 1, field: 'datatype'}); //自动触发编辑第一个字段
							}
							ebx.setEditstatus(_tab, true);
						}
					});
					coltable.combogrid({
						columns:[[    
							{field:'id',title:'表名',width:200},    
							{field:'alias',title:'别名',width:100}  
						]],
						idField:"id",
						textField:"alias",
						//rownumbers:true,
						panelWidth:250,
						fitColumns:true,
						data:tables.datagrid('getData'),
						prompt:'选择数据库表',
						width:100,
						onChange:function(newValue,oldValue){
							$.ajax({
								type: 'post', 
								url: 'server/SimpChinese/querywizard/columns/',
								data:{tblName:newValue,_:(new Date()).getTime()},
								dataType: "json",
								success: function(result){
									if(result){
										colcolumns.combogrid('setValue', {});
										colcolumns.combogrid('grid').datagrid('loadData', result)
									}
								}
							});
						},
						onShowPanel:function(){
							$(this).combogrid('grid').datagrid('loadData', tables.datagrid('getData'));
						}
					});
					colcolumns.combogrid({
						columns:[[    
							{field:'title',title:'列名',width:100},    
							{field:'type',title:'类型',width:100}  
						]],
						idField:"title",
						textField:"title",
						panelWidth:250,
						fitColumns:true,
						prompt:'选择数据列',
						width:100,
						onChange1:function(newValue,oldValue){
							var title = colcolumns.combogrid('getValue'),
								column = '[' + coltable.combogrid('getText') + '].[' + title + ']',
								datatype = '';
							if(title == '')return;
							for(var i in colcolumns.combogrid('grid').datagrid('getRows')){
								if(colcolumns.combogrid('grid').datagrid('getRows')[i].title === title){
									datatype = colcolumns.combogrid('grid').datagrid('getRows')[i].type;
								}
							}
							
							columns.datagrid('appendRow', {
								datatype:datatype,
								alias:title,
								column:column
							});
							columns.datagrid('scrollTo', columns.datagrid('getData').total - 1);//滚动到新增的行
							columns.datagrid('selectRow', columns.datagrid('getData').total - 1);
							columns.datagrid('editkeyboard', {index: columns.datagrid('getData').total - 1, field: 'alias'}); //自动触发编辑第一个字段
							ebx.setEditstatus(_tab, true);
						}
					});

					columnsdel.linkbutton({
						text:'删除',
						iconCls:'icon-CellsDelete',
						plain:true,
						onClick:function(){
							var index = columns.datagrid('getRowIndex', columns.datagrid('getSelected'));
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
									columns.datagrid('deleteRow', index);

									if(index >= columns.datagrid('getData').total && index > 0) index--;
									
									if(columns.datagrid('getData').total == 0 || index < 0){
										columns.datagrid('load', { total: 0, rows: [] }); 
									}else{
										columns.datagrid('selectRow', index);
									}
									
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					columnsclear.linkbutton({
						text:'清空',
						iconCls:'icon-TableDelete',
						plain:true,
						onClick:function(){
							$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
								if (r){
									columns.datagrid('loadData', {total: 0, rows: []});
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					relates.datagrid({
						columns:[[    
							{field:'table',title:'表',width:100,editor:{
								"type":"combogrid",
								"options":{
									columns:[[    
										{field:'id',title:'表名',width:200},    
										{field:'alias',title:'别名',width:100}  
									]],
									hasDownArrow:false,//隐藏右边得下箭头
									idField:"alias",
									textField:"alias",
									panelWidth:250,
									fitColumns:true,
									onShowPanel:function(){
										$(this).combogrid('grid').datagrid('loadData', tables.datagrid('getData'));
									}
								}
							}},    
							{field:'column',title:'字段',width:100,editor:{
								"type":"combogrid",
								"options":{
									columns:[[    
										{field:'title',title:'列名',width:100},    
										{field:'type',title:'类型',width:100}  
									]],
									hasDownArrow:false,//隐藏右边得下箭头
									idField:"title",
									textField:"title",
									panelWidth:250,
									fitColumns:true,
									onShowPanel:function(){
										var grid = $(this).combogrid('grid'),
											row = relates.datagrid('getSelected'),
											tablesrows = tables.datagrid('getData').rows,
											table = '';

										for(var i in tablesrows){
											if(row.table == tablesrows[i].alias)table=tablesrows[i].id;
										}
										if(table != ''){
											$.ajax({
												type: 'post', 
												url: 'server/SimpChinese/querywizard/columns/',
												data:{tblName:table,_:(new Date()).getTime()},
												dataType: "json",
												success: function(result){
													if(result){
														grid.datagrid('loadData', result)
													}
												}
											});
										}
									}
								}
							}},    
							{field:'relate',title:'',width:20},    
							{field:'relatetable',title:'表',width:100,editor:{
								"type":"combogrid",
								"options":{
									columns:[[    
										{field:'id',title:'表名',width:200},    
										{field:'alias',title:'别名',width:100}  
									]],
									hasDownArrow:false,//隐藏右边得下箭头
									idField:"alias",
									textField:"alias",
									panelWidth:250,
									fitColumns:true,
									onShowPanel:function(){
										$(this).combogrid('grid').datagrid('loadData', tables.datagrid('getData'));
									}
								}
							}},    
							{field:'relatecolumn',title:'字段',width:100,editor:{
								"type":"combogrid",
								"options":{
									columns:[[    
										{field:'title',title:'列名',width:100}
									]],
									hasDownArrow:false,//隐藏右边得下箭头
									idField:"title",
									textField:"title",
									panelWidth:200,
									fitColumns:true,
									onShowPanel:function(){
										var grid = $(this).combogrid('grid'),
											row = relates.datagrid('getSelected'),
											tablesrows = tables.datagrid('getData').rows,
											table = '';

										for(var i in tablesrows){
											if(row.relatetable == tablesrows[i].alias)table=tablesrows[i].id;
										}
										if(table != ''){
											$.ajax({
												type: 'post', 
												url: 'server/SimpChinese/querywizard/columns/',
												data:{tblName:table,_:(new Date()).getTime()},
												dataType: "json",
												success: function(result){
													if(result){
														grid.datagrid('loadData', result)
													}
												}
											});
										}
									}
								}
							}}  
						]],
						data: result.relates,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:false,
						striped:true,
						border:false,
						toolbar:relatestoolbar,
						onLoadSuccess:function(data){
							var d = $(this);
							setTimeout(function(){
								d.datagrid('resize');
							}, 0);
						}
					});
					relatesadd.linkbutton({
						text:'添加',
						iconCls:'icon-CellsInsertDialog',
						plain:true,
						onClick:function(){
							relates.datagrid('appendRow', {relate:'='});
							relates.datagrid('scrollTo', relates.datagrid('getData').total - 1);//滚动到新增的行
							relates.datagrid('selectRow', relates.datagrid('getData').total - 1);
							relates.datagrid('editkeyboard', {index: relates.datagrid('getData').total - 1, field: 'table'}); //自动触发编辑第一个字段
							ebx.setEditstatus(_tab, true);
						}
					});
					relatesdel.linkbutton({
						text:'删除',
						iconCls:'icon-CellsDelete',
						plain:true,
						onClick:function(){
							var index = relates.datagrid('getRowIndex', relates.datagrid('getSelected'));
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
									relates.datagrid('deleteRow', index);

									if(index >= relates.datagrid('getData').total && index > 0) index--;
									
									if(relates.datagrid('getData').total == 0 || index < 0){
										relates.datagrid('load', { total: 0, rows: [] }); 
									}else{
										relates.datagrid('selectRow', index);
									}
									
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					relatesclear.linkbutton({
						text:'清空',
						iconCls:'icon-TableDelete',
						plain:true,
						onClick:function(){
							$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
								if (r){
									relates.datagrid('loadData', {total: 0, rows: []});
									ebx.setEditstatus(_tab, true);
								}
							});
						}
					});
					var southpanel = qwlayout.layout('panel', 'south'),
						southopt = southpanel.panel('options');
					
					southpanel.append(filter);
					
					filter.textbox({
						width: '100%',
						height: '100%',
						value: result.filter,
						multiline:true,
						cls:'querywizardfilter',
						validType:'SQLCheck',
						onChange: function(newValue, oldValue){
							ebx.setEditstatus(_tab, true);
						}
					});
					filter.parent().find('span').css({
						'background':'transparent',
						'border-style':'none',
						'border-radius':0
					});
					filter.parent().find('textarea').css({
						'font-family':'微软雅黑',
						'background':'transparent'
					}).attr('spellcheck',false);
				}
				if(callback1)callback1(_centerstorage);
			}
		});
	},
	_save:function(asSave, _layout, _Paramet, _tab, bdx, callback){//保存方法，参数：asSave：是否另存，1为另存，_layout：单据页面的layout对象，_Paramet：参数数组，_tab：tabs的tab对象用来标识编辑状态，bdx：全局对象，callback回到函数
		var tables = _layout.layout('panel', 'center').find('.layout').layout('panel', 'west').find('.datagrid-f').datagrid('getData'),
			columns = _layout.layout('panel', 'center').find('.layout').layout('panel', 'center').find('.tabs-container').tabs('getTab', 0).find('.datagrid-f').datagrid('getData'),
			relates = _layout.layout('panel', 'center').find('.layout').layout('panel', 'center').find('.tabs-container').tabs('getTab', 1).find('.datagrid-f').datagrid('getData'),
			filter = _layout.layout('panel', 'center').find('.querywizardfilter').parent().parent().find('.textbox-f'),
			bd = ebx.convertDicToJson(_layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData')),
			ParentID = asSave?_Paramet.id:0,
			savetext = asSave?'另存':'保存',
			parameter = {tables: ebx.convertDicToJson(tables), columns: ebx.convertDicToJson(columns), relates: ebx.convertDicToJson(relates), filter: filter.val(), bd: bd, _: (new Date()).getTime(), id: _Paramet.id, parentid: ParentID};

		if(tables.total == 0){
			$.messager.alert('错误', savetext + '失败！数据库表不能为空。', 'error');
			callback(false);
			return;
		}
		
		if(columns.total == 0){
			$.messager.alert('错误', savetext + '失败！列不能为空。', 'error');
			callback(false);
			return;
		}
		
		if(!ebx.checkedBDvalidatebox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callback(false);
			return;
		}

		if(!filter.textbox('isValid')){//校验条件输入框的sql语法是否符合规定
			$.messager.alert('错误', savetext + '失败！<br>“条件”中录入的SQL语句有误。', 'error', function(){
				filter.textbox('textbox').focus();
			});
			callback(false);
			return;
		}
		$.messager.progress({title:'正在保存...',text:''}); 
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + _Paramet.modedit + '/save/',
			data: parameter,
			dataType: "json",
			success: function(result){
				$.messager.progress('close');
				if(result.result){
					$.messager.show({
						title: '提示',
						msg: savetext + '成功！',
						timeout: 3000,
						showType: 'slide'
					});	
					ebx.setEditstatus(_tab, false);
					bdx.ID = result.id;
					
					//_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:bdx.ID, _:(new Date()).getTime(), page:1, rows: ebx.pagesize});
					//bdx.init('center');
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:bdx.ID, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', savetext + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callback(true)
			}
		});
	},
	_east: function(callback){//单据属性对象
		var _eaststorage = this.eaststorage,
			_tabs = this.tabs;
		
		_eaststorage.propertygrid({
			url: 'server/SimpChinese/'+this.Paramet.modedit+'/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.Paramet.id},
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
					deleted = ebx.getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
					
				if(undeleted)undeleted.linkbutton('disable');
				if(deleted)deleted.linkbutton('disable');
					
				for(var i in data.rows){
					if(data.rows[i].field == '_isdeleted'){//处理删除显示
						if(ebx.validInt(data.rows[i].value) == 0){
							if(undeleted)undeleted.linkbutton('disable');
							if(deleted)deleted.linkbutton('enable');
						}else{
							if(deleted)deleted.linkbutton('disable');
							if(undeleted)undeleted.linkbutton('enable');
						}
					}
				}
				if(callback)callback(data, _eaststorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
			}
		}).datagrid('renderformatterstyler');//启用显示式样回调函数
	},
	_north: function (callback){//单据表头按钮对象 2018-7-9 zz
		var bd = this,
			_layout = this.layout,
			_eastPanel = this.eastPanel,
			_Paramet = this.Paramet,
			_tabs = this.tabs,
			_tab = this.tab,
			_biribbon = this.biribbon,
			_centerstorage = this.centerstorage,
			_save = this._save,
			_ID = this.ID,
			_showLock = this.showLock,
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
											_save(1, _layout, _Paramet, _tab, bd, function(){ });
										}
									});
								}
							}],
							onClick: function(){
								var lockbtn = ebx.getbiribbonobj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn && _showLock == 1){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this);
								saveBtn.linkbutton('disable');
								_save(0, _layout, _Paramet, _tab, bd, function(result){
									if(result){
										if(lockbtn){
											lockbtn.find('.l-btn-icon').removeClass('icon-unLock-large').addClass('icon-Lock-large');
											lockbtn.linkbutton('unselect');
										}
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
										_Paramet: _Paramet,
										browsertype: 'bd',
										_tabs: _tabs,
										_layout: _layout
									}; 
									ebx.browser._new(options);
								}
							},{
								name:'deleted',
								text:'删除',
								iconCls:'icon-Delete',
								disable:true,
								onClick:function(){
									var btn = $(this),
										undeleted = ebx.getbiribbonobj(_biribbon, 'undeleted', 'linkbutton'),
										_eaststorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._deleted(_ID, _Paramet.modedit, function(result){
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
											_eaststorage.propertygrid('reload');
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
										deleted = ebx.getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
										_eaststorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._undeleted(_ID, _Paramet.modedit, function(result){
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
											_eaststorage.propertygrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '恢复失败！<br>' + JSON.stringify(result.msg), 'error');
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
								var tables = _layout.layout('panel', 'center').find('.layout').layout('panel', 'west').find('.datagrid-f').datagrid('getRows'),
									columns = _layout.layout('panel', 'center').find('.layout').layout('panel', 'center').find('.tabs-container').tabs('getTab', 0).find('.datagrid-f').datagrid('getRows'),
									relates = _layout.layout('panel', 'center').find('.layout').layout('panel', 'center').find('.tabs-container').tabs('getTab', 1).find('.datagrid-f').datagrid('getRows'),
									filter = _layout.layout('panel', 'center').find('.layout').layout('panel', 'south').find('textarea').val(),
									sql = 'select \n',
									group  = '',
									groupcount = 0;
									
								
								for(var i in columns){
									sql += columns[i].column + ' as ' + columns[i].alias + ',\n';
									if(ebx.validInt(columns[i].statistic) == 0){
										group += columns[i].column + ',\n';
									}else{
										groupcount++;
									}
								}
								sql = sql.substr(0, sql.length - 2);
								sql += ' \n\nfrom \n';
								
								if(group != ''){
									group = ' \n\ngroup by \n' + group.substr(0, group.length - 2);
								}
								
								for(var i in tables){
									sql += tables[i].id + ' ' + tables[i].alias + ',\n';
								}
								sql = sql.substr(0, sql.length - 2);
								
								if(filter != '' || relates.length >0){
									sql += ' \n\nwhere \n';
								}
								
								for(var i in relates){
									sql += relates[i].table + '.' + relates[i].column + relates[i].relate + relates[i].relatetable + '.' + relates[i].relatecolumn + ' and \n'
								}
								if(filter == '')sql = sql.substr(0, sql.length - 5);
								sql += filter;
								if(groupcount > 0)sql += group;
								ebx.clipboardString(sql);
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
					},{
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
					}]
				}]
			};
			
		if(callback)callback(data);//回掉函数处理功能按钮的添加删除；
		
		_biribbon.ribbon({
			data:data,
			width:'100%',
			height:'100%',
			border: false,
			plain:true,
			showHeader: false
		});

		if(this.showLock == 0){
			var lockgroup = ebx.getbiribbonobj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
	}
}
