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
	liststorage: [],
	biribbon: [],
	browsertype: '',//打开类型
	showdate: 0,//是否显示查询日期控件，0为不显示，默认0
	showAudit: 0,
	init: function(layoutName, browsertype, callback){//单据初始化函数。参数：layoutName：初始化区域名称，包括：list，default，browsertype：类型，包括：'bd','bi',callback：回掉函数
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Paramet = ebx.getMenuParameter(this.tabs);
		this.browsertype = browsertype;
		
		if(this.Paramet.datestyle == 1){
			this.showdate = 1;
		}
		if(this.Paramet.IsAuditStyle == 1){
			this.showAudit = 1;
		}
		
		switch(layoutName.toLowerCase()){
			case 'default':
				this.layout = $('<div>').appendTo(this.tabs);
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._default();
				break;
			case 'list':
				this.layout = this.tabs.find('.layout');
				this.listPanel = this.layout.layout('panel', 'center');
				this.biribbon = $('<div>').appendTo(this.listPanel);
				this.liststorage = $('<div>').appendTo(this.listPanel);
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._list()
				break;
		}
	},
	_default: function(){//打开列表框架装载方法
		this.layout.layout({
			fit: true
		}).layout('add',{
			region: 'center',
			title: '',
			href:'client/SimpChinese/' + this.Paramet.mode + '/browser/list.html',
			hideExpandTool:false,
			hideCollapsedContent:false,
			border:false
		});
		
		var eastPanel = this.layout.layout('panel', 'east'),
			listPanel = this.layout.layout('panel', 'center');

		eastPanel.css({overflow:'hidden'});//隐藏layout滚动条
		listPanel.css({overflow:'hidden'});//隐藏layout滚动条
	},
	_new: function(options){
		switch(options.browsertype){
			case 'bd':
				var tabsid = 'tabs_'+ebx.RndNum(20)
				ebx.center.tabs('add', {
					id: tabsid,
					title: '新建-' + options._Paramet.text,
					href: 'client/SimpChinese/' + options._Paramet.mode + '/?text='+options._Paramet.text+'&mode=' + options._Paramet.mode +'&style=' + options._Paramet.style + '&template=' + options._Paramet.template,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
				break;
			case 'bi':
				ebx.EditStatusMessager(options._tabs.panel('options').editstatus, options._Paramet.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditstatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: 400,
						maxWidth: '50%',
						minWidth: 400,
						title: '',
						href: 'client/SimpChinese/' + options._Paramet.mode + '/?text='+options._Paramet.text+'&mode=' + options._Paramet.mode,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
				break;
		}
	},
	_deleted: function(id, mode, callback){
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
				callback(result)
			}
		});
	},
	_undeleted: function(id, mode, callback){
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
				callback(result)
			}
		});
	},
	_edit: function(rowIndex, rowData, options){
		switch(options.browsertype){
			case 'bd':
				var id = rowData?rowData.id:'',
					index = rowIndex;
					
				var tabsid = 'tabs_'+ebx.RndNum(20)
				
				ebx.center.tabs('add', {
					id: tabsid,
					title: '打开-' + options._Paramet.text,
					href: 'client/SimpChinese/' + options._Paramet.mode + '/?text='+options._Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + options._Paramet.mode +'&style=' + options._Paramet.style + '&template=' + options._Paramet.template,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
			
				break;
			case 'bi':
				var id = rowData?rowData.id:'',
					index = rowIndex;
					
				ebx.EditStatusMessager(options._tabs.panel('options').editstatus, options._Paramet.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditstatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: 400,
						maxWidth: '50%',
						minWidth: 400,
						title: '',
						href: 'client/SimpChinese/' + options._Paramet.mode + '/?text='+options._Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + options._Paramet.mode,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
				break;
		}
	},
	_getsearchParamet:function(browser, find, callback){//查询参数统一函数
		var datefrom = browser._getbiribbonobj(browser.biribbon, 'datefrom', 'datetimebox'),
			dateto = browser._getbiribbonobj(browser.biribbon, 'dateto', 'datetimebox'),
			isdeleted = browser._getbiribbonobj(browser.biribbon, 'isdeleted', 'combobox'),
			isaudit = browser._getbiribbonobj(browser.biribbon, 'isaudit', 'combobox'),
			_datefrom = datefrom?datefrom.datetimebox('getValue'):'',
			_dateto = dateto?dateto.datetimebox('getValue'):'',
			_isdeleted = isdeleted?isdeleted.combobox('getValue'):'',
			_isaudit = isaudit?isaudit.combobox('getValue'):'';
		
		browser.Paramet.find = find;
		browser.Paramet.datefrom = _datefrom;
		browser.Paramet.dateto = _dateto;
		browser.Paramet.isdeleted = _isdeleted;
		browser.Paramet.isaudit = _isaudit;
		callback();
	},
	_search: function(browser, find){//搜索函数	
		browser._getsearchParamet(browser, find, function(){
			browser.liststorage.datagrid('load', {
				template: browser.Paramet.template,
				_:(new Date()).getTime(),
				find: browser.Paramet.find,
				datefrom: browser.Paramet.datefrom,
				dateto: browser.Paramet.dateto,
				isdeleted: browser.Paramet.isdeleted,
				isaudit: browser.Paramet.isaudit
			});
		});
	},
	_getbiribbonobj: function(biribbon, name, type){//获取biribbon指定对象，参数：biribbon：biribbon对象，name：name属性或按钮字符，type：空间类型 2018-7-17 zz
		switch(type){
			case 'textbox':
				var o = biribbon.find('.textbox-f');
				for(var i = 0;i < o.length; i++){
					var _name = $(o[i]).textbox('options').name;
					if(_name != undefined){
						if(_name.toLowerCase() == name.toLowerCase()){
							return $(o[i]);
						}
					}
				}
				break;
			case 'linkbutton':
				var o = biribbon.find('.l-btn');
				for(var i = 0;i < o.length; i++){
					var _name = $(o[i]).linkbutton('options').name;
					if(_name != undefined){
						if(_name.toLowerCase() == name.toLowerCase()){
							return $(o[i]);
						}
					}
				}
				break;
			case 'textbox-button':
				var o = biribbon.find('.textbox-button');
				for(var i = 0;i < o.length; i++){
					var _name = $(o[i]).find('.l-btn-text').text();
					if(_name != undefined){
						if(_name.toLowerCase() == name.toLowerCase()){
							return $(o[i]);
						}
					}
				}
				break;
			case 'combobox':
				var o = biribbon.find('.combobox-f');
				for(var i = 0;i < o.length; i++){
					var _name = $(o[i]).combobox('options').name;
					if(_name != undefined){
						if(_name.toLowerCase() == name.toLowerCase()){
							return $(o[i]);
						}
					}
				}
				break;
			case 'datetimebox':
				var o = biribbon.find('.datetimebox-f');
				for(var i = 0;i < o.length; i++){
					var _name = $(o[i]).datetimebox('options').name;
					if(_name != undefined){
						if(_name.toLowerCase() == name.toLowerCase()){
							return $(o[i]);
						}
					}
				}
				break;
			default:
				return null;
				break;
		}
	},
	_list: function(){//读取并显示list列表方法
		var browser = this,
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newbtn = $('<div>').appendTo(toolbar),
			functionbtn = $('<div>').appendTo(toolbar),
			_Paramet = this.Paramet,
			_liststorage = this.liststorage,
			_edit = this._edit,
			_deleted = this._deleted,
			_undeleted = this._undeleted,
			_new = this._new,
			_search = this._search,
			_getsearchParamet = this._getsearchParamet,
			_open = this._open,
			_layout = this.layout,
			_tabs = this.tabs,
			_showdate = this.showdate,
			_showAudit = this.showAudit,
			_browsertype = this.browsertype,
			_listPanel = this.listPanel,
			_getbiribbonobj = this._getbiribbonobj,
			columnsData = [],
			_biribbon = this.biribbon,
			biribbondata = {
				selected:0,
				tabs:[{
					title:'开始',
					groups:[{
						title:'基本操作',
						tools:[{
							name:'del',
							text:'删除',
							iconCls:'icon-Delete-large',
							iconAlign:'top',
							size:'large',
							disabled: true,
							onClick: function(){
								var id = ebx.validInt(_liststorage.datagrid('getSelected').id);
								if(id <= 0)return;
								_deleted(id, _Paramet.mode, function(result){
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
							type:'toolbar',
							dir:'v',
							tools:[{
								name:'edit',
								text:'编辑',
								iconCls:'icon-DesignMode',
								disabled: true
							},{
								name:'reload',
								text:'恢复',
								iconCls:'icon-reload',
								disabled: true,
								onClick: function(){
									var id = ebx.validInt(_liststorage.datagrid('getSelected').id);
									if(id <= 0)return;
									_undeleted(id, _Paramet.mode, function(result){
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
									
									_getsearchParamet(browser, searchtext.textbox('getValue'), function(){
										$.ajax({
											type: 'post', 
											url: 'server/SimpChinese/DataProvider/list/',
											data: browser.Paramet,
											dataType: "json",
											success: function(result){
												if(result){
													btn.linkbutton('enable');
													ebx.clipboardData(columnsData, result)
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
								name:'isdeleted',
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
							tools: [{
								text:'审核：'
							},{
								type: 'combobox',
								name:'isaudit',
								data:[{
									"id":2,
									"text":"全部",
									"selected":true
								},{
									"id":0,
									"text":"未审核"
								},{
									"id":1,
									"text":"已审核"
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
								name:'datefrom',
								showSeconds: true
							}]
						},{
							type:'toolbar',
							tools: [{
								text:'结束：'
							},{
								type:'datetimebox',
								name:'dateto',
								value: new Date().Format("yyyy-MM-dd hh:mm:ss"),
								showSeconds: true
							}]
						}]
					}]
				}]
			};
			
		if(!_showAudit){
			biribbondata.tabs[0].groups[2].tools.splice(1, 1);
		}

		if(!_showdate){
			biribbondata.tabs[0].groups.splice(3, 1)
		}
		_biribbon.ribbon({
			data:biribbondata,
			width:'100%',
			border: false,
			plain:true,
			showHeader: false,
			onClick: function(name, target){
				switch($(target).find('.l-btn-text').text()){
					case '搜索':
						
						break;
				}
			}
		});
		searchtext.searchbox({
			//buttonText:'搜索',
			//iconCls:'icon-ZoomClassic_custom',
			//iconAlign:'left',
			searcher: function(){
				_search(browser, searchtext.textbox('getValue'));
			},
			prompt:'输入搜索文字并回车'
		});
		newbtn.linkbutton({
			text:'新建',
			iconCls: 'icon-file',
			plain:true,
			onClick: function(){
				var options = {
					_Paramet: _Paramet,
					browsertype: _browsertype,
					_tabs: _tabs,
					_layout: _layout
				}; 
				_new(options);
			}
		});
		functionbtn.linkbutton({
			text:'更多',
			iconCls: 'icon-TableInsertRowsAbove',
			iconAlign:'right',
			plain:true,
			onClick:function(){
				if(_biribbon.height() < 100){
					_biribbon.show();
					_biribbon.animate({height:113}, 200, function(){
						_liststorage.datagrid('resize', {
							height:_listPanel.height()-_listPanel.find('.ribbon').height()
						});
					});
					functionbtn.find('.l-btn-text').text('隐藏');
					//functionbtn.find('.l-btn-icon').addClass('icon-TableInsertRowsAbove').removeClass('icon-TableInsertRowsAbove');
				}else{
					_biribbon.animate({height:0}, 200, function(){
						_biribbon.hide();
						_liststorage.datagrid('resize', {
							height:_listPanel.height()-_listPanel.find('.ribbon').height()
						});
					});
					functionbtn.find('.l-btn-text').text('更多');
					//functionbtn.find('.l-btn-icon').addClass('icon-TableInsertRowsAbove').removeClass('icon-TableInsertRowsAbove');
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
			url: 'server/SimpChinese/DataProvider/style/',
			data: {style:_Paramet.style,_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					var datefrom = _getbiribbonobj(_biribbon, 'datefrom', 'datetimebox'),
						dateto = _getbiribbonobj(_biribbon, 'dateto', 'datetimebox'),
						_datefrom = datefrom?datefrom.datetimebox('getValue'):'',
						_dateto = dateto?dateto.datetimebox('getValue'):'',
						_isdeleted = _getbiribbonobj(_biribbon, 'isdeleted', 'combobox').combobox('getValue'),
						isaudit = _getbiribbonobj(_biribbon, 'isaudit', 'combobox'),
						_isaudit = -1;
						if(isaudit)_isaudit = isaudit.combobox('getValue')
					
					columnsData = [result.data];
					
					_getsearchParamet(browser, searchtext.textbox('getValue'), function(){
						_liststorage.datagrid({
							view:scrollview,
							pageSize:ebx.pagesize,
							remoteSort:true,
							rownumbers:true,
							singleSelect:true,
							pagination:false,
							fit:false,
							fitColumns:false,
							striped:true,
							nowrap:true,//禁用自动换行
							url:'server/SimpChinese/DataProvider/list/',
							method:'post',
							queryParams: browser.Paramet,
							toolbar: toolbar,
							multiSort:false,
							checkOnSelect:false,
							columns:columnsData,
							height: _listPanel.height()-_listPanel.find('.ribbon').height(),//'100%',
							width: '100%',
							onSelect: function(rowIndex, rowData){
								browser._getbiribbonobj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:false,
									onClick: function(){
										var options = {
											_Paramet: _Paramet,
											browsertype: _browsertype,
											_tabs: _tabs,
											_layout: _layout
										};
										_edit(rowIndex, rowData, options);
									}
								});

								if(rowData.isdeleted && !rowData.auditid){
									browser._getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									browser._getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:false
									});
								}else if(!rowData.auditid){
									browser._getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:false
									});
									browser._getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}else{
									browser._getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									browser._getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}
							},
							onClickCell:function(){},//禁用单元格编辑功能，防止双击后onDblClickRow事件失效 2018-7-15 zz
							onDblClickRow: function(rowIndex, rowData){
								var options = {
									_Paramet: _Paramet,
									browsertype: _browsertype,
									_tabs: _tabs,
									_layout: _layout
								};
								_edit(rowIndex, rowData, options);
							},
							onRowContextMenu: function(e, rowIndex, rowData){
								if(rowIndex < 0)return;
								_liststorage.datagrid('selectRow', rowIndex)
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
											_Paramet: _Paramet,
											browsertype: _browsertype,
											_tabs: _tabs,
											_layout: _layout
										};
										_edit(rowIndex, rowData, options);
									}
								}).menu('appendItem', {
									text: '删除',
									iconCls: 'icon-Delete',
									disabled:rowData.auditid?true:(rowData.isdeleted?true:false),
									onclick: function(){
										var id = ebx.validInt(rowData.id);
										if(id <= 0)return;
										_deleted(id, _Paramet.mode, function(result){
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
									disabled:rowData.auditid?true:(rowData.isdeleted?false:true),
									onclick: function(){
										var id = ebx.validInt(rowData.id);
										if(id <= 0)return;
										_undeleted(id, _Paramet.mode, function(result){
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
								browser._getbiribbonobj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:true
								});
								browser._getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
									disabled:true
								});
								browser._getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
									disabled:true
								});
							}
						}).datagrid('renderformatterstyler');
						
						var isdeletedcombobox = _getbiribbonobj(_biribbon, 'isdeleted', 'combobox');//绑定删除状态的onSelect
						if(isdeletedcombobox){
							var onSelectfn = isdeletedcombobox.combobox('options').onSelect;
							isdeletedcombobox.combobox('options').onSelect = function(record){
								setTimeout(function(){
									var find = searchtext.textbox('getValue');
									_search(browser, find);
								}, 0);
								onSelectfn(record);
							}
						}
						
						var isauditcombobox = _getbiribbonobj(_biribbon, 'isaudit', 'combobox');//绑定审核状态的onSelect
						if(isauditcombobox){
							var onSelectfn = isauditcombobox.combobox('options').onSelect;
							isauditcombobox.combobox('options').onSelect = function(record){
								setTimeout(function(){
									var find = searchtext.textbox('getValue');
									_search(browser, find);
								}, 0);
								onSelectfn(record);
							}
						}

						var datefrom = _getbiribbonobj(_biribbon, 'datefrom', 'datetimebox');//绑定开始日期的onHidePanel，支持回车触发
						if(datefrom){
							var onHidePanelfn = datefrom.datetimebox('options').onHidePanel;
							datefrom.datetimebox({
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

						var dateto = _getbiribbonobj(_biribbon, 'dateto', 'datetimebox');//绑定结束日期的onHidePanel，支持回车触发
						if(dateto){
							var onHidePanelfn = dateto.datetimebox('options').onHidePanel;
							dateto.datetimebox({
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

		var onresize = window.onresize;
		window.onresize = function() {//窗口高度发生变化时，自动调整list的高度 2018-4-22 zz
			setTimeout(function(){
				try{
					_liststorage.datagrid('resize', {
						height:_listPanel.height()-_listPanel.find('.ribbon').height()
					});
				}catch(e){}
			},200);
			onresize();
		}
	},
}
