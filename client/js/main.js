/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
require(['config'], function () {
	$('.easyui-tabs').tabs('add',{
		id:'saleorder',
		title:'销售订单',
		closable: true
	}).tabs('add',{
		id:'querysale',
		title:'销售汇总报表',
		closable: true
	}).tabs('add',{
		id:'querysale',
		title:'查询设计',
		closable: true
	}).tabs('add',{
		id:'querysale',
		title:'采购入库',
		closable: true
	}).tabs('add',{
		id:'querysale',
		title:'用户权限分配',
		closable: true
	});
	$('.easyui-tabs').tabs('select', 2);
	$('#saleorder').append('<table id="saleorderdatagrid">').css({padding:5});
		
	$('#saleorderdatagrid').datagrid({
		url:'server/json/datagrid_data1.json',
		method:'get',
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

	$('.easyui-accordion').accordion('add', {
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
	});
	$('.easyui-accordion').accordion('select', 0);
	$('#hometitle').append('<img src="client/images/EBLOGO.png" class="homelogo"><div class="hometitle">e商x</div><div class="homeversion">v0.1</div><div class="hometitlecopyright">Design by zydsoft™</div>');
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