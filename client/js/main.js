/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
easyloader.base = 'client/lib/easyui/';
easyloader.theme = getThemes();
easyloader.locale = "zh_CN";

easyloader.load([
	'parser',
	'draggable', 
	'layout', 
	'portal', 
	'tabs', 
	'tree', 
	'messager', 
	'datebox',
	'menubutton'
], function(){
	$('body').append('<div id="bodylaout">');
	var bl = $('#bodylaout')
		bl.layout({
			fit: true
		}).layout('add',{
			region: 'west',
			width: 200,
			title: '',
			href: 'west.html',
			hideExpandTool:false,
			hideCollapsedContent:false,
			split: false,
			collapsedContent: function(title){
				var region = $(this).panel('options').region;
				if(region =='north'|| region =='south'){
					//返回标题;
				} else {
					return '<div class="panel-title layout-expand-title layout-expand-title-down">功能菜单</ div>';
				}
			}
		}).layout('add',{
			region: 'north',
			height: 25,
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

function getThemes(){
	var Storage = window.localStorage;
	if(Storage.getItem("themes") === null){
		Storage.setItem('themes', 'default');
	}
	return Storage.getItem("themes")
}