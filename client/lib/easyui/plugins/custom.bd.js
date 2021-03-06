/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/16
单据对象，包括单据的表头、表体，功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/

ebx.bd = {
	id: 0,
	billType: 0,
	ParentId: 0,
	tabs: [],
	tab: [],
	layout: [],
	northPanel: [],
	eastPanel: [],
	centerPanel: [],
	parament: {},
	biribbon: [],
	centerStorage: [],
	discount: 1,//整单折扣
	eastStorage: [],
	showAudit: 0,//是否显示审核bombobox
	showPrint: 0,//是否显示打印group
	showLock: 0,//是否显示安全group
	showSearchSerial: 0,//是否显示串号扫描框
	init: function(callBack){//单据初始化函数。callBack：回掉函数对象
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.parament = ebx.getMenuparamenter(this.tabs);
		this.id = ebx.validInt(this.parament.id);
		this.layout = $('<div>').appendTo(this.tabs);
		
		if(ebx.validInt(this.parament.lock) == 1){
			this.showLock = 1;
		}
		
		this._default();

		this.northPanel = this.layout.layout('panel', 'north');
		this.eastPanel = this.layout.layout('panel', 'east');
		this.centerPanel = this.layout.layout('panel', 'center');
		
		this.biribbon = $('<div>').appendTo(this.northPanel);
		this.eastStorage = $('<div>').appendTo(this.eastPanel);
		this.centerStorage = $('<div>').appendTo(this.centerPanel);
		
		this._north(callBack.north);
		this._east(callBack.east);
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
			_centerStorage = this.centerStorage,
			_parament = this.parament,
			toolbar = $('<div>'),
			serialScan = $('<div>').appendTo(toolbar),
			newBtn = $('<div>').appendTo(toolbar),
			negativeBtn = $('<div>').appendTo(toolbar),
			_tabs = this.tabs,
			_tab = this.tab,
			_showSearchSerial = this.showSearchSerial;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/DataProvider/style/',
			data: {style:_parament.modedit+'list',_:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					columnsData = [result.data];
					ebx.setListVies(columnsData[0]);
					if(callBack)callBack(columnsData, _centerStorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
					_centerStorage.datagrid({
						view:scrollview,
						pageSize:ebx.pageSize,
						remoteSort:false,
						rownumbers:true,
						singleSelect:true,
						pagination:false,
						border:false,
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
						showHeader:result.bd[0].header,
						toolbar: toolbar,
						onLoadSuccess:function(data){
							ebx.sumFooter(result.bd[0].footer, _centerStorage);//渲染表尾合计
						},
						onEndEdit: function(index, row, changes){
							ebx.sumFooter(result.bd[0].footer, _centerStorage);//编辑结束后渲染表尾合计
						}
					}).datagrid('renderformatterstyler')
					if(callBack1)callBack1(_centerStorage);
					serialScan.searchbox({
						prompt:'搜索串号或条码添加产品',
						width:160,
						searcher: function(index){
							var textbox = $(this),
								v = textbox.textbox('getValue');
							if(v.length == 0)return;
							ebx.productSerial.SerialtoProduct(textbox, _centerStorage, bd.tab)
							
						}
					});
					newBtn.linkbutton({
						text:'添加产品',
						iconCls: 'icon-CellsInsertDialog',
						plain:true,
						onClick: function(){
							var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
								opts = listdatagrid.datagrid('options'),
								fields = listdatagrid.datagrid('options').columns[0],
								field = fields[0].field;
							
							opts.editIndex = listdatagrid.datagrid('getData').total;
							listdatagrid.datagrid('appendRow',{});
							listdatagrid.datagrid('scrollTo', listdatagrid.datagrid('getData').total - 1);//滚动到新增的行
							listdatagrid.datagrid('selectRow', listdatagrid.datagrid('getData').total - 1);
							
							for(var i in fields){
								if(fields[i].editor && !fields[i].hidden){
									field = fields[i].field;
									break;
								}
							}

							listdatagrid.datagrid('editkeyboard', {index: listdatagrid.datagrid('getData').total - 1, field: field}); //自动触发编辑第一个字段
							
							ebx.setEditStatus(_tab, true);
							//listdatagrid.datagrid('reload');
						}
					});
					negativeBtn.linkbutton({
						text:'+/-',
						plain:true,
						onClick: function(){
							var gird = _layout.layout('panel', 'center').find('.datagrid-f'),
								data = (function(){
									var d = gird.datagrid('getData');
									if(d.firstRows){
										return d.firstRows;
									}else{
										return d.rows;
									}
								})();
							
							for(var i in data){
								data[i].quantity *= -1;
								data[i].amount *= -1;
								data[i].famount *= -1;
								data[i].taxAmount *= -1;
								data[i].auditamount *= -1;
							}
							gird.datagrid('loadData', {total:data.length,rows:data});
							ebx.setEditStatus(_tab, true)
						}
					}).addClass('browser-functionbtn');
					if(ebx.validInt(_showSearchSerial) == 0 || ebx.listView.productSerial == 0)_layout.layout('panel', 'center').find('.datagrid-toolbar').remove();
				}
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
	_save:function(asSave, _layout, _parament, _tab, bdx, callBack){//保存方法，参数：asSave：是否另存，1为另存，_layout：单据页面的layout对象，_parament：参数数组，_tab：tabs的tab对象用来标识编辑状态，bdx：单据全局对象，callBack回到函数
		var listGrid = _layout.layout('panel', 'center').find('.datagrid-f'),
			bdListData = listGrid.datagrid('getData').firstRows,
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
		
		var bdList = {total: bdListData.length, rows: bdListData},
			bd = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
			columns = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('options').columns,
			bdListStr =  ebx.convertDicToJson(bdList),
			bdStr = ebx.convertDicToJson(bd),
			columnsStr = ebx.convertDicToJson(columns),
			ParentId = asSave?_parament.id:0,
			saveText = asSave?'另存':'保存',
			paramenter = {bd: bdStr, bdList: bdListStr, columns:columnsStr, _: (new Date()).getTime(), id: _parament.id, parentid: ParentId};

		if(ebx.validInt(bdList.total) == 0){
			$.messager.show({
				title: '错误',
				msg: saveText + '失败！表格不能为空。',
				timeout: 3000,
				showType: 'slide'
			});	
			callBack();
			//saveBtn.linkbutton('enable');
			return;
		}
		if(!ebx.checkedBdValidateBox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callBack();
			//saveBtn.linkbutton('enable');
			return;
		}
		bdListData.sort(by('serial'));//保存前按serial字段由小到大排序处理
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
					
					_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:bdx.id, _:(new Date()).getTime(), page:1, rows: ebx.pageSize});
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:bdx.id, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', saveText + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callBack()
			}
		});
	},
	_east: function(callBack){//单据属性对象
		var _eastStorage = this.eastStorage,
			_tabs = this.tabs;
		
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
			}
		}).datagrid('renderformatterstyler');//启用显示式样回调函数
	},
	_north: function (callBack){//单据表头按钮对象 2018-7-9 zz
		var bd = this,
			_layout = this.layout,
			_eastPanel = this.eastPanel,
			_showLock = this.showLock,
			_parament = this.parament,
			_tabs = this.tabs,
			_tab = this.tab,
			_biribbon = this.biribbon,
			_centerStorage = this.centerStorage,
			_save = this._save,
			_ID = this.id,
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
							},{
								name:'saveas',
								text:'红冲另存',
								iconCls:'icon-GroupTableOfAuthorities',
								onClick: function(){
									$.messager.confirm('提示', '是否需要红冲另存？', function(r){
										if (r){
											var gird = _layout.layout('panel', 'center').find('.datagrid-f'),
												data = (function(){
													var d = gird.datagrid('getData');
													if(d.firstRows){
														return d.firstRows;
													}else{
														return d.rows;
													}
												})();
											
											for(var i in data){
												data[i].quantity *= -1;
												data[i].amount *= -1;
												data[i].famount *= -1;
												data[i].taxAmount *= -1;
												data[i].auditamount *= -1;
											}
											gird.datagrid('loadData', {total:data.length,rows:data});
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
									if(lockbtn && _showLock == 1){
										lockbtn.find('.l-btn-icon').removeClass('icon-unLock-large').addClass('icon-Lock-large');
										lockbtn.linkbutton('unselect');
									}
									saveBtn.linkbutton('enable');
								});
							}
						},{
							type:'splitbutton',
							name:'audit',
							text:'审核',
							iconCls:'icon-OutlookTaskCreate-large',
							iconAlign:'top',
							size:'large',
							menuItems:[{
								name:'saveas',
								text:'保存并审核',
								iconCls:'icon-OutlookTaskCreateSave',
								onClick: function(){
									//console.log(_layout)
								}
							}]
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
						title:'打印',
						name:'printgroup',
						dir:'v',
						tools:[{
							name:'print',
							text:'快速打印',
							iconCls:'icon-PrintDialogAccess',
							onClick:function(){
								bd.print.init(
								    bd.id,
									_parament.modedit,
									_tabs.find('.layout').layout('panel', 'center').find('.datagrid-f').datagrid('getRows')
								);
								bd.print.print();
							}
						},{
							text:'打印预览',
							iconCls:'icon-ViewsAdpDiagramPrintPreview',
							onClick: function(){
								bd.print.init(
								    bd.id,
									_parament.modedit,
									_tabs.find('.layout').layout('panel', 'center').find('.datagrid-f').datagrid('getRows')
								);
								bd.print.preview();
							}
						},{
							text:'打印设置',
							iconCls:'icon-PrintOptionsMenu',
							onClick: function(){
								bd.print.setup();
							}
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
								var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
									opts = listdatagrid.datagrid('options'),
									fields = listdatagrid.datagrid('options').columns[0],
									field = fields[0].field;
								
								opts.editIndex = listdatagrid.datagrid('getData').total;
								listdatagrid.datagrid('appendRow',{});
								listdatagrid.datagrid('scrollTo', listdatagrid.datagrid('getData').total - 1);//滚动到新增的行
								listdatagrid.datagrid('selectRow', listdatagrid.datagrid('getData').total - 1);
								
								for(var i in fields){
									if(fields[i].editor && !fields[i].hidden){
										field = fields[i].field;
										break;
									}
								}

								listdatagrid.datagrid('editkeyboard', {index: listdatagrid.datagrid('getData').total - 1, field: field}); //自动触发编辑第一个字段
								
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

											if(index >= listdatagrid.datagrid('getRows').length && index > 0) index--;
											
											if(listdatagrid.datagrid('getRows').length == 0 || index < 0){
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
							type:'splitbutton',
							name:'paste',
							text:'粘贴',
							iconCls:'icon-Paste-large',
							iconAlign:'top',
							disabled: ebx.copyData?false:true,
							size:'large',
							onClick:function(){
								ebx.paste(_layout.layout('panel', 'center').find('.datagrid-f'), _tab)
							},
							menuItems:[{
								name:'reomveCopyData',
								text:'清除内容',
								iconCls:'icon-Delete',
								onClick: function(){
									ebx.reomveCopyData();
								}
							}]
						},{
							name:'copy',
							text:'复制',
							iconCls:'icon-Copy-large',
							size:'large',
							iconAlign:'top',
							onClick:function(){
								ebx.copy(_layout.layout('panel', 'center').find('.datagrid-f'));
							}
						},{
							type:'toolbar',
							dir:'v',
							tools:[{
								name:'cut',
								text:'剪切',
								iconCls:'icon-edit-cut',
								onClick:function(){
									ebx.cut(_layout.layout('panel', 'center').find('.datagrid-f'));
								}
							},{
								name:'ImportExcel',
								text:'导出',
								iconCls:'icon-ImportExcel',
								onClick:function(){
									var columns = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('options').columns,
										data =  _layout.layout('panel', 'center').find('.datagrid-f').datagrid('getData');
									ebx.clipBoardData(columns, data);
								}
							},{
								type:'splitbutton',
								name:'ExportExcel',
								text:'导入',
								iconCls:'icon-ExportExcel',
								menuItems:[{
									name:'FileSaveAsExcelXlsx',
									text: '导入模板',
									iconCls:'icon-FileSaveAsExcelXlsx',
									onclick:function(){
										var columns = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('options').columns;
										ebx.importTemplate(columns, _parament.text);
									}
								}],
								onClick: function(){
									bd._export($(this), _layout, _tab);
								}
							}]
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
						title:'附件',
						tools:[{
							type:'toolbar',
							dir:'v',
							tools:[{
								//text:'',
								iconCls:'icon-AttachFile-large',
								//iconAlign:'top',
								size:'large',
								onClick: function(){
									if(ebx.validInt(bd.id) == 0){
										$.messager.show({
											title: '提示',
											msg: '请先保存 ' + _parament.text + '！',
											timeout: 3000,
											showType: 'slide'
										});
										return;
									}
									var win = $('<div>').appendTo('body'),
										filegrId = $('<div>').appendTo(win),
										toolbar = $('<div>'),
										uploadForm = $('<form enctype="multipart/form-data" method="post">').appendTo(toolbar),
										fileUpLoad = $('<input name="file">').appendTo(uploadForm),
										delBtn = $('<div>').appendTo(uploadForm),
										downBtn = $('<div>').appendTo(uploadForm);
									
									win.window({
										title: '附件',
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
										onClose: function(){
											var Attach = ebx.getBiribbonObj(_biribbon, '附件', 'toolbar');
											bd.getAttachCount(bd.id, bd.billType, Attach)
										}
									});
									$('body').find('.window-mask').on('click', function(){
										win.window('close');
									}); 
									filegrId.datagrid({
										//view:scrollview,
										//pageSize:ebx.pageSize,
										url:'/server/SimpChinese/attaches/list/',
										queryParams:{
											id:bd.id,
											billType:bd.billType,
											_:(new Date()).getTime()
										},
										columns:[[    
											{field:'filename',title:'文件名',width:300},
											{field:'uploaddate',title:'上传时间',width:150},
											{field:'size',title:'大小',width:100,
												styler: function(value,row,index){
													return 'text-align:right;';
												}
											}
										]],
										toolbar: toolbar,
										border: false,
										height:'100%',
										width:'100%',
										rownumbers:true,
										singleSelect:true,
										striped:true,
										//ctrlSelect:true,
										fitColumns:true,
										onClickCell:function(){},//阻止自定义keyboar控件影响双击事件
										onDblClickRow: function(index, row){
											window.open(window.location.protocol +'//'+ window.location.host + ':' + window.location.port + '/attaches/' + bd.billType + '/' + bd.id + '/' + row.filename);
										},
										onRowContextMenu: function(e, rowIndex, rowData){
											if(rowIndex < 0)return;
											d = $(this);
											d.datagrid('selectRow', rowIndex)
											e.preventDefault();
											var RowContextMenu = $('<div>');
											RowContextMenu.menu({
												width:100
											}).menu('appendItem', {
												text: '下载',
												iconCls: 'icon-arrow-down',
												disable:true,
												onclick:function(){
													window.open(window.location.protocol +'//'+ window.location.host + '/attaches/' + bd.billType + '/' + bd.id + '/' + rowData.filename);
												}
											}).menu('appendItem', {
												text: '删除',
												iconCls: 'icon-Delete',
												disabled:rowData.auditid?true:(rowData.isDeleted?true:false),
												onclick: function(){
													$.messager.confirm('确认对话框', '您想要删除吗？删除操作后数据将无法恢复。', function(r){
														if (r){
															$.messager.progress({title:'正在删除...',text:''}); 
															$.ajax({
																type: 'GET', 
																url: 'server/SimpChinese/Attaches/del/',
																data: {
																	filename: escape(rowData.filename),
																	id:bd.id,
																	billType:bd.billType,
																	_:(new Date()).getTime()
																},//style名称必须和mode相吻合
																dataType: "json",
																success: function(result){
																	$.messager.progress('close');
																	if(result){
																	$.messager.show({
																		title: '成功',
																		msg: '文件：' + rowData.filename + ' 删除成功！',
																		timeout: 3000,
																		showType: 'slide'
																	});
																	filegrId.datagrid('load');
																	}
																}
															});
														}
													});
												}
											}).menu('show', {
												left: e.pageX,
												top: e.pageY
											});
										}
									})
									fileUpLoad.filebox({    
										buttonText: '选择文件',
										width: 78,
										buttonIcon:'tree-folder-open',
										//accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
										onChange: function(newValue, oldValue){
											$.messager.progress({title:'正在上传...',text:''});
											uploadForm.form('submit', {
												url:'/server/SimpChinese/Attaches/upload/',
												queryParams: {
													filename: escape(newValue),
													id:bd.id,
													billType:bd.billType,
													_:(new Date()).getTime()
												},
												success:function(data){
													data = eval('('+data+')');
													$(this).form('reset');
													if(data.result){
														$.messager.show({
															title: '成功',
															msg: '文件：' + newValue + '上传成功！',
															timeout: 3000,
															showType: 'slide'
														});
														filegrId.datagrid('load');
													}else{
														$.messager.alert('错误', '文件：' + newValue + '上传失败！<br>' + data.msg, 'error');
													}
													$.messager.progress('close');
												}
											});
										}
									});
									delBtn.linkbutton({
										text:'删除',
										iconCls: 'icon-Delete',
										plain:true,
										onClick: function(){
											var index = filegrId.datagrid('getRowIndex', filegrId.datagrid('getSelected'));
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
													$.messager.progress({title:'正在删除...',text:''}); 
													$.ajax({
														type: 'GET', 
														url: 'server/SimpChinese/Attaches/del/',
														data: {
															filename: escape(filegrId.datagrid('getSelected').filename),
															id:bd.id,
															billType:bd.billType,
															_:(new Date()).getTime()
														},//style名称必须和mode相吻合
														dataType: "json",
														success: function(result){
															$.messager.progress('close');
															if(result){
															$.messager.show({
																title: '成功',
																msg: '文件：' + filegrId.datagrid('getSelected').filename + ' 删除成功！',
																timeout: 3000,
																showType: 'slide'
															});
															filegrId.datagrid('load');
															}
														}
													});
												}
											});
										}
									});
									downBtn.linkbutton({
										text:'下载',
										iconCls: 'icon-arrow-down',
										plain:true,
										onClick: function(){
											var index = filegrId.datagrid('getRowIndex', filegrId.datagrid('getSelected'));
											if(index < 0){
												$.messager.show({
													title: '提示',
													msg: '请先选中一行。',
													timeout: 3000,
													showType: 'slide'
												});									
												return;
											}
											window.open(window.location.protocol +'//'+ window.location.host + '/attaches/' + bd.billType + '/' + bd.id + '/' + filegrId.datagrid('getSelected').filename);
										}
									});
								}
							}]
						}]
					}]
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
		
		if(this.showAudit == 0){
			var auditbtn = ebx.getBiribbonObj(_biribbon, 'audit', 'linkbutton');
			if(auditbtn)auditbtn.hide();
		}
		
		if(this.showPrint == 0){
			var printgroup = ebx.getBiribbonObj(_biribbon, '打印', 'toolbar');
			if(printgroup){
				printgroup.next().hide();
				printgroup.hide();
			}
		}
		
		if(this.showLock == 0){
			var lockgroup = ebx.getBiribbonObj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
		if(this.billType == 0){
			var Attach = ebx.getBiribbonObj(_biribbon, '附件', 'toolbar');
			if(Attach){
				Attach.next().hide();
				Attach.hide();
			}
		}else{
			if(this.id > 0){
				var Attach = ebx.getBiribbonObj(_biribbon, '附件', 'toolbar');
				this.getAttachCount(this.id, this.billType, Attach)
			}
		}
		
	},
	getAttachCount: function(id, billType, obj){
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/attaches/getattachcount/',
			data: {_:(new Date()).getTime(),id:id,billType:billType},
			dataType: "json",
			success: function(result){
				if(result){
					if(ebx.validInt(result.count) > 0){
						obj.find('.icon-AttachFile-large').tooltip({
							position: 'bottom',
							content: result.count + '个附件',
							onShow: function(){
								//$(this).tooltip('tip').addClass('bdtip');
							}
						}).tooltip('show');
					}
				}
			}
		});
	}
}
