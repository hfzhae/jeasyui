/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/

easyloader.base = 'client/lib/easyui/';
easyloader.theme = 'bootstrap';
easyloader.locale = "zh_CN";

easyloader.load([
	'parser',
	'draggable', 
	'layout', 
	'portal', 
	'tabs', 
	'tree', 
	'messager', 
	'datebox'
], function(){
	$('body').append('<div id="bodylaout">');
	var bl = $('#bodylaout')
		bl.layout({
			fit: true
		}).layout('add',{
			region: 'west',
			width: 200,
			title: '功能菜单',
			href: 'west.html',
			split: true
		}).layout('add',{
			region: 'north',
			height: 20,
			href:'north.html',
			border:false,
			split: false
		}).layout('add',{
			region: 'center',
			href:'center.html'
		}).layout({
			onCollapse: function(){
				$('#homeDiv').portal('resize');
			},
			onExpand: function(){
				$('#homeDiv').portal('resize');
			}
		});
		setTimeout(function(){
			bl.layout('resize')//.layout('collapse', 'east');
		}, 300);
});
