/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/16
基本资料公用对象，包括基本的内容和功能按钮模块的加载，支持保存、编辑、删除等功能

*****************************************************************/
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
	init: function(layoutName, callback){//初始化函数。参数：layoutName：初始化区域名称，包括：east，callback：回掉函数
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
		}
	},
	_east: function(){//编辑对象
		var _layout = this.layout,
			_tabs = this.tabs,
			_tab = this.tab,
			_Paramet = this.Paramet,
			_mapitem = this.mapitem,
			_eaststorage = this.eaststorage,
			_eastPanel = this.eastPanel,
			_ID = this.ID,
			_biribbon = this.biribbon;
			
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
									url: 'server/SimpChinese/' + _Paramet.mode + '/save/',
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
											$.messager.alert('错误', '保存失败！<br>' + result.msg.message, 'error');	
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
									var options = {
										_Paramet: _Paramet,
										browsertype: 'bi',
										_tabs: _tabs,
										_layout: _layout
									}; 
									setTimeout(function(){
										ebx.browser._new(options);
									},0);
								}
							},{
								name:'deleted',
								text:'删除',
								iconCls:'icon-Delete',
								onClick:function(){
									var btn = $(this),
										undeleted = ebx.browser._getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
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
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eaststorage.datagrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '删除失败！<br>' + result.msg, 'error');
										}
									});
								}
							},{
								name:'undeleted',
								text:'恢复',
								iconCls:'icon-reload',
								onClick: function(){
									var btn = $(this),
										deleted = ebx.browser._getbiribbonobj(_biribbon, 'deleted', 'linkbutton');
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
											_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
											_eaststorage.datagrid('reload');
											//_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
										}else{
											$.messager.alert('错误', '恢复失败！<br>' + result.msg, 'error');	
										}
									});
								}
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
					},{
						title:'关闭',
						tools:[{
							iconCls:'icon-DeclineInvitation',
							onClick:function(){
								ebx.EditStatusMessager(_tab.editstatus, _Paramet.text, function(){
									setTimeout(function(){
										_layout.layout('remove', 'east');//删除编辑layout
									},0);
									ebx.setEditstatus(_tab, false)
								});
							}
						}]
					}]
				}]
			},
			width:'100%',
			border: false,
			showHeader: false,
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
			height:this.eastPanel.height()-this.eastPanel.find('.ribbon').height(),
			plain:true,
			showHeader: false
		});
		
		this.mapitem.tabs('add', {
			title: '基本资料',
			content: _eaststorage,
			selected: true
		});
		
		var onresize = window.onresize;
		window.onresize = function() {//窗口高度发生变化时，自动调整tabs的高度 2018-4-22 zz
			setTimeout(function(){
				try{
					_mapitem.tabs('resize', {
						height:_eastPanel.height()-_eastPanel.find('.ribbon').height()
					});
					_eaststorage.propertygrid('resize');
				}catch(e){}
			},200);
			onresize();
		}
		
		_eaststorage.propertygrid({
			url: 'server/SimpChinese/' + _Paramet.mode + '/load/',
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
				var onLoadSuccessfn = _eaststorage.propertygrid('options').onLoadSuccess,
					deleted = ebx.browser._getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.browser._getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
					
				for(var i in data.rows){
					if(data.rows[i].field == 'id'){
						_ID = ebx.validInt(data.rows[i].value);
					}
					if(data.rows[i].field == '_isdeleted'){
						if(ebx.validInt(data.rows[i].value) == 0){
							if(undeleted)undeleted.linkbutton('disable');
							if(deleted)deleted.linkbutton('enable');
						}else{
							if(deleted)deleted.linkbutton('disable');
							if(undeleted)undeleted.linkbutton('enable');
						}
					}
				}
				if(_ID == 0){
					if(undeleted)undeleted.linkbutton('disable');
					if(deleted)deleted.linkbutton('disable');
				}
			}
		}).datagrid('renderformatterstyler');//启用显示式样回调函数

	}
}
