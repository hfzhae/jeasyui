ebx.bd = {//单据对象 2018-7-9 zz
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
	init: function(layoutName, callback){//单据初始化函数。参数：layoutName：初始化区域名称，包括：default，center，east，north，list，browser，callback：回掉函数
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.Paramet = ebx.getMenuParameter(this.tabs);
		
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
				this._east();
				break;
			case 'center':
				this.layout = this.tabs.find('.layout');
				this.centerPanel = this.layout.layout('panel', 'center');
				this.centerstorage = $('<div>').appendTo(this.centerPanel);
				this._center(callback);
				break;
			case 'default':
				this.layout = $('<div>').appendTo(this.tabs)
				this._default();
				break;
			case 'list':
				this.layout = this.tabs.find('.layout');
				this.listPanel = this.layout.layout('panel', 'center');
				this.liststorage = $('<div>').appendTo(this.listPanel)
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._list()
				break;
			case 'browser':
				this.layout = $('<div>').appendTo(this.tabs);
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._browser();
				break;
		}
	},
	_browser: function(){
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
	_newbd: function(rowIndex, rowData){
		var e,
			id = rowData?rowData.ID:'',
			index = rowIndex,
			eastwidth = Paramet.eastwidth!='undefined'?Paramet.eastwidth:400,//获取菜单中编辑面板的宽度参数，默认400，-1打开新tabs
			setEast = function(){
				layout.layout('add',{//添加新的layout
					region: 'east',
					width: eastwidth,
					maxWidth: '50%',
					minWidth: 300,
					title: '',
					href: 'client/SimpChinese/' + e + '/?text='+Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + Paramet.mode,
					hideExpandTool: false,
					hideCollapsedContent: false,
					border: false,
					split: true
				});
			};
			
		if(Paramet.edit == 'undefined' || Paramet.edit == ''){//判断菜单参数
			e = "browser/biedit";//如果没有edit参数，赋值默认编辑地址
		}else{
			e = Paramet.edit;//如果有edit参数，赋值参数编辑地址
		}
		if(ebx.validInt(eastwidth) == -1){//在新tabs中打开页面
			var tabsid = 'tabs_'+ebx.RndNum(20)
			ebx.center.tabs('add', {
				id: tabsid,
				title: ebx.unescapeEx(Paramet.text),
				href: 'client/SimpChinese/' + e + '/?text='+Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + Paramet.mode +'&style=' + Paramet.style + '&template=' + Paramet.template,
				//iconCls:node.iconCls,
				selected: true,
				closable:true
			});
			//$('#'+tabsid).css({padding:0});
		}else{
			ebx.EditStatusMessager(tabs.panel('options').editstatus,Paramet.text,function(){
				layout.layout('remove', 'east');//删除编辑layout
				tabs.panel('options').editstatus = false;
				setEast();
			});
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
			minWidth: 300,
			title: '基本信息',
			href: 'client/SimpChinese/' + this.Paramet.mode + '/east.html',
			hideExpandTool: false,
			hideCollapsedContent: false,
			border: false,
			split: true
		}).layout('add', {
			region: 'north',
			height: 140,
			href: 'client/SimpChinese/' + this.Paramet.mode + '/north.html',
			border: false,
			split: false
		});
	},
	_center: function(callback){//单据表体对象
		var _centerstorage = this.centerstorage,
			_Paramet = this.Paramet;
		$.ajax({
			type: 'post', 
			url: 'server/DataProvider/style/',
			data: {style:_Paramet.mode+'list',_:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					columnsData = [ebx.UnescapeJson(result.data)];//转码所有嵌套json中文的escape
					callback(columnsData, _centerstorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
										
					_centerstorage.datagrid({
						view:scrollview,//行操作存在bug，不能使用
						pageSize:ebx.pagesize,
						remoteSort:false,
						rownumbers:true,
						singleSelect:true,
						pagination:false,
						border:false,
						fit:false,
						fitColumns:false,
						striped:true,
						url:'server/'+_Paramet.mode+'/center/',
						nowrap:true,//禁用自动换行
						method:'post',
						queryParams:{_:(new Date()).getTime(),id:_Paramet.id},
						multiSort:false,
						checkOnSelect:false,
						columns:columnsData,
						height: '100%',
						border:result.bd[0].Border,
						showFooter:result.bd[0].Footer,
						showHeader:result.bd[0].Header
					}).datagrid('renderformatterstyler');//启用显示式样回调函数
				}
			}
		});
	},
	_search: function(s, _liststorage, _Paramet){//搜索函数
		_liststorage.datagrid('load', {
			template:_Paramet.template,
			_:(new Date()).getTime(),
			find: escape(s)
		});
	},
	_list: function(){//读取并显示list列表方法
		var toolbar = $('<div>'),
			delcombobox = $('<div>').appendTo(toolbar),
			searchinput = $('<div>').appendTo(toolbar),
			ImportExcelbtn = $('<div>').appendTo(toolbar),
			ExportExcel = $('<div>').appendTo(toolbar),
			ExportExcelbox = $('<div>'),
			newbtn = $('<div>').appendTo(toolbar),
			_Paramet = this.Paramet,
			_liststorage = this.liststorage,
			_search = this._search,
			_open = this._open,
			_layout = this.layout,
			_tabs = this.tabs;

		delcombobox.combobox({
			data:[{
				"id":1,
				"text":"已删除"
			},{
				"id":2,
				"text":"未删除"
			},{
				"id":3,
				"text":"全部",
				"selected":true
			}],
			valueField:'id',
			textField:'text',
			panelHeight:'auto',
			width:'65xp',
			editable:false
		});
		
		searchinput.textbox({
			buttonText:'搜索',
			iconCls:'icon-ZoomClassic_custom',
			plain:true,
			iconAlign:'left'
		});
		
		searchinput.textbox('button').on('click', function(){
			_search(searchinput.textbox('getText'), _liststorage, _Paramet);
		})
				
		searchinput.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) {  
				_search(searchinput.textbox('getText'), _liststorage, _Paramet);
			}  
		});
				
		ImportExcelbtn.linkbutton({
			iconCls: 'icon-ImportExcel',
			plain:true,
			text:'导出'
		});
		
		ExportExcelbox.menu({
			width:100
		}).menu('appendItem', {
			text: '下载模板',
			iconCls: 'icon-FileSaveAsExcelXlsx'
		});

		ExportExcel.splitbutton({
			iconCls: 'icon-ExportExcel',
			text: '导入',
			menu: ExportExcelbox
		});
		
		newbtn.linkbutton({
			iconCls: 'icon-file',
			plain:true,
			text:'新建',
			onClick: function(){
				var tabsid = 'tabs_'+ebx.RndNum(20)
				ebx.center.tabs('add', {
					id: tabsid,
					title: ebx.unescapeEx(_Paramet.text),
					href: 'client/SimpChinese/' + _Paramet.mode + '/?text='+_Paramet.text+'&mode=' + _Paramet.mode +'&style=' + _Paramet.style + '&template=' + _Paramet.template,
					//iconCls:node.iconCls,
					selected: true,
					closable:true
				});
			}
		});
		
		$.ajax({
			type: 'post', 
			url: 'server/DataProvider/style/',
			data: {style:_Paramet.style,_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					var columnsData = [ebx.UnescapeJson(result.data)];//转码所有嵌套json中文的escape
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
						url:'server/DataProvider/list/',
						method:'post',
						queryParams:{template:_Paramet.template,_:(new Date()).getTime()},
						toolbar: toolbar,
						multiSort:false,
						checkOnSelect:false,
						columns:columnsData,
						height: '100%',
						onClickRow: function(rowIndex, rowData){
							var id = rowData?rowData.ID:'',
								index = rowIndex;

								
							var tabsid = 'tabs_'+ebx.RndNum(20)
							ebx.center.tabs('add', {
								id: tabsid,
								title: ebx.unescapeEx(_Paramet.text),
								href: 'client/SimpChinese/' + _Paramet.mode + '/?text='+_Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + _Paramet.mode +'&style=' + _Paramet.style + '&template=' + _Paramet.template,
								//iconCls:node.iconCls,
								selected: true,
								closable:true
							});
						},
						border:result.bd[0].Border,
						showFooter:result.bd[0].Footer,
						showHeader:result.bd[0].Header
					}).datagrid('renderformatterstyler');
				}
			}
		});		
	},
	_east: function(){//单据属性对象
		this.eaststorage.propertygrid({
			url: 'server/'+this.Paramet.mode+'/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.Paramet.id},
			showGroup: true,
			width:'100%',
			height:'100%',
			border:false,
			columns: [[
				{field:'name',title:'名称',width:100,resizable:true,sortable:true},
				{field:'value',title:'值',width:100,resizable:true}
			]],
			showHeader: true
		}).datagrid('renderformatterstyler');//启用显示式样回调函数
	},
	_north: function (){//单据表头按钮对象 2018-7-9 zz
		var bd = this,
			_layout = this.layout,
			_Paramet = this.Paramet,
			_tabs = bd.tabs,
			_tab = this.tab,
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
									console.log(_layout)
								}
							}],
							onClick: function(){
								var saveBtn = $(this);
								
								saveBtn.linkbutton('disable');
								
								var bdlist = _layout.layout('panel', 'center').find('.datagrid-f').datagrid('getData'),
									bd = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
									bdliststr =  ebx.convertDicToJson(bdlist),
									bdstr = ebx.convertDicToJson(bd),
									parameter = {bd: bdstr, bdlist: bdliststr, _: (new Date()).getTime(), id: _Paramet.id};

								if(bdlist.total == 0){
									$.messager.show({
										title: '错误',
										msg: '保存失败！表格不能为空。',
										timeout: 3000,
										showType: 'slide'
									});	
									saveBtn.linkbutton('enable');
									return;
								}
								
								if(!ebx.checkedBDvalidatebox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
									saveBtn.linkbutton('enable');
									return;
								}
								
								$.ajax({
									type: 'post', 
									url: 'server/' + _Paramet.mode + '/save/',
									data: parameter,
									dataType: "json",
									success: function(result){
										//console.log(result);
										if(result.result){
											$.messager.show({
												title: '提示',
												msg: '保存成功！',
												timeout: 3000,
												showType: 'slide'
											});	
											ebx.setEditstatus(_tab, false);
											var id = result.id;
											
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime(), page:1, rows: ebx.pagesize});
											_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
											
										}else{
											$.messager.show({
												title: '错误',
												msg: '保存失败！' + ebx.unescapeEx(result.msg.message),
												timeout: 5000,
												showType: 'slide'
											});	
										}
										saveBtn.linkbutton('enable');
										
									}
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
									ebx.biedit();
								}
							},{
								name:'delete',
								text:'删除',
								iconCls:'icon-Delete'
							},{
								name:'recovery',
								text:'恢复',
								iconCls:'icon-reload'
							}]
						}]
					},{
						title:'行操作',
						tools:[{
							name:'copy',
							text:'新行',
							iconCls:'icon-CellsInsertDialog-large',
							iconAlign:'top',
							size:'large',
							onClick:function(){
								var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
									opts = listdatagrid.datagrid('options');
								
								opts.editIndex = listdatagrid.datagrid('getData').total;
								listdatagrid.datagrid('appendRow',{});
								listdatagrid.datagrid('scrollTo', listdatagrid.datagrid('getData').total - 1);//滚动到新增的行
								listdatagrid.datagrid('selectRow', listdatagrid.datagrid('getData').total - 1);
								listdatagrid.datagrid('editkeyboard', {index: listdatagrid.datagrid('getData').total - 1, field: listdatagrid.datagrid('options').columns[0][0].field}); //自动触发编辑第一个字段
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
									listdatagrid.datagrid('deleteRow', index);

									if(index >= listdatagrid.datagrid('getData').total && index > 0) index--;
									
									if(listdatagrid.datagrid('getData').total == 0 || index < 0){
										listdatagrid.datagrid('load', { total: 0, rows: [] }); 
									}else{
										listdatagrid.datagrid('selectRow', index);
									}
									
									ebx.setEditstatus(_tab, true);
								}
							},{
								name:'empty',
								text:'清空',
								iconCls:'icon-TableDelete',
								onClick:function(){
									var listdatagrid = _layout.layout('panel', 'center').find('.datagrid-f'),
										total = listdatagrid.datagrid('getData').total;
									listdatagrid.datagrid('load', { total: 0, rows: [] }); 
									ebx.setEditstatus(_tab, true)
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
								size:'large'
							}]
						}]
					}]
				}]
			};
			
		this.biribbon.ribbon({
			data:data,
			width:'100%',
			height:'100%',
			border: false,
			plain:true
		});
	}
}
