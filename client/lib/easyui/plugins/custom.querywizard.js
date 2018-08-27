/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/27
查询设计客户都安对象，包括单据的表头、表体，功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/

ebx.qw = {
	ID: 0,
	billtype: 0,
	ParentID: 0,
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
	showSearchserial: 0,//是否显示串号扫描框
	init: function(layoutName, callback, callback1){//单据初始化函数。参数：layoutName：初始化区域名称，包括：default，center，east，north，callback：回掉函数，datagrid装载前执行，callback1：回掉函数，datagrid装载后执行
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Paramet = ebx.getMenuParameter(this.tabs);
		this.ID = ebx.validInt(this.Paramet.id);
		
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
			href: 'client/SimpChinese/' + this.Paramet.mode + '/center.html',
			//hideExpandTool: false,
			//hideCollapsedContent: false,
			border: false,
			split: true
		}).layout('add',{
			region: 'east',
			width: 400,
			maxWidth: '50%',
			minWidth: 400,
			//title: '基本信息',
			href: 'client/SimpChinese/' + this.Paramet.mode + '/east.html',
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
			href: 'client/SimpChinese/' + this.Paramet.mode + '/north.html',
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
			_Paramet = this.Paramet;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/'+_Paramet.mode+'/center/',
			data: {id:_Paramet.id+'list',_:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					var qwlayout = $('<div>').appendTo(_centerPanel),
						tables = $('<div>'),
						columns = $('<div>'),
						relates = $('<div>'),
						filter = $('<div>'),
						tabs = $('<div>');
					
					qwlayout.layout({
						width:'100%',
						height:'100%'
					});    
					// collapse the west panel    

					qwlayout.layout('add',{    
						region: 'center',
						border:false,
					}).layout('add',{    
						region: 'south',    
						height: 150,
						maxHeight: '50%',
						minHeight: 100,
						title: '筛选条件设置', 
						collapsible:false,
						border:false,
						split: true
					}).layout('add',{    
						region: 'west',    
						width: 250,
						maxWidth: '50%',
						minWidth: 200,
						//title: 'tables', 
						border:false,
						split: true
					}); 
					
					qwlayout.layout('panel', 'west').append(tables);
					
					tables.datagrid({
						columns:[[    
							{field:'id',title:'表',width:200},    
							{field:'alias',title:'别名',width:100}  
						]],
						data: result.tables,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:true,
						border:false
					})
					
					qwlayout.layout('panel', 'center').append(tabs);
					
					tabs.tabs({  
						border:false,
						width:'100%',
						height:'100%',
						plain:true,
						tabPosition:'bottom',
						onSelect:function(title){    

						}    
					});
					tabs.tabs('add', {
						title:'列设置',    
						content:columns,    
						closable:false
					}).tabs('add', {
						title:'关系设置',    
						content:relates,    
						closable:false
					}).tabs('select', 0);
					
					columns.datagrid({
						columns:[[
							{field:'datatype',title:'类型',width:80},    
							{field:'alias',title:'别名',width:100},    
							{field:'column',title:'字段',width:300},    
							{field:'statistic',title:'统计',width:50}, 
							{field:'datasource',title:'可选的数据源',width:150}, 
							{field:'memo',title:'备注',width:150}
						]],
						data: result.columns,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:false,
						border:false
					})
					
					relates.datagrid({
						columns:[[    
							{field:'table',title:'表',width:100},    
							{field:'column',title:'字段',width:100},    
							{field:'relate',title:'',width:20},    
							{field:'relatetable',title:'表',width:100},    
							{field:'relatecolumn',title:'字段',width:100}  
						]],
						data: result.relates,
						width:'100%',
						height:'100%',
						rownumbers:true,
						singleSelect:true,
						fitColumns:false,
						border:false
					});
					
					qwlayout.layout('panel', 'south').append(filter);
					filter.text(result.filter).css({'padding':5});
				}
				if(callback1)callback1(_centerstorage);
			}
		});
	},
	_save:function(asSave, _layout, _Paramet, _tab, bdx, callback){//保存方法，参数：asSave：是否另存，1为另存，_layout：单据页面的layout对象，_Paramet：参数数组，_tab：tabs的tab对象用来标识编辑状态，bdx：单据全局对象，callback回到函数
		var listgrid = _layout.layout('panel', 'center').find('.datagrid-f'),
			bdlistdata = listgrid.datagrid('getData').firstRows,
			by = function(name){
				return function(o, p){
					var a, b;
					if (typeof o === "object" && typeof p === "object" && o && p) {
						a = ebx.validInt(o[name]);
						b = ebx.validInt(p[name]);
						if (a === b) {
							return 0;
						}
						if (typeof a === typeof b) {
							return a < b ? -1 : 1;
						}
						return typeof a < typeof b ? -1 : 1;
					}
					else {
						throw ("error");
					}
				}
			};
		bdlistdata.sort(by('serial'));//保存前按serial字段由小到大排序处理
		
		var bdlist = {total: bdlistdata.length, rows: bdlistdata},
			bd = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
			columns = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('options').columns,
			bdliststr =  ebx.convertDicToJson(bdlist),
			bdstr = ebx.convertDicToJson(bd),
			columnsstr = ebx.convertDicToJson(columns),
			ParentID = asSave?_Paramet.id:0,
			savetext = asSave?'另存':'保存',
			parameter = {bd: bdstr, bdlist: bdliststr, columns:columnsstr, _: (new Date()).getTime(), id: _Paramet.id, parentid: ParentID};

		if(bdlist.total == 0){
			$.messager.show({
				title: '错误',
				msg: savetext + '失败！表格不能为空。',
				timeout: 3000,
				showType: 'slide'
			});	
			callback();
			//saveBtn.linkbutton('enable');
			return;
		}
		
		if(!ebx.checkedBDvalidatebox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callback();
			//saveBtn.linkbutton('enable');
			return;
		}
		$.messager.progress({title:'正在保存...',text:''}); 
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + _Paramet.mode + '/save/',
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
					
					_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:bdx.ID, _:(new Date()).getTime(), page:1, rows: ebx.pagesize});
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:bdx.ID, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', savetext + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callback()
			}
		});
	},
	_east: function(callback){//单据属性对象
		var _eaststorage = this.eaststorage,
			_tabs = this.tabs;
		
		_eaststorage.propertygrid({
			url: 'server/SimpChinese/'+this.Paramet.mode+'/load/',
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
					deleted = ebx.browser._getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.browser._getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
					
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
								var lockbtn = ebx.browser._getbiribbonobj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this);
								saveBtn.linkbutton('disable');
								_save(0, _layout, _Paramet, _tab, bd, function(){
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
										undeleted = ebx.browser._getbiribbonobj(_biribbon, 'undeleted', 'linkbutton'),
										_eaststorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._deleted(_ID, _Paramet.mode, function(result){
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
										deleted = ebx.browser._getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
										_eaststorage = _tabs.find('.layout').layout('panel', 'east').find('.datagrid-f');
										
									ebx.browser._undeleted(_ID, _Paramet.mode, function(result){
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
							size:'large'
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
	}
}
