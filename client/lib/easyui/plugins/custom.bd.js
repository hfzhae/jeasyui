/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/16
单据对象，包括单据的表头、表体，功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/

ebx.bd = {
	ID: 0,
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
	showAudit: 0,//是否显示审核bombobox
	showPrint: 0,//是否显示打印group
	showLock: 0,//是否显示安全group
	showdate: 0,//是否显示查询日期控件，0为不显示，默认0
	init: function(layoutName, callback, callback1){//单据初始化函数。参数：layoutName：初始化区域名称，包括：default，center，east，north，callback：回掉函数，datagrid装载前执行，callback1：回掉函数，datagrid装载后执行
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Paramet = ebx.getMenuParameter(this.tabs);
		this.ID = ebx.validInt(this.Paramet.id);
		if(ebx.validInt(this.Paramet.IsAuditStyle) == 1){
			this.showAudit = 1;
		}

		if(ebx.validInt(this.Paramet.print) == 1){
			this.showPrint = 1;
		}

		if(ebx.validInt(this.Paramet.lock) == 1){
			this.showLock = 1;
		}
		
		if(ebx.validInt(this.Paramet.DateStyle) == 1){
			this.showdate = 1;
		}
		
		switch(layoutName.toLowerCase()){
			case 'north':
				this.layout = this.tabs.find('.layout');
				this.northPanel = this.layout.layout('panel', 'north');
				this.biribbon = $('<div>').appendTo(this.northPanel);
				this._north();
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
			_centerstorage = this.centerstorage,
			_Paramet = this.Paramet,
			toolbar = $('<div>'),
			serialScan = $('<div>').appendTo(toolbar);
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/DataProvider/style/',
			data: {style:_Paramet.mode+'list',_:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					columnsData = [result.data];
					ebx.setListVies(columnsData[0]);
					if(callback)callback(columnsData, _centerstorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
					_centerstorage.datagrid({
						view:scrollview,
						pageSize:ebx.pagesize,
						remoteSort:false,
						rownumbers:true,
						singleSelect:true,
						pagination:false,
						border:false,
						fit:false,
						fitColumns:false,
						striped:true,
						url:'server/SimpChinese/'+_Paramet.mode+'/center/',
						nowrap:true,//禁用自动换行
						method:'post',
						queryParams:{_:(new Date()).getTime(),id:_Paramet.id},
						multiSort:false,
						checkOnSelect:false,
						columns:columnsData,
						height: '100%',
						border:result.bd[0].border,
						showFooter:result.bd[0].footer?true:false,
						showHeader:result.bd[0].header,
						toolbar: toolbar
					}).datagrid('renderformatterstyler');//启用显示式样回调函数
					serialScan.textbox({
						prompt:'搜索串号添加产品',
						buttonText:'搜索',
						//iconCls:'icon-BarcodeInsert', 
						//iconAlign:'right',
						onClickButton: function(index){
							var textbox = $(this),
								v = textbox.textbox('getValue');
							if(v.length == 0)return;
							ebx.productserial.SerialtoProduct(textbox, _centerstorage, bd.tab)
							
						}
					});
					
					serialScan.textbox('textbox').bind('keydown', function(e) {  
						if (e.keyCode == 13) { 
							var v = serialScan.textbox('getValue');
							if(v.length == 0)return;
							ebx.productserial.SerialtoProduct(serialScan, _centerstorage, bd.tab)
						}  
					});
					if(ebx.validInt(_Paramet.searchserial) == 0 || ebx.listview.productserial == 0)_layout.layout('panel', 'center').find('.datagrid-toolbar').remove();
				}
				if(callback1)callback1(_centerstorage);
			}
		});
	},
	_save:function(asSave, _layout, _Paramet, _tab, callback){
		var bdlist = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('getData'),
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
		
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + _Paramet.mode + '/save/',
			data: parameter,
			dataType: "json",
			success: function(result){
				if(result.result){
					$.messager.show({
						title: '提示',
						msg: savetext + '成功！',
						timeout: 3000,
						showType: 'slide'
					});	
					ebx.setEditstatus(_tab, false);
					var id = result.id;
					
					_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime(), page:1, rows: ebx.pagesize});
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
					
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
	_north: function (){//单据表头按钮对象 2018-7-9 zz
		var bd = this,
			_layout = this.layout,
			_eastPanel = this.eastPanel,
			_showLock = this.showLock,
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
											_save(1, _layout, _Paramet, _tab, function(){ });
										}
									});
								}
							}],
							onClick: function(){
								var lockbtn = ebx.browser._getbiribbonobj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn && _showLock == 1){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this);
								saveBtn.linkbutton('disable');
								_save(0, _layout, _Paramet, _tab, function(){
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
							iconCls:'icon-AcceptChanges-large',
							iconAlign:'top',
							size:'large',
							menuItems:[{
								name:'saveas',
								text:'保存并审核',
								iconCls:'icon-SaveSelectionToTableOfContentsGallery',
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
						type:'toolbar',
						title:'打印',
						name:'printgroup',
						dir:'v',
						tools:[{
							text:'打印',
							name:'print',
							iconCls:'icon-PrintDialogAccess',
							//iconAlign:'top',
							//size:'large',
						},{
							text:'预览',
							name:'printview',
							iconCls:'icon-ViewsAdpDiagramPrintPreview',
							//iconAlign:'top',
							//size:'large',
						},{
							text:'设置',
							name:'printsetup',
							iconCls:'icon-PrintOptionsMenu',
							//iconAlign:'top',
							//size:'large',
						}]
					},{
						type:'toolbar',
						title:'行操作',
						tools:[{
							name:'copy',
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
								
								ebx.setEditstatus(_tab, true);
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
												listdatagrid.datagrid('load', { total: 0, rows: [] }); 
											}else{
												listdatagrid.datagrid('selectRow', index);
											}
											
											ebx.setEditstatus(_tab, true);
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
											listdatagrid.datagrid('load', { total: 0, rows: [] }); 
											ebx.setEditstatus(_tab, true)
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
								name:'reomvecopyData',
								text:'清除内容',
								iconCls:'icon-Delete',
								onClick: function(){
									ebx.reomvecopyData();
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
									ebx.clipboardData(columns, data);
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
										ebx.importTemplate(columns, _Paramet.text);
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
		
		_biribbon.ribbon({
			data:data,
			width:'100%',
			height:'100%',
			border: false,
			plain:true,
			showHeader: false
		});
		
		if(this.showAudit == 0){
			var auditbtn = ebx.browser._getbiribbonobj(_biribbon, 'audit', 'linkbutton');
			if(auditbtn)auditbtn.hide();
		}
		
		if(this.showPrint == 0){
			var printgroup = ebx.browser._getbiribbonobj(_biribbon, '打印', 'toolbar');
			if(printgroup){
				printgroup.next().hide();
				printgroup.hide();
			}
		}
		
		if(this.showLock == 0){
			var lockgroup = ebx.browser._getbiribbonobj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
		
	}
}
