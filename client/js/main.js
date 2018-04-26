/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
var ebx = {
	multitabs:0,//同一菜单链接多tabs打开支持，1为支持
	init: function(){
		easyloader.base = 'client/lib/easyui/';
		easyloader.theme = this.getThemes();
		easyloader.locale = "zh_CN";
		//easyloader.number = 100;
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
			ebx.bodylayout = $('<div>').appendTo($('body'));//定义全局layout
			var bl = ebx.bodylayout
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
				//setTimeout(function(){
				//	bl.layout('resize')
				//}, 300);
		});
		
		window.onbeforeunload=function(e){//处理编辑未保存时窗口关闭或刷新时的提醒 2018-4-25 zz
			var tabspanel = ebx.center.tabs('tabs'),
				editstatus = false;
			for(var i in tabspanel){
				if(tabspanel[i].panel('options').editstatus)editstatus = true;
			}
			if(editstatus){
			　　var e = window.event||e;  
			　　e.returnValue=("有数据没有保存，确定离开当前页面吗？");
			}
		}
 	},
	getThemes: function(){//获取主题函数
		var Storage = window.localStorage;
		if(Storage.getItem("themes") === null){
			Storage.setItem('themes', 'default');
		}
		return Storage.getItem("themes")
	},
	getMenuParameter: function(t){//获取菜单传递到主窗口的参数 2018-4-20 zz, 参数：t：当前被激活的tabs对象
		var p = t.panel('options').href.split('?')[1], a = [];
			p = p.split('#')[0];
			p = p.split('&');
		for(var i in p){
			a[p[i].split('=')[0]] = p[i].split('=')[1];
		}
		return a;
	},
	RndNum: function(n){//随机数生成函数
		var rnd="";
		for(var i=0;i<n;i++)
			rnd+=Math.floor(Math.random()*10);
		return rnd;
	},
	EditStatusMessager: function(s, t, backcall){//编辑状态判断提醒函数，参数：s：状态true为被编辑，t：显示文本，backcall：回调函数
		if(s){//判断数据是否被编辑过。
			$.messager.confirm('提醒', t+'的数据已经被修改，点击确定将不保留修改的数据，是否继续?', function(r){
				if (r){
					backcall();
				}
			});
		}else {
			backcall();
		}
	}
};

ebx.init();
