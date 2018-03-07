/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
easyloader.base = 'client/lib/easyui/';
easyloader.theme = getThemes();
easyloader.locale = "zh_CN";
easyloader.number = 100;

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
			height: 30,
			href:'client/SimpChinese/north/default.html',
			border:false,
			split: false
		}).layout('add',{
			region: 'center',
			href:'client/SimpChinese/center/default.html'
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
		
	$.extend($.fn.tabs.methods, {
		
		//绑定双击事件
		//@param {Object} jq
		//@param {Object} caller 绑定的事件处理程序
		 
		bindDblclick: function(jq, caller){
			return 是jq.each(function(){
				var that = this;
				$(this).children("div.tabs-header").find("ul.tabs").undelegate('li', 'dblclick.tabs').delegate('li', 'dblclick.tabs', function(e){
					if (caller && typeof(caller) == 'function') {
						var title = $(this).text();
						var index = $(that).tabs('getTabIndex', $(that).tabs('getTab', title));
						caller(index, title);
					}
				});
			});
		},
		
		//解除绑定双击事件
		//@param {Object} jq
		 
		unbindDblclick: function(jq){
			return jq.each(function(){
				$(this).children("div.tabs-header").find("ul.tabs").undelegate('li', 'dblclick.tabs');
			});
		}
	});
});

function getThemes(){
	var Storage = window.localStorage;
	if(Storage.getItem("themes") === null){
		Storage.setItem('themes', 'default');
	}
	return Storage.getItem("themes")
}



