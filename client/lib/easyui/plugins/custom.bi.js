ebx.bi = {//基本资料对象 2018-7-13 zz
	ID: 0,
	ParentID: 0,
	tabs: [],
	tab: [],
	layout: [],
	eastPanel: [],
	listPanel: [],
	mapitem: [],
	Paramet: {},
	biribbon: [],
	eaststorage: [],
	init: function(layoutName, callback){//初始化函数。参数：layoutName：初始化区域名称，包括：default，east，list，callback：回掉函数
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');

		switch(layoutName.toLowerCase()){
			case 'east':
				this.layout = this.tabs.find('.layout');
				this.eastPanel = this.layout.layout('panel', 'east');
				this.eaststorage = $('<div>').appendTo(this.eastPanel);
				this.Paramet = ebx.getMenuParameter(this.eastPanel);
				this.biribbon = $('<div>').appendTo(this.eastPanel);
				this.mapitem = $('<div>').appendTo(this.eastPanel),
				this._east();
				break;
			case 'list':
				this.layout = this.tabs.find('.layout');
				this.listPanel = this.layout.layout('panel', 'center');
				this.liststorage = $('<div>').appendTo(this.listPanel)
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._list()
				break;
			case 'default':
				this.layout = $('<div>').appendTo(this.tabs);
				this.Paramet = ebx.getMenuParameter(this.tabs);
				this._default();
				break;
		}
	},
	_default: function(){
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
	_edit: function(rowIndex, rowData, _Paramet, _layout, _tabs){
		var id = rowData?rowData.ID:'',
			index = rowIndex;

		ebx.EditStatusMessager(_tabs.panel('options').editstatus, _Paramet.text,function(){
			_layout.layout('remove', 'east');//删除编辑layout
			ebx.setEditstatus(_tabs.panel('options'), false);
			_layout.layout('add',{//添加新的layout
				region: 'east',
				width: 400,
				maxWidth: '50%',
				minWidth: 300,
				title: '',
				href: 'client/SimpChinese/' + _Paramet.mode + '/?text='+_Paramet.text+'&id=' + id + '&index=' + index + '&mode=' + _Paramet.mode,
				hideExpandTool: false,
				hideCollapsedContent: false,
				border: false,
				split: true
			});
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
			editbtn = $('<div>').appendTo(toolbar),
			delbtn = $('<div>').appendTo(toolbar),
			reloadbtn = $('<div>').appendTo(toolbar),
			_Paramet = this.Paramet,
			_liststorage = this.liststorage,
			_search = this._search,
			_edit = this._edit,
			_open = this._open,
			_layout = this.layout,
			_tabs = this.tabs,
			columnsData = [];
		
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
			reloadbtn.linkbutton({
				disabled:true,
				onClick: function(){}
			});
			delbtn.linkbutton({
				disabled:true,
				onClick: function(){}
			});
			editbtn.linkbutton({
				disabled:true,
				onClick: function(){}
			});
		})
				
		searchinput.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) {  
				_search(searchinput.textbox('getText'), _liststorage, _Paramet);
				reloadbtn.linkbutton({
					disabled:true,
					onClick: function(){}
				});
				delbtn.linkbutton({
					disabled:true,
					onClick: function(){}
				});
				editbtn.linkbutton({
					disabled:true,
					onClick: function(){}
				});
			}  
		});
				
		ImportExcelbtn.linkbutton({
			iconCls: 'icon-ImportExcel',
			plain:true,
			text:'导出',
			onClick:function(){
				var btn = $(this), 
					Parametdata;
					
				if(btn.linkbutton('options').disabled == true) return;
				btn.linkbutton('disable');
				var find = escape(searchinput.textbox('getText')),
					Parametdata = {template:_Paramet.template,_:(new Date()).getTime(),exportdata:1};
					
				if(find.length > 0){
					Parametdata.find = find;
				}

				$.ajax({
					type: 'post', 
					url: 'server/DataProvider/list/',
					data: Parametdata,
					dataType: "json",
					success: function(result){
						if(result){
							btn.linkbutton('enable');
							ebx.clipboardData(columnsData, result)
						}
					}
				});				
			}
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
				ebx.EditStatusMessager(_tabs.panel('options').editstatus, _Paramet.text,function(){
					_layout.layout('remove', 'east');//删除编辑layout
					ebx.setEditstatus(_tabs.panel('options'), false);
					_layout.layout('add',{//添加新的layout
						region: 'east',
						width: 400,
						maxWidth: '50%',
						minWidth: 300,
						title: '',
						href: 'client/SimpChinese/' + _Paramet.mode + '/?text='+_Paramet.text+'&mode=' + _Paramet.mode,
						hideExpandTool: false,
						hideCollapsedContent: false,
						border: false,
						split: true
					});
				});
			}
		});
		
		editbtn.linkbutton({
			iconCls: 'icon-DesignMode',
			plain:true,
			disabled:true,
			text:'编辑'
		});
		
		delbtn.linkbutton({
			iconCls: 'icon-Delete',
			plain:true,
			disabled:true,
			text:'删除'
		});

		reloadbtn.linkbutton({
			iconCls: 'icon-reload',
			plain:true,
			disabled:true,
			text:'恢复'
		});
				
		$.ajax({
			type: 'post', 
			url: 'server/DataProvider/style/',
			data: {style:_Paramet.style,_:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					columnsData = [ebx.UnescapeJson(result.data)];//转码所有嵌套json中文的escape
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
						onSelect: function(rowIndex, rowData){
							if(rowData.IsDeleted){
								reloadbtn.linkbutton({
									disabled:false
								});
								delbtn.linkbutton({
									disabled:true,
									onClick: function(){}
								});
								editbtn.linkbutton({
									disabled:false,
									onClick: function(){
										_edit(rowIndex, rowData, _Paramet, _layout, _tabs);
									}
								});
							}else{
								delbtn.linkbutton({
									disabled:false
								});
								reloadbtn.linkbutton({
									disabled:true,
									onClick: function(){}
								});
								editbtn.linkbutton({
									disabled:false,
									onClick: function(){
										_edit(rowIndex, rowData, _Paramet, _layout, _tabs);
									}
								});
							}
						},
						onClickRow: function(rowIndex, rowData){
						},
						onClickCell:function(){},//禁用单元格编辑功能，防止双击后onDblClickRow事件失效 2018-7-15 zz
						onDblClickRow: function(rowIndex, rowData){
							_edit(rowIndex, rowData, _Paramet, _layout, _tabs);
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
									_edit(rowIndex, rowData, _Paramet, _layout, _tabs);
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
						border:result.bd[0].Border,
						showFooter:result.bd[0].Footer,
						showHeader:result.bd[0].Header
					}).datagrid('renderformatterstyler');
				}
			}
		});		
	},
	_east: function(){//编辑对象
		var _layout = this.layout,
			_tabs = this.tabs,
			_tab = this.tab,
			_Paramet = this.Paramet,
			_mapitem = this.mapitem,
			_eaststorage = this.eaststorage,
			_eastPanel = this.eastPanel;
			
		this.biribbon.ribbon({
			data:{
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
							onClick: function(){
								var saveBtn = $(this);
								
								saveBtn.linkbutton('disable');
								
								var bi = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
									bistr = ebx.convertDicToJson(bi),
									parameter = {bi: bistr, _: (new Date()).getTime(), id: _Paramet.id};

								
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
											
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
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
							},
							menuItems:[{
								name:'saveas',
								text:'另存为',
								iconCls:'icon-FileSaveAs'
							}]
						},{
							type:'toolbar',
							dir:'v',
							tools:[{
								name:'new',
								text:'新建',
								iconCls:'tree-file',
								onClick: function(){
									setTimeout(function(){
										ebx.EditStatusMessager(_tabs.panel('options').editstatus, _Paramet.text,function(){
											_layout.layout('remove', 'east');//删除编辑layout
											ebx.setEditstatus(_tabs.panel('options'), false);
											_layout.layout('add',{//添加新的layout
												region: 'east',
												width: 400,
												maxWidth: '50%',
												minWidth: 300,
												title: '',
												href: 'client/SimpChinese/' + _Paramet.mode + '/?text='+_Paramet.text+'&mode=' + _Paramet.mode,
												hideExpandTool: false,
												hideCollapsedContent: false,
												border: false,
												split: true
											});
										});
									},0);
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
						title:'内容',
						tools:[{
							name:'paste',
							text:'粘贴',
							iconCls:'icon-Paste-large',
							iconAlign:'top',
							size:'large'
						},{
							name:'copy',
							text:'复制',
							iconCls:'icon-Copy-large',
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
								size:'large'
							}]
						}]
					}]
				}]
			},
			width:'100%',
			border: false,
			tools:[
				{
					iconCls:'icon-DeclineInvitation',
					handler:function(){
						ebx.EditStatusMessager(_tab.editstatus, _Paramet.text, function(){
							_layout.layout('remove', 'east');//删除编辑layout
							ebx.setEditstatus(_tab, false)
						});
					}
				}
			],
			plain:true
		}).css({'padding':0});
		
		this.mapitem.tabs({
			border:false,
			width:'100%',
			tabPosition:'bottom',
			height:this.eastPanel.height()-140,
			plain:true
		});
		
		this.mapitem.tabs('add', {
			title: '基本资料',
			content: this.eaststorage,
			selected: true
		});

		window.onresize = function() {//窗口高度发生变化时，自动调整tabs的高度 2018-4-22 zz
			setTimeout(function(){
				_mapitem.tabs('resize', {
					height:_eastPanel.height()-140
				});
				_eaststorage.propertygrid('resize');
			},200);
		}
		
		this.eaststorage.propertygrid({
			url: 'server/' + _Paramet.mode + '/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.Paramet.id},
			showGroup: true,
			width:'100%',
			height:'100%',
			border:false,
			showHeader: true,
			columns: [[
				{field:'name',title:'名称',width:100,resizable:true,sortable:true},
				{field:'value',title:'值',width:100,resizable:true}
			]]
		}).datagrid('renderformatterstyler');//启用显示式样回调函数

	}
}
