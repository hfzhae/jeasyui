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
	Parament: {},
	biribbon: [],
	eaststorage: [],
	showLock: 0,//是否显示安全group
	init: function(callback){//初始化函数。参数：layoutName：初始化区域名称，包括：east，callback：回掉函数
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
			width:'100%',
			height: 114,    
			split: false,
			border:false
		}).layout('add',{
			region: 'center',  
			split: false,
			border:false
		});
		
		this.eaststorage = $('<div>').appendTo(eastlayout.layout('panel', 'center'));
		this.Parament = ebx.getMenuParamenter(this.eastPanel);
		if(ebx.validInt(this.Parament.lock) == 1){
			this.showLock = 1;
		}
		this.biribbon = $('<div>').appendTo(eastlayout.layout('panel', 'north'));
		//this.mapitem = $('<div>').appendTo(eastlayout.layout('panel', 'center')),
		this._east(callback);
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
		ebx.EditStatusMessager(options._tabs.panel('options').editstatus, options._Parament.text,function(){
			options._layout.layout('remove', 'east');//删除编辑layout
			ebx.setEditstatus(options._tabs.panel('options'), false);
			options._layout.layout('add',{//添加新的layout
				region: 'east',
				width: '30%',
				maxWidth: '50%',
				minWidth: 300,
				title: '',
				href: 'client/SimpChinese/' + options._Parament.modedit + '/',
				paramenters:Paramenter,
				hideExpandTool: false,
				hideCollapsedContent: false,
				border: false,
				split: true
			});
		});
	},
	_save:function(asSave, _layout, _Parament, _tab, callback){
		var bi = _layout.layout('panel', 'east').find('.datagrid-f').datagrid('getData'),
			bistr = ebx.convertDicToJson(bi),
			ParentID = asSave?_Parament.id:0,
			savetext = asSave?'另存':'保存',
			Paramenter = {bi: bistr, _: (new Date()).getTime(), id: _Parament.id, parentid: ParentID};

		if(!ebx.checkedBDvalidatebox(_layout.layout('panel', 'east').find('.datagrid-f'))){//校验BD输入的内容
			callback();
			return;
		}
		$.messager.progress({title:'正在保存...',text:''}); 
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + _Parament.modedit + '/save/',
			data: Paramenter,
			dataType: "json",
			success: function(result){
				$.messager.progress('close');
				if(result.result){
					$.messager.show({
						title: '提示',
						msg: savetext + '成功！',
						timeout: 3000,
						showType: 'slide'
					});	
					ebx.setEditstatus(_tab, false);
					var id = result.id;
					_Parament.id = result.id;
					_layout.layout('panel', 'center').find('.datagrid-f').datagrid('reload');
					_layout.layout('panel', 'east').find('.datagrid-f').datagrid('load', {id:id, _:(new Date()).getTime()});
					
				}else{
					$.messager.alert('错误', savetext + '失败！<br>' + JSON.stringify(result.msg), 'error');	
				}
				callback();
				
			}
		});
	},
	_east: function(callback){//编辑对象
		var _layout = this.layout,
			_tabs = this.tabs,
			_tab = this.tab,
			_Parament = this.Parament,
			_showLock = this.showLock,
			_mapitem = this.mapitem,
			_eaststorage = this.eaststorage,
			_eastPanel = this.eastPanel,
			_ID = _Parament.id,
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
								var lockbtn = ebx.getbiribbonobj(_biribbon, 'lock', 'linkbutton');
								if(lockbtn && _showLock == 1){
									if(lockbtn.find('.l-btn-icon').hasClass('icon-Lock-large')){
										$.messager.alert('提醒', '编辑锁为锁定状态，请点击解锁后再保存。', 'warning');
										lockbtn.linkbutton('select');
										return;
									}
								}
								var saveBtn = $(this)
								saveBtn.linkbutton('disable');
								_save(0, _layout, _Parament, _tab, function(){
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
											_save(1, _layout, _Parament, _tab, function(){ });
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
								name:'deleted',
								text:'删除',
								iconCls:'icon-Delete',
								disable:true,
								onClick:function(){
									var btn = $(this),
										undeleted = ebx.getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
									ebx.browser._deleted(_ID, _Parament.modedit, function(result){
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
										deleted = ebx.getbiribbonobj(_biribbon, 'deleted', 'linkbutton');
									ebx.browser._undeleted(_ID, _Parament.modedit, function(result){
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
						title:'关闭',
						tools:[{
							iconCls:'icon-DeclineInvitation',
							onClick:function(){
								ebx.EditStatusMessager(_tab.editstatus, _Parament.text, function(){
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
						ebx.EditStatusMessager(_tab.editstatus, _Parament.text, function(){
							_layout.layout('remove', 'east');//删除编辑layout
							ebx.setEditstatus(_tab, false)
						});
					}
				}
			],
			plain:true
		}).css({'padding':0});

		if(_showLock == 0){
			var lockgroup = ebx.getbiribbonobj(_biribbon, '安全', 'toolbar');
			if(lockgroup){
				lockgroup.next().hide();
				lockgroup.hide();
			}
		}
		
		/*
		this.mapitem.tabs({
			border:false,
			width:'100%',
			hiegth:'100%',
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
		*/
		_eaststorage.propertygrid({
			url: 'server/SimpChinese/' + _Parament.modedit + '/load/',
			method:'post',
			queryParams:{_:(new Date()).getTime(),id:this.Parament.id},
			showGroup: true,
			//width:'100%',
			height:'100%',
			border:false,
			singleSelect: true,
			lastinsertRow:false,
			columns: [[
				{field:'name',title:'名称',width:100,resizable:true,sortable:true},
				{field:'value',title:'值',width:100,resizable:true}
			]],
			showHeader: true,
			onLoadSuccess: function(data){
				var onLoadSuccessfn = _eaststorage.propertygrid('options').onLoadSuccess,
					deleted = ebx.getbiribbonobj(_biribbon, 'deleted', 'linkbutton'),
					undeleted = ebx.getbiribbonobj(_biribbon, 'undeleted', 'linkbutton');
					
				if(undeleted)undeleted.linkbutton('disable');
				if(deleted)deleted.linkbutton('disable');
				
				for(var i in data.rows){
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
				if(callback)callback(data, _eaststorage);//触发回掉函数，主要用于重造字段的editor的validatebox校验
			}
		}).datagrid('renderformatterstyler');//启用显示式样回调函数

	}
}
