/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/16
单据和基本资料浏览公用对象

*****************************************************************/

ebx.browser = {
	tabs: [],
	tab: [],
	layout: [],
	listPanel: [],
	listStorage: [],
	biribbon: [],
	browserType: '',//打开类型
	showDate: 0,//是否显示查询日期控件，0为不显示，默认0
	showAudit: 0,//是否显示审核combobox
	init: function(browserType){//单据初始化函数。参数：browserType：类型，包括：'bd','bi'
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.parament = ebx.getMenuparamenter(this.tabs);
		this.browserType = browserType;
		
		if(ebx.validInt(this.parament.isAuditstyle) == 1){
			this.showAudit = 1;
		}
		if(ebx.validInt(this.parament.datestyle) == 1){
			this.showDate = 1;
		}
		
		
		this.layout = $('<div>').appendTo(this.tabs);
		this.parament = ebx.getMenuparamenter(this.tabs);
		this._default();
		
		this.listPanel = this.layout.layout('panel', 'center');
		this.biribbon = $('<div>').appendTo(this.listPanel);
		this.listStorage = $('<div>').appendTo(this.listPanel);
		this.parament = ebx.getMenuparamenter(this.tabs);
		this._list()
	},
	_default: function(){//打开列表框架装载方法
	    var _layout = this.layout;
	    
		_layout.layout({
			fit: true,
			hideCollapsedContent:true,
			onCollapse: function(){
			    _layout.find('.layout-expand-east').find('.panel-header').css({'border-top':0,'border-right':0,'border-bottom':0})
			    _layout.find('.layout-expand-east').find('.panel-body').css({'border-top':0,'border-right':0,'border-bottom':0})
			}
		});
		//this.layout.layout('collapse','east');
		_layout.layout('add',{
			region: 'center',
			title: '',
			//href:'client/SimpChinese/' + this.parament.modedit + '/' + this.parament.mode + '/list.html',
			hideExpandTool:false,
			hideCollapsedContent:false,
			border:false
		});
		if(this.browserType === 'bi'){
		    _layout.layout('add',{//添加新的layout
		        title: '新建-' + this.parament.text,
			    region: 'east',
			    width: '30%',
			    maxWidth: '50%',
			    minWidth: 300,
			    href: 'client/SimpChinese/' + this.parament.modedit + '/',
			    paramenters:this.parament,
			    hideExpandTool: false,
			    hideCollapsedContent: false,
			    border: false,
			    split: true
		    });
		}
		
		
		var eastPanel = _layout.layout('panel', 'east'),
			listPanel = _layout.layout('panel', 'center');

		eastPanel.css({overflow:'hidden'});//隐藏layout滚动条
		listPanel.css({overflow:'hidden'});//隐藏layout滚动条
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
		switch(options.browserType){
			case 'bd':
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
				break;
			case 'bi':
				ebx.editStatusMessager(options._tabs.panel('options').editstatus, options._parament.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditStatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: '30%',
						maxWidth: '50%',
						minWidth: 300,
						title: '新建-' + options._parament.text,
						href: 'client/SimpChinese/' + options._parament.modedit + '/',
						paramenters:paramenter,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
				break;
		}
	},
	_deleted: function(id, mode, callBack){
		id = ebx.validInt(id);
		if(typeof(mode) != 'string') return;
		if(mode.length == 0) return;
		if(id <= 0) return;
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + mode + '/deleted/',
			data: {v:(new Date()).getTime(), id: id},
			dataType: "json",
			success: function(result){
				callBack(result)
			}
		});
	},
	_undeleted: function(id, mode, callBack){
		id = ebx.validInt(id);
		if(typeof(mode) != 'string') return;
		if(mode.length == 0) return;
		if(id <= 0) return;
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + mode + '/undeleted/',
			data: {v:(new Date()).getTime(), id: id},
			dataType: "json",
			success: function(result){
				callBack(result)
			}
		});
	},
	_edit: function(rowIndex, rowData, options){
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
		paramenter.id = rowData?rowData.id:0;
		switch(options.browserType){
			case 'bd':
				var index = rowIndex,
				    tabsId = 'tabs_'+ebx.rndNum(20);
				
				ebx.center.tabs('add', {
					id: tabsId,
					title: '打开-' + options._parament.text,
					href: 'client/SimpChinese/' + options._parament.modedit + '/',
					paramenters:paramenter,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
			
				break;
			case 'bi':
				var index = rowIndex;
					
				ebx.editStatusMessager(options._tabs.panel('options').editstatus, options._parament.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditStatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: '30%',
						maxWidth: '50%',
						minWidth: 300,
						title: '打开-' + options._parament.text,
						href: 'client/SimpChinese/' + options._parament.modedit + '/',
						paramenters:paramenter,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
				break;
		}
	},
	_getsearchparament:function(browser, find, callBack){//查询参数统一函数
		var dateFrom = ebx.getBiribbonObj(browser.biribbon, 'dateFrom', 'datetimebox'),
			dateTo = ebx.getBiribbonObj(browser.biribbon, 'dateTo', 'datetimebox'),
			isDeleted = ebx.getBiribbonObj(browser.biribbon, 'isDeleted', 'combobox'),
			isAudit = ebx.getBiribbonObj(browser.biribbon, 'isAudit', 'combobox'),
			_dateFrom = dateFrom?dateFrom.datetimebox('getValue'):'',
			_dateTo = dateTo?dateTo.datetimebox('getValue'):'',
			_isDeleted = isDeleted?isDeleted.combobox('getValue'):'',
			_isAudit = isAudit?isAudit.combobox('getValue'):'';
		
		browser.parament.find = find;
		browser.parament.dateFrom = _dateFrom;
		browser.parament.dateTo = _dateTo;
		browser.parament.isDeleted = _isDeleted;
		browser.parament.isAudit = _isAudit;
		callBack();
	},
	_search: function(browser, find){//搜索函数	
		browser._getsearchparament(browser, find, function(){
			browser.listStorage.datagrid('load', {
				template: browser.parament.template,
				_:(new Date()).getTime(),
				find: escape(browser.parament.find),
				dateFrom: browser.parament.dateFrom,
				dateTo: browser.parament.dateTo,
				isDeleted: browser.parament.isDeleted,
				isAudit: browser.parament.isAudit
			});
		});
	},
	_list: function(){//读取并显示list列表方法
		var browser = this,
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newBtn = $('<div>').appendTo(toolbar),
			functionbtn = $('<div>').appendTo(toolbar),
			_parament = this.parament,
			_listStorage = this.listStorage,
			_edit = this._edit,
			_deleted = this._deleted,
			_undeleted = this._undeleted,
			_new = this._new,
			_search = this._search,
			_getsearchparament = this._getsearchparament,
			_open = this._open,
			_layout = this.layout,
			_tabs = this.tabs,
			_showDate = this.showDate,
			_showAudit = this.showAudit,
			_browserType = this.browserType,
			_listPanel = this.listPanel
			columnsData = [],
			_biribbon = this.biribbon,
			biribbondata = {
				selected:0,
				tabs:[{
					title:'开始',
					groups:[{
						title:'基本操作',
						tools:[{
							name:'edit',
							text:'编辑',
							iconCls:'icon-DesignMode-large',
							iconAlign:'top',
							size:'large',
							disabled: true
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
										browserType: 'bi',
										_tabs: _tabs,
										_layout: _layout
									}; 
									setTimeout(function(){
										_new(options);
									},0);
								}
							},{
								name:'del',
								text:'删除',
								iconCls:'icon-Delete',
								disabled: true,
							    onClick: function(){
								    var id = ebx.validInt(_listStorage.datagrid('getSelected').id);
								    if(id <= 0)return;
								    _deleted(id, _parament.modedit, function(result){
									    if(result.result){
										    $.messager.show({
											    title: '提示',
											    msg: '删除成功！',
											    timeout: 2000,
											    showType: 'slide'
										    });	
										    _search(browser, searchtext.textbox('getValue'));
									    }else{
										    $.messager.alert('错误', '删除失败！<br>' + JSON.stringify(result.msg), 'error');
									    }
								    });
							    }
							},{
								name:'reload',
								text:'恢复',
								iconCls:'icon-reload',
								disabled: true,
								onClick: function(){
									var id = ebx.validInt(_listStorage.datagrid('getSelected').id);
									if(id <= 0)return;
									_undeleted(id, _parament.modedit, function(result){
										if(result.result){
											$.messager.show({
												title: '提示',
												msg: '恢复成功！',
												timeout: 2000,
												showType: 'slide'
											});	
											_search(browser, searchtext.textbox('getValue'));
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
							type:'toolbar',
							tools:[{
								name:'ImportExcel',
								text:'导出',
								iconCls:'icon-ImportExcel-large',
								iconAlign:'top',
								size:'large',
								onClick:function(){
									var btn = $(this);

									if(btn.linkbutton('options').disabled == true) return;
									
									btn.linkbutton('disable');
									
									_getsearchparament(browser, searchtext.textbox('getValue'), function(){
										$.ajax({
											type: 'post', 
											url: 'server/SimpChinese/'+ _parament.provider +'/list/',
											data: browser.parament,
											dataType: "json",
											success: function(result){
												if(result){
													btn.linkbutton('enable');
													ebx.clipBoardData(columnsData, result)
												}
											}
										});	
									});									
								}
							},{
								type:'splitbutton',
								name:'ExportExcel',
								text:'导入',
								disabled: true,
								iconCls:'icon-ExportExcel-large',
								menuItems:[{
									name:'FileSaveAsExcelXlsx',
									text: '导入模板',
									disabled: true,
									iconCls:'icon-FileSaveAsExcelXlsx'
								}],
								iconAlign:'top',
								size:'large'
							}]
						}]
					},{
						title:'状态',
						type:'toolbar',
						dir:'v',
						tools:[{
							type:'toolbar',
							tools: [{
								text:'删除：'
							},{
								type: 'combobox',
								name:'isDeleted',
								data:[{
									"id":0,
									"text":"未删除",
									"selected":true
								},{
									"id":1,
									"text":"已删除"
								},{
									"id":2,
									"text":"全部"
								}],
								valueField:'id',
								textField:'text',
								panelHeight:'auto',
								width:'89xp',
								editable:false
							}]
						},{
							type:'toolbar',
							name:'isAudit',
							tools: [{
								text:'审核：',
								name:'isAuditText'
							},{
								type: 'combobox',
								name:'isAudit',
								data:[{
									"id":2,
									"text":"全部",
									"selected":true
								},{
									"id":1,
									"text":"已审核"
								},{
									"id":0,
									"text":"未审核"
								}],
								valueField:'id',
								textField:'text',
								panelHeight:'auto',
								width:'89xp',
								editable:false
							}]
						}]
					},{
						title:'时间',
						type:'toolbar',
						dir:'v',
						tools: [{
							type:'toolbar',
							tools: [{
								text:'开始：'
							},{
								type:'datetimebox',
								name:'dateFrom',
								showSeconds: true
							}]
						},{
							type:'toolbar',
							tools: [{
								text:'结束：'
							},{
								type:'datetimebox',
								name:'dateTo',
								value: new Date().Format("yyyy-MM-dd hh:mm:ss"),
								showSeconds: true
							}]
						}]
					}]
				}]
			};
		
		if(!_showDate){
			biribbondata.tabs[0].groups.splice(3, 1)
		}
		_biribbon.ribbon({
			data:biribbondata,
			width:'100%',
			border: false,
			plain:true,
			showHeader: false
		});
		
		if(_showAudit == 0){
			//debugger;
			var isAuditText = ebx.getBiribbonObj(_biribbon, 'isAuditText', 'linkbutton');
			if(isAuditText)isAuditText.hide();
			var isAudit = ebx.getBiribbonObj(_biribbon, 'isAudit', 'combobox');
			if(isAudit)isAudit.combobox('destroy');
			//biribbondata.tabs[0].groups[2].tools.splice(1, 1);
		}

		
		searchtext.searchbox({
			searcher: function(){
				_search(browser, searchtext.textbox('getValue'));
			},
			prompt:'输入搜索文字并回车'
		});

		newBtn.linkbutton({
			text:'新建',
			iconCls: 'icon-file',
			plain:true,
			onClick: function(){
				var options = {
					_parament: _parament,
					browserType: _browserType,
					_tabs: _tabs,
					_layout: _layout
				}; 
				_new(options);
			}
		});
		
		functionbtn.linkbutton({
			//text:'更多',
			iconCls: 'icon-downarrow',
			iconAlign:'right',
			plain:true,
			onClick:function(){
				var b = _layout.layout('panel', 'center').find('.ribbon');
				if(b.height() < 100){
					b.show();
					b.animate({height:113}, 300, function(){
						_listStorage.datagrid('resize', {
							height:_listPanel.height()-_listPanel.find('.ribbon').height()
						});
					});
					//functionbtn.find('.l-btn-text').text('隐藏');
					functionbtn.find('.l-btn-icon').addClass('icon-uparrow').removeClass('icon-downarrow');
				}else{
					b.animate({height:0}, 300, function(){
						b.hide();
						_listStorage.datagrid('resize', {
							height:_listPanel.height()-_listPanel.find('.ribbon').height()
						});
					});
					//functionbtn.find('.l-btn-text').text('更多');
					functionbtn.find('.l-btn-icon').addClass('icon-downarrow').removeClass('icon-uparrow');
				}
			}
		}).addClass('browser-functionbtn');
		
		_biribbon.hide();
		_biribbon.height(0);
		
		searchtext.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) {  
				_search(browser, searchtext.textbox('getValue'));
			}  
		});
		
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/'+ _parament.provider +'/style/',
			data: {style:_parament.style,_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					var dateFrom = ebx.getBiribbonObj(_biribbon, 'dateFrom', 'datetimebox'),
						dateTo = ebx.getBiribbonObj(_biribbon, 'dateTo', 'datetimebox'),
						_dateFrom = dateFrom?dateFrom.datetimebox('getValue'):'',
						_dateTo = dateTo?dateTo.datetimebox('getValue'):'',
						_isDeleted = ebx.getBiribbonObj(_biribbon, 'isDeleted', 'combobox').combobox('getValue'),
						isAudit = ebx.getBiribbonObj(_biribbon, 'isAudit', 'combobox'),
						_isAudit = -1;
						if(isAudit)_isAudit = isAudit.combobox('getValue')
					
					columnsData = [result.data];

					_getsearchparament(browser, searchtext.textbox('getValue'), function(){
						_listStorage.datagrid({
							view:scrollview,
							pageSize:ebx.pageSize,
							remoteSort:true,
							rownumbers:true,
							singleSelect:true,
							pagination:false,
							fit:false,
							fitColumns:false,
							striped:true,
							nowrap:true,//禁用自动换行
							url:'server/SimpChinese/'+ _parament.provider +'/list/',
							method:'post',
							queryParams: browser.parament,
							toolbar: toolbar,
							multiSort:false,
							checkOnSelect:false,
							columns:columnsData,
							height: _listPanel.height()-_listPanel.find('.ribbon').height(),//'100%',
							width: '100%',
							onSelect: function(rowIndex, rowData){
								ebx.getBiribbonObj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:false,
									onClick: function(){
										var options = {
											_parament: _parament,
											browserType: _browserType,
											_tabs: _tabs,
											_layout: _layout
										};
										_edit(rowIndex, rowData, options);
									}
								});

								if(rowData.isDeleted && !rowData.auditid){
									ebx.getBiribbonObj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									ebx.getBiribbonObj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:false
									});
								}else if(!rowData.auditid){
									ebx.getBiribbonObj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:false
									});
									ebx.getBiribbonObj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}else{
									ebx.getBiribbonObj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									ebx.getBiribbonObj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}
							},
							onClickCell:function(){},//禁用单元格编辑功能，防止双击后onDblClickRow事件失效 2018-7-15 zz
							onDblClickRow: function(rowIndex, rowData){
								var options = {
									_parament: _parament,
									browserType: _browserType,
									_tabs: _tabs,
									_layout: _layout
								};
								_edit(rowIndex, rowData, options);
							},
							onRowContextMenu: function(e, rowIndex, rowData){
								if(rowIndex < 0)return;
								_listStorage.datagrid('selectRow', rowIndex)
								e.preventDefault();
								var RowContextMenu = $('<div>');
								RowContextMenu.menu({
									width:100
								}).menu('appendItem', {
									text: '编辑',
									iconCls: 'icon-DesignMode',
									disable:true,
									onclick:function(){
										var options = {
											_parament: _parament,
											browserType: _browserType,
											_tabs: _tabs,
											_layout: _layout
										};
										_edit(rowIndex, rowData, options);
									}
								}).menu('appendItem', {
									text: '删除',
									iconCls: 'icon-Delete',
									disabled:rowData.auditid?true:(rowData.isDeleted?true:false),
									onclick: function(){
										var id = ebx.validInt(rowData.id);
										if(id <= 0)return;
										_deleted(id, _parament.modedit, function(result){
											if(result.result){
												$.messager.show({
													title: '提示',
													msg: '删除成功！',
													timeout: 2000,
													showType: 'slide'
												});	
												_search(browser, searchtext.textbox('getValue'));
											}else{
												$.messager.alert('错误', '删除失败！<br>' + JSON.stringify(result.msg), 'error');
											}
										});
									}
								}).menu('appendItem', {
									text: '恢复',
									iconCls: 'icon-reload',
									disabled:rowData.auditid?true:(rowData.isDeleted?false:true),
									onclick: function(){
										var id = ebx.validInt(rowData.id);
										if(id <= 0)return;
										_undeleted(id, _parament.modedit, function(result){
											if(result.result){
												$.messager.show({
													title: '提示',
													msg: '恢复成功！',
													timeout: 2000,
													showType: 'slide'
												});	
												_search(browser, searchtext.textbox('getValue'));
											}else{
												$.messager.alert('错误', '恢复失败！<br>' + JSON.stringify(result.msg), 'error');
											}
										});
									}
								}).menu('show', {
									left: e.pageX,
									top: e.pageY
								});
							},
							border:result.bd[0].border,
							showFooter:result.bd[0].footer,
							showHeader:result.bd[0].header,
							onLoadSuccess: function(){
								ebx.getBiribbonObj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:true
								});
								ebx.getBiribbonObj(browser.biribbon, 'del', 'linkbutton').linkbutton({
									disabled:true
								});
								ebx.getBiribbonObj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
									disabled:true
								});
							}
						}).datagrid('renderformatterstyler');
						
						var isDeletedCombobox = ebx.getBiribbonObj(_biribbon, 'isDeleted', 'combobox');//绑定删除状态的onSelect
						if(isDeletedCombobox){
							var onSelectfn = isDeletedCombobox.combobox('options').onSelect;
							isDeletedCombobox.combobox('options').onSelect = function(record){
								setTimeout(function(){
									var find = searchtext.textbox('getValue');
									_search(browser, find);
								}, 0);
								onSelectfn(record);
							}
						}
						
						var isAuditCombobox = ebx.getBiribbonObj(_biribbon, 'isAudit', 'combobox');//绑定审核状态的onSelect
						if(isAuditCombobox){
							var onSelectfn = isAuditCombobox.combobox('options').onSelect;
							isAuditCombobox.combobox('options').onSelect = function(record){
								setTimeout(function(){
									var find = searchtext.textbox('getValue');
									_search(browser, find);
								}, 0);
								onSelectfn(record);
							}
						}

						var dateFrom = ebx.getBiribbonObj(_biribbon, 'dateFrom', 'datetimebox');//绑定开始日期的onHidePanel，支持回车触发
						if(dateFrom){
							var onHidePanelfn = dateFrom.datetimebox('options').onHidePanel;
							dateFrom.datetimebox({
								onHidePanel: function(){
									if($(this).datetimebox('getValue').length > 0){
										setTimeout(function(){
											var find = searchtext.textbox('getValue');
											_search(browser, find);
										}, 0);
									}
									onHidePanelfn();
								}
							});
						}

						var dateTo = ebx.getBiribbonObj(_biribbon, 'dateTo', 'datetimebox');//绑定结束日期的onHidePanel，支持回车触发
						if(dateTo){
							var onHidePanelfn = dateTo.datetimebox('options').onHidePanel;
							dateTo.datetimebox({
								onHidePanel: function(){
									if($(this).datetimebox('getValue').length > 0){
										setTimeout(function(){
											var find = searchtext.textbox('getValue');
											_search(browser, find);
										}, 0);
									}
									onHidePanelfn();
								}
							});
						}
						
					});
					
				}
			}
		});

		var onResize = window.onresize;
		window.onresize = function() {//窗口高度发生变化时，自动调整list的高度 2018-4-22 zz
			setTimeout(function(){
				try{
					_listStorage.datagrid('resize', {
						height:_listPanel.height()-_listPanel.find('.ribbon').height()
					});
				}catch(e){}
			},200);
			onResize();
		}
	},
}
