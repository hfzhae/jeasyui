/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
var ebx = {
	multitabs:0,//同一菜单链接多tabs打开支持，1为支持
	decimal:2,//小数位数，默认2
	pagesize: 128,//datagrid分页行数
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
			'menubutton',
			'clipboard'
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
		String.prototype.replaceAll = function(s1,s2){ 
			return(this.replace(new RegExp(s1,"gm"),s2)); 
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
		var p = t.panel('options').href.split('?')[1], 
			a = {};
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
			$.messager.confirm('提醒', ebx.UnescapeJson(t)+'的数据已经被修改，点击确定将不保留修改的数据，是否继续?', function(r){
				if (r){
					backcall();
				}
			});
		}else {
			backcall();
		}
	},
	escapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			return escape(str);
			//return str;
		}else{
			return(str);
		}
	},
	unescapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			return unescape(str);
			//return str;
		}else{
			return(str);
		}
	},
	UnescapeJson: function(s){//转码所有嵌套json中文的escape
		if(typeof(s) == 'object'){
			for(var i in s){
				if(typeof(s[i]) == 'object'){
					s[i] = this.UnescapeJson(s[i]);
				}else{
					s[i] = ebx.unescapeEx(s[i]);
				}
			}
		}else{
			s = ebx.unescapeEx(s)
		}
		return s
	},
	EscapeJson: function(s){
		if(typeof(s) == 'object'){
			for(var i in s){
				if(typeof(s[i]) == 'object'){
					s[i] = this.UnescapeJson(s[i]);
				}else{
					//if(/^[\u3220-\uFA29]+$/.test(s[i])){//判断是否包含中文字符
						s[i] = ebx.escapeEx(s[i]);
					//}
				}
			}
		}else{
			//if(/^[\u3220-\uFA29]+$/.test(s[i])){//判断是否包含中文字符
				s[i] = ebx.escapeEx(s[i]);
			//}
		}
		return s
	},
	validFloat: function(f, def){
		var n = parseFloat(f);
		if (isNaN(n)){
			return ((def==undefined)?0:def);
		}else{
			return n;
		}
	},
	validInt: function (i, def){//整形格式化
		var n = parseInt(i);
		if (isNaN(n)){
			return ((def==undefined)?0:def);
		}else{
			return n;
		}
	},
	clipboardData: function (columns, data){//复制到剪贴板方法，参数：columns：表头对象，data：数据内容，包含total和rows 2018-5-15 zz
		if(typeof(columns) != 'object')return;
		if(typeof(data) != 'object')return;
		if(ebx.validInt(columns[0].length) <= 0)return;
		if(ebx.validInt(data.total) <= 0)return;
		
		var s = "",
			centererpanelwindow = $('<div style="text-align:center;padding:5px;"><p>成功读取：'+ data.total +' 条数据。</p></div>').appendTo($('body')),
			copybtn = $('<div name="copybtn">').appendTo(centererpanelwindow);
		
		for(var i in columns[0]){//表头文字
			s += ebx.unescapeEx(columns[0][i].title.toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '	';
		}
		s = s.substr(0, s.length - 1);
		s += '\n';
		for(var i in data.rows){//内容文字
			for(var j in columns[0]){//按表头顺序加载
				for(var k in data.rows[i]){
					if(columns[0][j].field == k){
						s += ebx.unescapeEx(data.rows[i][k].toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '	';
					}
				}
			}
			s = s.substr(0, s.length - 1);
			s += '\n';
		}
		
		copybtn.linkbutton({
			text:'复制到剪贴板',
			iconCls: 'icon-Copy-large'
		})
		.addClass('l-btn-large')
		//.addClass('l-btn-plain')
		.find('.l-btn-left')
		.removeClass('l-btn-icon-left')
		.addClass('l-btn-icon-top');
		
		centererpanelwindow.window({
			width:250,
			height:160,
			iconCls:'icon-ImportExcel',
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			closable:true,
			title:'导出',
			draggable:false,
			resizable:false,
			shadow:false
		});
								
		var clipboard = new Clipboard('div[name=copybtn]', {  
			text: function() {
				return s;
			}
		});
		
		clipboard.on('success', function(e) {  
			centererpanelwindow.window('close');
			centererpanelwindow.remove();
			clipboard.destroy();
			$.messager.show({
				title: '复制成功',
				msg: data.total + ' 条数据已经复制到剪贴板，请打开Excel，点击“粘贴”按钮。',
				timeout: 5000,
				height:120,
				showType: 'slide'
			});
		});  
	  
		clipboard.on('error', function(e) {  
			centererpanelwindow.window('close');
			centererpanelwindow.remove();
			clipboard.destroy();
		}); 
	}
};

ebx.init();