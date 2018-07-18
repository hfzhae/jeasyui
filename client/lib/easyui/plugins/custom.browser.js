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
					title: ebx.unescapeEx(options._Paramet.text),
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
						minWidth: 300,
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
	_edit: function(rowIndex, rowData, options){
		switch(options.browsertype){
			case 'bd':
				var id = rowData?rowData.id:'',
					index = rowIndex;
					
				var tabsid = 'tabs_'+ebx.RndNum(20)
				
				ebx.center.tabs('add', {
					id: tabsid,
					title: ebx.unescapeEx(options._Paramet.text),
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
						minWidth: 300,
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
	_getsearchParamet:function(bd, callback){//查询参数统一函数
		var searchtextbox = bd._getbiribbonobj(bd.biribbon, 'searchtextbox', 'textbox'),
			datefrom = bd._getbiribbonobj(bd.biribbon, 'datefrom', 'datetimebox'),
			dateto = bd._getbiribbonobj(bd.biribbon, 'dateto', 'datetimebox'),
			isdeleted = bd._getbiribbonobj(bd.biribbon, 'isdeleted', 'combobox'),
			isaudit = bd._getbiribbonobj(bd.biribbon, 'isaudit', 'combobox'),
			_searchtextbox = searchtextbox?searchtextbox.textbox('getValue'):'',
			_datefrom = datefrom?datefrom.datetimebox('getValue'):'',
			_dateto = dateto?dateto.datetimebox('getValue'):'',
			_isdeleted = isdeleted?isdeleted.combobox('getValue'):'',
			_isaudit = isaudit?isaudit.combobox('getValue'):'';
		
		bd.Paramet.find = escape(_searchtextbox);
		bd.Paramet.datefrom = _datefrom;
		bd.Paramet.dateto = _dateto;
		bd.Paramet.isdeleted = _isdeleted;
		bd.Paramet.isaudit = _isaudit;
		callback();
	},
	_search: function(bd){//搜索函数	
		bd._getsearchParamet(bd, function(){
			bd.liststorage.datagrid('load', {
				template: bd.Paramet.template,
				_:(new Date()).getTime(),
				find: bd.Paramet.find,
				datefrom: bd.Paramet.datefrom,
				dateto: bd.Paramet.dateto,
				isdeleted: bd.Paramet.isdeleted,
				isaudit: bd.Paramet.isaudit
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
		var bd = this,
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			_Paramet = this.Paramet,
			_liststorage = this.liststorage,
			_edit = this._edit,
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
							name:'save',
							text:'新建',
							iconCls:'icon-file-large',
							iconAlign:'top',
							size:'large',
							onClick: function(){
								var options = {
									_Paramet: _Paramet,
									browsertype: _browsertype,
									_tabs: _tabs,
									_layout: _layout
								}; 
								_new(options);
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
								name:'del',
								text:'删除',
								iconCls:'icon-Delete',
								disabled: true
							},{
								name:'reload',
								text:'恢复',
								iconCls:'icon-reload',
								disabled: true
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
									
									_getsearchParamet(bd, function(){
										$.ajax({
											type: 'post', 
											url: 'server/SimpChinese/DataProvider/list/',
											data: bd.Paramet,
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
						title:'状态和条件',
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
						},{
							type:'toolbar',
							tools: [{
								type:'textbox',
								name:'searchtextbox',
								//buttonText:'搜索',
								width:135,
								iconCls:'icon-ZoomClassic_custom',
								plain:true,
								iconAlign:'left'
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
					},{
						type:'toolbar',
						title:'搜索',
						tools:[{
							//text:'搜索',
							name:'searchbtn',
							iconCls:'icon-ZoomClassic_custom-large',
							//iconAlign:'top',
							size:'large'
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
		
		var searchtextbox = _getbiribbonobj(_biribbon, 'searchtextbox', 'textbox');
		if(searchtextbox){
			searchtextbox.textbox('textbox').bind('keydown', function(e) {  
				if (e.keyCode == 13) {  
					_search(bd);
					
					_biribbon.find('.icon-reload').parent().parent().linkbutton({
						disabled:true,
						onClick: function(){}
					});
					_biribbon.find('.icon-Delete').parent().parent().linkbutton({
						disabled:true,
						onClick: function(){}
					});
					_biribbon.find('.icon-DesignMode').parent().parent().linkbutton({
						disabled:true,
						onClick: function(){}
					});
				}  
			});
		}
		
		//var searchbtn = _getbiribbonobj(_biribbon, '搜索', 'textbox-button');
		var searchbtn = _getbiribbonobj(_biribbon, 'searchbtn', 'linkbutton');
		if(searchbtn){
			searchbtn.on('click', function(e) {  
				_search(bd);
				
				_biribbon.find('.icon-reload').parent().parent().linkbutton({
					disabled:true,
					onClick: function(){}
				});
				_biribbon.find('.icon-Delete').parent().parent().linkbutton({
					disabled:true,
					onClick: function(){}
				});
				_biribbon.find('.icon-DesignMode').parent().parent().linkbutton({
					disabled:true,
					onClick: function(){}
				});
			});
		}
		searchtext.textbox({
			buttonText:'搜索',
			iconCls:'icon-ZoomClassic_custom',
			iconAlign:'left',
			width:'100%'
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
					
					columnsData = [ebx.UnescapeJson(result.data)];//转码所有嵌套json中文的escape
					
					_getsearchParamet(bd, function(){
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
							queryParams: bd.Paramet,
							//toolbar: toolbar,
							multiSort:false,
							checkOnSelect:false,
							columns:columnsData,
							height: _listPanel.height()-_listPanel.find('.ribbon').height(),//'100%',
							width: '100%',
							onSelect: function(rowIndex, rowData){
								_biribbon.find('.icon-DesignMode').parent().parent().linkbutton({
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
								
								if(rowData.isdeleted){
									_biribbon.find('.icon-reload').parent().parent().linkbutton({
										disabled:false
									});
									_biribbon.find('.icon-Delete').parent().parent().linkbutton({
										disabled:true,
										onClick: function(){}
									});
								}else{
									_biribbon.find('.icon-Delete').parent().parent().linkbutton({
										disabled:false
									});
									_biribbon.find('.icon-reload').parent().parent().linkbutton({
										disabled:true,
										onClick: function(){}
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
									disabled:rowData.IsDeleted?true:false,
									onclick:function(){
										console.log(rowIndex);
										console.log(rowData);
									}
								}).menu('appendItem', {
									text: '恢复',
									iconCls: 'icon-reload',
									disabled:rowData.IsDeleted?false:true,
									onclick:function(){
										console.log(rowIndex);
										console.log(rowData);
									}
								}).menu('show', {
									left: e.pageX,
									top: e.pageY
								});

							},
							border:result.bd[0].border,
							showFooter:result.bd[0].footer,
							showHeader:result.bd[0].header
						}).datagrid('renderformatterstyler');
						
						/*combobox的onChange初始化时也会加再一次，临时禁用
						var isdeletedcombobox = _getbiribbonobj(_biribbon, 'isdeleted', 'combobox');
						if(isdeletedcombobox){
							isdeletedcombobox.combobox({
								onChange: function(newValue, oldValue){
									var datefrom = _getbiribbonobj(_biribbon, 'datefrom', 'datetimebox'),
										dateto = _getbiribbonobj(_biribbon, 'dateto', 'datetimebox'),
										find = _getbiribbonobj(_biribbon, 'searchtextbox', 'textbox'),
										isaudit = _getbiribbonobj(_biribbon, 'isaudit', 'combobox');
									
									_Paramet.isdeleted = newValue;
									if(isaudit)_Paramet.isaudit = isaudit.combobox('getValue');
									_Paramet.datefrom = datefrom?datefrom.datetimebox('getValue'):'';
									_Paramet.dateto = dateto?dateto.datetimebox('getValue'):'';

									_search(find.textbox('getValue'), _liststorage, _Paramet);
								}
							});
						}
						*/
						/*combobox的onChange初始化时也会加再一次，临时禁用
						var isauditcombobox = _getbiribbonobj(_biribbon, 'isaudit', 'combobox');
						if(isauditcombobox){
							isauditcombobox.combobox({
								onChange: function(newValue, oldValue){
									var datefrom = _getbiribbonobj(_biribbon, 'datefrom', 'datetimebox'),
										dateto = _getbiribbonobj(_biribbon, 'dateto', 'datetimebox'),
										isdeleted = _getbiribbonobj(_biribbon, 'isdeleted', 'combobox'),
										find = _getbiribbonobj(_biribbon, 'searchtextbox', 'textbox');
									
									_Paramet.isdeleted = isdeleted?isdeleted.combobox('getValue'):0;
									_Paramet.isaudit = newValue;
									_Paramet.datefrom = datefrom?datefrom.datetimebox('getValue'):'';
									_Paramet.dateto = dateto?dateto.datetimebox('getValue'):'';

									_search(find.textbox('getValue'), _liststorage, _Paramet);
								}
							});
						}
						*/
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
					_liststorage.datagrid('resize');
				}catch(e){}
			},200);
			onresize();
		}
	},
}
