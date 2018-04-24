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
			href: 'client/SimpChinese/west/',
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
			href:'client/SimpChinese/north/',
			border:false,
			split: false
		}).layout('add',{
			region: 'center',
			href:'client/SimpChinese/center/'
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

function getThemes(){//获取自定义主题 2018-4-20 zz
	var Storage = window.localStorage;
	if(Storage.getItem("themes") === null){
		Storage.setItem('themes', 'default');
	}
	return Storage.getItem("themes")
}

function getMenuParameter(t){//获取菜单传递到主窗口的参数 2018-4-20 zz, 参数：t：当前被激活的tabs对象
	var p = t.panel('options').href.split('?')[1], a = [];
		p = p.split('#')[0];
		p = p.split('&');
	for(var i in p){
		a[p[i].split('=')[0]] = p[i].split('=')[1];
	}
	return a;
}

function RndNum(n){//随机数生成函数
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}

