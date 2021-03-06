/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/16
基本资料公用对象，包括基本的内容和功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/
ebx.bi = {//基本资料对象 2018-7-13 zz
	id: 0,
	ParentId: 0,
	tabs: [],
	tab: [],
	layout: [],
	eastPanel: [],
	listPanel: [],
	mapItem: [],
	parament: {},
	biribbon: [],
	eastStorage: [],
	infoType:0,
	showLock: 0,//是否显示安全group
	init: function(callBack){//初始化函数。参数：layoutName：初始化区域名称，包括：east，callBack：回掉函数
		this.tabs = ebx.center.tabs('getSelected');
		this.tab = this.tabs.panel('options');
		this.layout = this.tabs.find('.layout');
		this.eastPanel = this.layout.layout('panel', 'east');
		
		var eastlayout = $('<div>').appendTo(this.eastPanel);
		eastlayout.layout({
			width:'100%',
			height:'100%'
		}).layout('add',{
			region: 'north',
			height: 113,    
			split: false,
			border:false
		}).layout('add',{
			region: 'center',  
			border:false
		});

		this.eastStorage = $('<div>').appendTo(eastlayout.layout('panel', 'center'));
		this.parament = ebx.getMenuparamenter(this.eastPanel);
		this.id = ebx.validInt(this.parament.id);
		if(ebx.validInt(this.parament.lock) == 1){
			this.showLock = 1;
		}
		this.biribbon = $('<div>').appendTo(eastlayout.layout('panel', 'north'));
		//this.mapItem = $('<div>').appendTo(eastlayout.layout('panel', 'center')),
		this._east(callBack);
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
	},
	_save:function(asSave, _layout, _parament, _tab, callBack){
		var bi = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
			biStr = ebx.convertDicToJson(bi),
			ParentId = asSave?_parament.id:0,
			saveText = asSave?'另存':'保存',
			paramenter = {bi: biStr, _: (new Date()).getTime(), id: _parament.id, parentid: ParentId};

		if(!ebx.checkedBdValidateBox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callBack();
			return;
		}
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
					var id = result.id;
					_parament.id = result.id;
					_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', saveText + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callBack();
				
			}
		});
	},
	_east: function(callBack){//编辑对象
		var bi = this,
		    _layout = this.layout,
			_tabs = this.tabs,
			_tab = this.tab,
			_parament = this.parament,
			_showLock = this.showLock,
			_mapItem = this.mapItem,
			_eastStorage = this.eastStorage,
			_eastPanel = this.eastPanel,
			_ID = _parament.id,
			_biribbon = this.biribbon,
			_save = this._save,
			_new = this._new;
			
		_biribbon.ribbon({
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
								var lockbtn = ebx.getBiribbonObj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn && _showLock == 1){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this)
								saveBtn.linkbutton('disable');
								_save(0, _layout, _parament, _tab, function(){
									if(lockbtn && _showLock == 1){
										lockbtn.find('.l-btn-icon').removeClass('icon-unLock-large').addClass('icon-Lock-large');
										lockbtn.linkbutton('unselect');
									}
									saveBtn.linkbutton('enable');
								})
							},
							menuItems:[{
								name:'saveas',
								text:'另存为',
								iconCls:'icon-FileSaveAs',
								onclick: function(){
									$.messager.confirm('提示', '是否需要另存？', function(r){
										if (r){
											_save(1, _layout, _parament, _tab, function(){ });
										}
									});
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
										browserType: 'bi',
										_tabs: _tabs,
										_layout: _layout
									}; 
									setTimeout(function(){
										_new(options);
									},0);
								}
							},{
								name:'deleted',
								text:'删除',
								iconCls:'icon-Delete',
								disable:true,
								onClick:function(){
									var btn = $(this),
										undeleted = ebx.getBiribbonObj(_biribbon, 'undeleted', 'linkbutton');
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
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eastStorage.datagrid('reload');
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
								onClick: function(){
									var btn = $(this),
										deleted = ebx.getBiribbonObj(_biribbon, 'deleted', 'linkbutton');
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
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eastStorage.datagrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '恢复失败！<br>' + JSON.stringify(result.msg), 'error');	
										}
									});
								}
							}]
						}]
					},
					/*{
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
					},*/
					{
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
									if(ebx.validInt(bi.id) == 0){
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
											bi.getAttachCount(bi.id, bi.infoType, Attach)
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
											id:bi.id,
											billType:bi.infoType,
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
											window.open(window.location.protocol +'//'+ window.location.host + ':' + window.location.port + '/attaches/' + bi.infoType + '/' + bi.id + '/' + row.filename);
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
													window.open(window.location.protocol +'//'+ window.location.host + '/attaches/' + bi.infoType + '/' + bi.id + '/' + rowData.filename);
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
																	id:bi.id,
																	billType:bi.infoType,
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
													id:bi.id,
													billType:bi.infoType,
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
															id:bi.id,
															billType:bi.infoType,
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
											window.open(window.location.protocol +'//'+ window.location.host + '/attaches/' + bi.infoType + '/' + bi.id + '/' + filegrId.datagrid('getSelected').filename);
										}
									});
								}
							}]
						}]
					}
					/*,{
						title:'关闭',
						tools:[{
							iconCls:'icon-DeclineInvitation',
							onClick:function(){
								ebx.editStatusMessager(_tab.editstatus, _parament.text, function(){
									setTimeout(function(){
										_layout.layout('remove', 'east');//删除编辑layout
									},0);
									ebx.setEditStatus(_tab, false)
								});
							}
						}]
					}*/
					]
				}]
			},
			width:'100%',
			border: false,
			showHeader: false,
			tools:[
				{
					iconCls:'icon-DeclineInvitation',
					handler:function(){
						ebx.editStatusMessager(_tab.editstatus, _parament.text, function(){
							_layout.layout('remove', 'east');//删除编辑layout
							ebx.setEditStatus(_tab, false)
						});
					}
				}
			],
			plain:true
		}).css({'padding':0});

		if(_showLock == 0){
			var lockgroup = ebx.getBiribbonObj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
		if(this.infoType == 0){
			var Attach = ebx.getBiribbonObj(_biribbon, '附件', 'toolbar');
			if(Attach){
				Attach.next().hide();
				Attach.hide();
			}
		}else{
			if(this.id > 0){
				var Attach = ebx.getBiribbonObj(_biribbon, '附件', 'toolbar');
				this.getAttachCount(this.id, this.infoType, Attach)
			}
		}
		_eastStorage.propertygrid({
			url: 'server/SimpChinese/' + _parament.modedit + '/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.parament.id},
			height:'100%',
			showGroup: true,
			border:false,
			singleSelect: true,
			lastinsertRow:false,
			columns: [[
				{field:'name',title:'名称',width:100,resizable:true,sortable:true},
				{field:'value',title:'值',width:100,resizable:true}
			]],
			showHeader: true,
			onLoadSuccess: function(data){
				var onLoadSuccessfn = _eastStorage.propertygrid('options').onLoadSuccess,
					deleted = ebx.getBiribbonObj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.getBiribbonObj(_biribbon, 'undeleted', 'linkbutton');
					
				if(undeleted)undeleted.linkbutton('disable');
				if(deleted)deleted.linkbutton('disable');
				
				for(var i in data.rows){
					if(data.rows[i].field == '_isDeleted'){
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
	getAttachCount: function(id, infoType, obj){
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/attaches/getattachcount/',
			data: {_:(new Date()).getTime(),id:id,billType:infoType},
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
