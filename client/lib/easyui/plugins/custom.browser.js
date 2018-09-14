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
	showAudit: 0,//是否显示审核combobox
	init: function(browsertype){//单据初始化函数。参数：browsertype：类型，包括：'bd','bi'
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Parament = ebx.getMenuParamenter(this.tabs);
		this.browsertype = browsertype;
		
		if(ebx.validInt(this.Parament.isauditstyle) == 1){
			this.showAudit = 1;
		}
		if(ebx.validInt(this.Parament.datestyle) == 1){
			this.showdate = 1;
		}
		
		
		this.layout = $('<div>').appendTo(this.tabs);
		this.Parament = ebx.getMenuParamenter(this.tabs);
		this._default();
		
		this.listPanel = this.layout.layout('panel', 'center');
		this.biribbon = $('<div>').appendTo(this.listPanel);
		this.liststorage = $('<div>').appendTo(this.listPanel);
		this.Parament = ebx.getMenuParamenter(this.tabs);
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
			//href:'client/SimpChinese/' + this.Parament.modedit + '/' + this.Parament.mode + '/list.html',
			hideExpandTool:false,
			hideCollapsedContent:false,
			border:false
		});
		if(this.browsertype === 'bi'){
		    _layout.layout('add',{//添加新的layout
		        title: '新建-' + this.Parament.text,
			    region: 'east',
			    width: '30%',
			    maxWidth: '50%',
			    minWidth: 300,
			    href: 'client/SimpChinese/' + this.Parament.modedit + '/',
			    paramenters:this.Parament,
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
		var Paramenter = {};
		for(var i in options._Parament){
			switch(typeof(options._Parament[i])){
				case 'string':
					Paramenter[i.toLowerCase()] = options._Parament[i].toString().toLowerCase();
					break;
				case 'number':
					Paramenter[i.toLowerCase()] = options._Parament[i];
					break;
			}
		}
		Paramenter.id = 0;
		switch(options.browsertype){
			case 'bd':
				var tabsid = 'tabs_'+ebx.RndNum(20)
				ebx.center.tabs('add', {
					id: tabsid,
					title: '新建-' + options._Parament.text,
					href: 'client/SimpChinese/' + options._Parament.modedit + '/',
					paramenters:Paramenter,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
				break;
			case 'bi':
				ebx.EditStatusMessager(options._tabs.panel('options').editstatus, options._Parament.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditstatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: '30%',
						maxWidth: '50%',
						minWidth: 300,
						title: '新建-' + options._Parament.text,
						href: 'client/SimpChinese/' + options._Parament.modedit + '/',
						paramenters:Paramenter,
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
		var Paramenter = {};
		for(var i in options._Parament){
			switch(typeof(options._Parament[i])){
				case 'string':
					Paramenter[i.toLowerCase()] = options._Parament[i].toString().toLowerCase();
					break;
				case 'number':
					Paramenter[i.toLowerCase()] = options._Parament[i];
					break;
			}
		}
		Paramenter.id = rowData?rowData.id:0;
		switch(options.browsertype){
			case 'bd':
				var index = rowIndex;
					
				var tabsid = 'tabs_'+ebx.RndNum(20);
				
				ebx.center.tabs('add', {
					id: tabsid,
					title: '打开-' + options._Parament.text,
					href: 'client/SimpChinese/' + options._Parament.modedit + '/',
					paramenters:Paramenter,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
			
				break;
			case 'bi':
				var index = rowIndex;
					
				ebx.EditStatusMessager(options._tabs.panel('options').editstatus, options._Parament.text,function(){
					options._layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditstatus(options._tabs.panel('options'), false);
					options._layout.layout('add',{//添加新的layout
						region: 'east',
						width: '30%',
						maxWidth: '50%',
						minWidth: 300,
						title: '打开-' + options._Parament.text,
						href: 'client/SimpChinese/' + options._Parament.modedit + '/',
						paramenters:Paramenter,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
				break;
		}
	},
	_getsearchParament:function(browser, find, callback){//查询参数统一函数
		var datefrom = ebx.getbiribbonobj(browser.biribbon, 'datefrom', 'datetimebox'),
			dateto = ebx.getbiribbonobj(browser.biribbon, 'dateto', 'datetimebox'),
			isdeleted = ebx.getbiribbonobj(browser.biribbon, 'isdeleted', 'combobox'),
			isaudit = ebx.getbiribbonobj(browser.biribbon, 'isaudit', 'combobox'),
			_datefrom = datefrom?datefrom.datetimebox('getValue'):'',
			_dateto = dateto?dateto.datetimebox('getValue'):'',
			_isdeleted = isdeleted?isdeleted.combobox('getValue'):'',
			_isaudit = isaudit?isaudit.combobox('getValue'):'';
		
		browser.Parament.find = find;
		browser.Parament.datefrom = _datefrom;
		browser.Parament.dateto = _dateto;
		browser.Parament.isdeleted = _isdeleted;
		browser.Parament.isaudit = _isaudit;
		callback();
	},
	_search: function(browser, find){//搜索函数	
		browser._getsearchParament(browser, find, function(){
			browser.liststorage.datagrid('load', {
				template: browser.Parament.template,
				_:(new Date()).getTime(),
				find: escape(browser.Parament.find),
				datefrom: browser.Parament.datefrom,
				dateto: browser.Parament.dateto,
				isdeleted: browser.Parament.isdeleted,
				isaudit: browser.Parament.isaudit
			});
		});
	},
	_list: function(){//读取并显示list列表方法
		var browser = this,
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newbtn = $('<div>').appendTo(toolbar),
			functionbtn = $('<div>').appendTo(toolbar),
			_Parament = this.Parament,
			_liststorage = this.liststorage,
			_edit = this._edit,
			_deleted = this._deleted,
			_undeleted = this._undeleted,
			_new = this._new,
			_search = this._search,
			_getsearchParament = this._getsearchParament,
			_open = this._open,
			_layout = this.layout,
			_tabs = this.tabs,
			_showdate = this.showdate,
			_showAudit = this.showAudit,
			_browsertype = this.browsertype,
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
										_Parament: _Parament,
										browsertype: 'bi',
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
								    var id = ebx.validInt(_liststorage.datagrid('getSelected').id);
								    if(id <= 0)return;
								    _deleted(id, _Parament.modedit, function(result){
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
									var id = ebx.validInt(_liststorage.datagrid('getSelected').id);
									if(id <= 0)return;
									_undeleted(id, _Parament.modedit, function(result){
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
									
									_getsearchParament(browser, searchtext.textbox('getValue'), function(){
										$.ajax({
											type: 'post', 
											url: 'server/SimpChinese/'+ _Parament.provider +'/list/',
											data: browser.Parament,
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
							name:'isaudit',
							tools: [{
								text:'审核：',
								name:'isaudittext'
							},{
								type: 'combobox',
								name:'isaudit',
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
		
		if(!_showdate){
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
			var isaudittext = ebx.getbiribbonobj(_biribbon, 'isaudittext', 'linkbutton');
			if(isaudittext)isaudittext.hide();
			var isaudit = ebx.getbiribbonobj(_biribbon, 'isaudit', 'combobox');
			if(isaudit)isaudit.combobox('destroy');
			//biribbondata.tabs[0].groups[2].tools.splice(1, 1);
		}

		
		searchtext.searchbox({
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
					_Parament: _Parament,
					browsertype: _browsertype,
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
						_liststorage.datagrid('resize', {
							height:_listPanel.height()-_listPanel.find('.ribbon').height()
						});
					});
					//functionbtn.find('.l-btn-text').text('隐藏');
					functionbtn.find('.l-btn-icon').addClass('icon-uparrow').removeClass('icon-downarrow');
				}else{
					b.animate({height:0}, 300, function(){
						b.hide();
						_liststorage.datagrid('resize', {
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
			url: 'server/SimpChinese/'+ _Parament.provider +'/style/',
			data: {style:_Parament.style,_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					var datefrom = ebx.getbiribbonobj(_biribbon, 'datefrom', 'datetimebox'),
						dateto = ebx.getbiribbonobj(_biribbon, 'dateto', 'datetimebox'),
						_datefrom = datefrom?datefrom.datetimebox('getValue'):'',
						_dateto = dateto?dateto.datetimebox('getValue'):'',
						_isdeleted = ebx.getbiribbonobj(_biribbon, 'isdeleted', 'combobox').combobox('getValue'),
						isaudit = ebx.getbiribbonobj(_biribbon, 'isaudit', 'combobox'),
						_isaudit = -1;
						if(isaudit)_isaudit = isaudit.combobox('getValue')
					
					columnsData = [result.data];

					_getsearchParament(browser, searchtext.textbox('getValue'), function(){
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
							url:'server/SimpChinese/'+ _Parament.provider +'/list/',
							method:'post',
							queryParams: browser.Parament,
							toolbar: toolbar,
							multiSort:false,
							checkOnSelect:false,
							columns:columnsData,
							height: _listPanel.height()-_listPanel.find('.ribbon').height(),//'100%',
							width: '100%',
							onSelect: function(rowIndex, rowData){
								ebx.getbiribbonobj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:false,
									onClick: function(){
										var options = {
											_Parament: _Parament,
											browsertype: _browsertype,
											_tabs: _tabs,
											_layout: _layout
										};
										_edit(rowIndex, rowData, options);
									}
								});

								if(rowData.isdeleted && !rowData.auditid){
									ebx.getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									ebx.getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:false
									});
								}else if(!rowData.auditid){
									ebx.getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:false
									});
									ebx.getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}else{
									ebx.getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
										disabled:true
									});
									ebx.getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
										disabled:true
									});
								}
							},
							onClickCell:function(){},//禁用单元格编辑功能，防止双击后onDblClickRow事件失效 2018-7-15 zz
							onDblClickRow: function(rowIndex, rowData){
								var options = {
									_Parament: _Parament,
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
											_Parament: _Parament,
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
										_deleted(id, _Parament.modedit, function(result){
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
										_undeleted(id, _Parament.modedit, function(result){
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
								ebx.getbiribbonobj(browser.biribbon, 'edit', 'linkbutton').linkbutton({
									disabled:true
								});
								ebx.getbiribbonobj(browser.biribbon, 'del', 'linkbutton').linkbutton({
									disabled:true
								});
								ebx.getbiribbonobj(browser.biribbon, 'reload', 'linkbutton').linkbutton({
									disabled:true
								});
							}
						}).datagrid('renderformatterstyler');
						
						var isdeletedcombobox = ebx.getbiribbonobj(_biribbon, 'isdeleted', 'combobox');//绑定删除状态的onSelect
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
						
						var isauditcombobox = ebx.getbiribbonobj(_biribbon, 'isaudit', 'combobox');//绑定审核状态的onSelect
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

						var datefrom = ebx.getbiribbonobj(_biribbon, 'datefrom', 'datetimebox');//绑定开始日期的onHidePanel，支持回车触发
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

						var dateto = ebx.getbiribbonobj(_biribbon, 'dateto', 'datetimebox');//绑定结束日期的onHidePanel，支持回车触发
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
