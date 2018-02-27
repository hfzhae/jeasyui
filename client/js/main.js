/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
require(['config'], function () {
	$('#center').append('<div id="tabsCenter">');
	
	$('#tabsCenter').tabs({
		fit:true,
		border:false,
		plain:false,
		tools:[{
			iconCls:'icon-cancel',
			handler:function(){
				var arrTitle = new Array(),
					id = "#tabsCenter",
					tabs = $(id).tabs("tabs"),
					tCount = tabs.length;
					
				if(tCount>0){  
					for(var i=0;i<tCount;i++){
						if(tabs[i].panel('options').closable){
							arrTitle.push(tabs[i].panel('options').title)
						}  
					}
					
					for(var i=0;i<arrTitle.length;i++){  
						$(id).tabs("close",arrTitle[i]);  
					}  
				}  
			}
		}]
	});
	
	$('#tabsCenter').tabs('add',{
	//	id:'ribbon',
	//	title:'Office',
	//	href:'ribbon.html',
	//	selected: false,
	//	closable:true
	//}).tabs('add',{
		id:'hometab',
		title:'首页',
		href:'hometab.html',
		selected: true,
		closable:false
	//}).tabs('add',{
	//	id:'DataGridTest',
	//	title:'DataGrid扩展测试',
	//	href:'datagrid23_demo.html',
	//	selected: false,
	//	closable:false
	//}).tabs('add',{
	//	id:'stockquery',
	//	title:'库存查询',
	//	href:'DataGridVirtualScroll.html',
	//	selected: false,
	//	closable:true
	//}).tabs('add',{
	//	id:'jxcquery',
	//	title:'进销存汇总表',
	//	href:'LargeData.html',
	//	selected: false,
	//	closable:true
	//}).tabs('add',{
	//	id:'saleorder',
	//	title:'销售订单',
	//	selected: false,
	//	closable: true
	//}).tabs('add',{
	//	id:'saleout',
	//	title:'销售出库单',
	//	href:'content.html',
	//	selected: false,
	//	closable:true
	});
	
	$('#tabsCenter').tabs({
		onUnselect: function(tab, panel){
			if(panel == 1){
				$('#ttl').datagrid('loadData', []);
			}
		},
		onBeforeClose: function(title,index){
			return true;	// prevent from closing
			var target = this;
			console.log(title);
			$.messager.confirm('Confirm','Are you sure you want to close '+title,function(r){
				if (r){
					var opts = $(target).tabs('options');
					var bc = opts.onBeforeClose;
					opts.onBeforeClose = function(){};  // allowed to close now
					$(target).tabs('close',index);
					opts.onBeforeClose = bc;  // restore the event function
				}
			});
			return false;	// prevent from closing
		}
	});
	
	/*
	$('#saleout').css({padding:5});
	$('#stockquery').css({padding:5});
	$('#jxcquery').css({padding:5});
	$('#DataGridTest').css({padding:5});
	$('#hometab').css({padding:0});
	$('#ribbon').css({padding:10});
	$('#saleorder').append('<table id="saleorderdatagrid">').css({padding:5});
		
	$('#saleorderdatagrid').datagrid({
		url:'server/json/datagrid_data1.json',
		method:'get',
		striped:true,
		singleSelect:true,
		fit:true,
		columns:[[
			{field:'itemid',title:'Item ID',width:80},
			{field:'productid',title:'Product ID',width:100},
			{field:'listprice',title:'List Price',width:80,align:'right'},
			{field:'unitcost',title:'Unit Cost',width:80,align:'right'},
			{field:'attr1',title:'Attribute',width:150},
			{field:'status',title:'Status',width:50,align:'center'}
		]]
	});
	$('#saleorderdatagrid').datagrid('getPanel').removeClass('lines-both lines-no lines-right lines-bottom').addClass('lines-right');
	*/

	$('#hometitle').append('<img src="client/images/EBLOGO.png" class="homelogo"><div class="hometitle">e商x</div><div class="homeversion">v0.1</div><div class="hometitlecopyright">Design by zydsoft™</div>');
	
	$('#east').append('<table id="pg">');
	$('#pg').propertygrid({
		border:false,
		url:'server/json/propertygrid_data1.json',
		method:'get',
		showGroup:true,
		scrollbarSize:0,
		width: '100%',
		border:false
	});
	
	$('#west').append('<div id="accordionWest">');
	$('#accordionWest').accordion({
		animate:false,
		fit:true,
		border:false
	});
	
	$('#accordionWest').accordion('add', {
		id: 'menuWest',
		title: '销售',
		width:200
	}).accordion('add', {
		id:'s1',
		title:'收款'
	}).accordion('add', {
		id:'s2',
		title:'采购'
	}).accordion('add', {
		id:'s3',
		title:'付款'
	}).accordion('add', {
		id:'s4',
		title:'会员'
	}).accordion('add', {
		id:'s5',
		title:'办公'
	}).accordion('add', {
		id:'s6',
		title:'设置'
	}).accordion('add', {
		id:'s7',
		title:'系统'
	}).accordion('select', 0);
	
	$('#menuWest').tree({
		url: 'server/json/tree_data1.json',
		method: 'get',
		animate:true,
		dnd:true,
		onClick: function(node){
			if(node.id < 10) return;
			if($('#tabs_'+node.id).length > 0){
				$('#tabsCenter').tabs('select', $('#tabs_'+node.id).panel('options').index);
			}else{
				$('#tabsCenter').tabs('add',{
					id:'tabs_'+node.id,
					title:node.text,
					href:node.href,
					//href:'ribbon.html',
					selected: true,
					closable:true
				});
				$('#tabs_'+node.id).css({padding:5});
			}
		}
	}).css({padding: 5});
	$.parser.parse();
	//$('body').css({padding:5});
	//$('.easyui-layout').css({width:($(window).width()-10),height:($(window).height()-10)});
	//require(['easyui'], function(){
		/*
		$('body').css({padding:5}).append('<div id="layout">');

		//$.parser.parse();
		
		$('#layout').layout();
		
		$('#layout').layout({
			width:'100%',
			height:($(window).height()-10)
			//height:800
		})

		$('#layout').layout('add', {
			id: 'center',
			region: 'center',
			title: 'Main Title'
		}).layout('add', {
			region: 'north',
			title: 'north',
			height: 100,
			split: true
		}).layout('add', {
			region: 'south',
			title: 'south',
			height: 100,
			split: true
		}).layout('add', {
			id: 'west',
			region: 'west',
			title: 'west',
			width: 200,
			split: true
		}).layout('add', {
			id: 'east',
			region: 'east',
			title: 'east',
			width: 300,
			split: true
		});
		
		$('#center').append('<div id="tabs">');
		$('#tabs').tabs({
			fit:true,
			border:false,
			plain:true
		});
		$('#tabs').tabs('add',{
			id:'DataGrid',
			title:'DataGrid',
			selected: true
		}).tabs('add',{
			id:'About',
			title:'About',
			href:'_content.html',
			closable:true
		});
		$('#tabs').tabs('select', 0);
		$('#About').css({padding:10});
		$('#DataGrid').append('<table id="datagrid">').css({padding:5});

		$('#datagrid').datagrid({
			url:'/server/json/datagrid_data1.json',
			method:'get',
			singleSelect:true,
			fit:true,
			columns:[[
				{field:'itemid',title:'Item ID',width:80},
				{field:'productid',productid:'Product ID',width:100},
				{field:'listprice',title:'List Price',width:80,align:'right'},
				{field:'unitcost',title:'Unit Cost',width:80,align:'right'},
				{field:'attr1',title:'Attribute',width:150},
				{field:'status',title:'Status',width:50,align:'center'}
			]]
		});
		
		$('#east').append('<table id="pg">');
		$('#pg').propertygrid({
			border:false,
			url:'/server/json/propertygrid_data1.json',
			method:'get',
			showGroup:true,
			scrollbarSize:0,
			width: '100%'
		});
		
		$('#west').append('<div id="accordionWest">');
				
		$('#accordionWest').accordion({
			animate:false,
			fit:true,
			border:false
		});
		$('#accordionWest').accordion('add', {
			id: 'Title4',
			title: 'Tree',
			width:200
		});
		$('#Title4').tree({
			url: '/server/json/tree_data1.json',
			method: 'get',
			animate:true,
			dnd:true
		}).css({padding: 5});
		
		window.onresize = function() { 
			//setWideScreen();
		}
		*/
	//});
});