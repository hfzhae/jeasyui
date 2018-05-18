/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
var ebx = {
	multitabs:0,//同一菜单链接多tabs打开支持，1为支持
	decimal:2,//小数位数，默认2
	pagesize: 128,//datagrid分页行数
	importFileMaxSize: 1024,//导入文件大小控制，单位K
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
					s[i] = this.EscapeJson(s[i]);
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
	convertDicToJson: function(d){//将Dic对象转化成json文本，支持字典、数组和rs的嵌套 2018-5-6 zz
		if(typeof(d) != 'object') return('{}');
		var s = '', arrtype;
		for(var i in d){
			var n = Number(i);//通过是否数字格式判断是否是数组，如果是数字，代表是数组，文本用[]包含，否则代表是字典，文本用{}包含
			if (!isNaN(n)){
				arrtype = 1;//设置json数组类型，1=[],0={}
				if(d[i].RecordCount == undefined){
					s += ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
				}else{
					s += ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
				}
			}else{
				arrtype = 0;//设置json数组类型，1=[],0={}
				switch(typeof(d[i])){
					case 'string':
						s += '"'+ i +'":"' + ebx.escapeEx(d[i]) +'",';
						break;
					case 'object':
						if(d[i].RecordCount == undefined){
							s += '"'+ i +'":' + ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
						}else{
							s += '"'+ i +'":' + ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
						}
						break;
					case 'number':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'boolean':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'function':
						s += '"'+ i +'":"' + d[i] +'",';
						break;
					case undefined:
						s += ',';
						break;
				}
			}
		}
		s = s.substr(0, s.length - 1);
		if(arrtype){
			return('[' + s + ']');
		}else{
			return('{' + s + '}');
		}
	},
	importTemplate:function(columns, title){//导入模板的导出函数 2018-5-17 zz
		ebx.clipboardData(columns, {total:1, rows:[eval('({' + columns[0][0].field +':"这是导入' + title + '数据的模板，请按以上格式编辑数据。（本行为说明文字，编辑前请删除）"})')]});
	},
	clipboardData: function (columns, data){//导出函数，复制到剪贴板方法用到了clipboard.js插件，参数：columns：表头对象，data：数据内容，包含total和rows 2018-5-15 zz
		easyloader.load(['clipboard'], function(){//异步加载clipboard.min.js
			if(typeof(columns) != 'object')return;
			if(typeof(data) != 'object')return;
			if(ebx.validInt(columns[0].length) <= 0)return;
			if(ebx.validInt(data.total) <= 0)return;
			
			var s = "",
				centererpanelwindow = $('<div style="text-align:center;padding:5px;"><p>正在读取...</p></div>').appendTo($('body')),
				copybtn = $('<div id="copybtndiv" data-clipboard-target="#bar">').appendTo(centererpanelwindow),
				copyInput = $('<textarea id="bar" style="position:absolute;top:-500px;">').appendTo(centererpanelwindow),
				nullfield = 0;//内容字段丢失判断，0则补齐tab
			
			
			var allData = data.firstRows?data.firstRows:data.rows;
			
			copybtn.linkbutton({
				text:'复制到剪贴板',
				iconCls: 'icon-Copy-large'
			})
			.addClass('l-btn-large')
			.addClass('l-btn-plain')
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
			
			var clipboard = new Clipboard('#copybtndiv');
			
			clipboard.on('success', function(e) {  
				centererpanelwindow.window('close');
				centererpanelwindow.remove();
				clipboard.destroy();
				allData = null;
				$.messager.show({
					title: '复制成功',
					msg: data.total + ' 条数据已经复制到剪贴板，请打开Excel，点击“粘贴”按钮。',
					timeout: 5000,
					height:120,
					showType: 'slide'
				});
			});  
		  
			clipboard.on('error', function(e) {
				console.log(clipboard);
				centererpanelwindow.window('close');
				centererpanelwindow.remove();
				clipboard.destroy();
				allData = null;
			}); 
			
			for(var i in columns[0]){//表头文字
				s += ebx.unescapeEx(columns[0][i].title.toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '\t';
			}
			s = s.substr(0, s.length - 1);
			s += '\n';

			for(var i in allData){//内容文字
				for(var j in columns[0]){//按表头顺序加载
					for(var k in allData[i]){
						if(columns[0][j].field == k){
							s += ebx.unescapeEx(allData[i][k].toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '\t';
							nullfield = 1
						}
					}
					if(!nullfield){
						s += '\t';
					}
					nullfield = 0;
				}
				//s = s.substr(0, s.length - 1);//效率太低，禁用了
				s += '\r';
			}
			setTimeout(function(){
				copyInput.val(s);
				centererpanelwindow.find('p').text('成功读取：'+ data.total +' 条数据。');
			},0);
		});
	},
	copy: function(datagrid){//页面拷贝数据，参数：datagrid：被拷贝的datagrid对象 2018-5-17 zz
		if(typeof(datagrid) != 'object') return;
		var data = datagrid.datagrid('getData');

		if(data.firstRows){
			data = data.firstRows;
		}else{
			data = data.rows;
		}
		
		if(data.length <= 0) return;
		
		ebx.copyData = [];
		
		for(var i in data){
			ebx.copyData.push(data[i]);
		}
		
		$.messager.show({
			title: '提示',
			msg: '成功复制了：' + ebx.copyData.length + ' 行记录。',
			timeout: 3000,
			showType: 'slide'
		});	
		$('body').find('.icon-Paste-large').parent().parent().linkbutton('enable');
		$('body').find('.icon-Paste').parent().parent().linkbutton('enable');
	},
	cut: function(datagrid){//页面内剪切数据，参数：datagrid：被剪切的datagrid对象 2018-5-17 zz
		if(typeof(datagrid) != 'object') return;
		var data = datagrid.datagrid('getData').rows;
		if(data.length <= 0) return;
		ebx.copyData = [];
		for(var i in data){
			ebx.copyData.push(data[i]);
		}
		datagrid.datagrid('load', {total:0,rows:[]});
		$.messager.show({
			title: '提示',
			msg: '成功剪切了：' + data.length + ' 行记录。',
			timeout: 3000,
			showType: 'slide'
		});	
		$('body').find('.icon-Paste-large').parent().parent().linkbutton('enable');
		$('body').find('.icon-Paste').parent().parent().linkbutton('enable');
	},
	paste: function(datagrid, tab){//页面内粘贴函数，参数：datagrid：被复制datagrid对象，[tab]：需要标记单据改动的tab对象 2018-5-17 zz
		if(typeof(datagrid) != 'object') return;
		
		var data = datagrid.datagrid('getData'),
			copyData = [];
		
		if(data.firstRows){
			for(var i in data.firstRows){
				copyData.push(data.firstRows[i]);
			}
		}else if(data.rows){
			for(var i in data.rows){
				copyData.push(data.rows[i]);
			}
		}
		
		if(ebx.copyData){
			for(var i in ebx.copyData){
				copyData.push(ebx.copyData[i]);
			}
		}
				
		datagrid.datagrid('loadData', {total: copyData.length, rows: copyData}); 

		if(tab) tab.editstatus = true;
		$.messager.show({
			title: '提示',
			msg: '成功粘贴了：' + ebx.copyData.length + ' 行数据。',
			timeout: 3000,
			showType: 'slide'
		});	
	},
	reomvecopyData: function(){//清空页面内复制内容 2018-5-17 zz
		ebx.copyData = null;
		$('body').find('.icon-Paste-large').parent().parent().linkbutton('disable');
		$('body').find('.icon-Paste').parent().parent().linkbutton('disable');
		$.messager.show({
			title: '提示',
			msg: '复制的内容已经被清空。',
			timeout: 3000,
			showType: 'slide'
		});	
	},
	importExcel: {//导入excel对象 2018-5-17 zz
		datagridObj: null,//回调用datagrid表格对象
		tabObj: null,//回调用修改标记的tabs对象
		fileinput: null,//上传用的file类型input控件
		btnObj: null,//导出按钮控件，用于解除禁用
		getFile: function (obj) {//读取excel文件函数，使用了xlsx.full.min.js（异步加载），参数：obj：file的input对象，fnback回掉函数，回掉函数参数data，返回excel内容，空内容无字段 2018-5-17 zz
			easyloader.load(['xlsx'], function(){//异步加载xlsx.full.min.js
				if(!obj.files) {
					return;
				}

				var suffix = obj.files[0].name.split(".")[1]
				if(suffix != 'xls' && suffix !='xlsx'){
					$.messager.alert('导入失败','导入的文件格式不正确！<br>只支持后缀为：.xls或.xlsx 的Excel文件。', 'error');
					ebx.importExcel.btnObj.linkbutton('enable');
					return
				}
				
				if(obj.files[0].size/1024 > ebx.importFileMaxSize){
					$.messager.alert('导入失败','导入的文件不能大于：' + ebx.bytesToSize(ebx.importFileMaxSize*1024) + ' 。<br>当前选择的文件大小为：' + ebx.bytesToSize(obj.files[0].size) + '。', 'error');
					ebx.importExcel.btnObj.linkbutton('enable');
					return
				}
				
				var f = obj.files[0];
				var reader = new FileReader();
				var wb,rABS = false;
				
				reader.onload = function(e) {
					var data = e.target.result;
					if(rABS) {
						wb = XLSX.read(btoa(ebx.importExcel.fixdata(data)), {//手动转化
							type: 'base64'
						});
					} else {
						wb = XLSX.read(data, {
							type: 'binary'
						});
					}
					//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
					//wb.Sheets[Sheet名]获取第一个Sheet的数据
					//document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(ebx.wb.Sheets[ebx.wb.SheetNames[0]]) );
					ebx.importExcel.backcall(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
					//return xlsData;
				};
				if(rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			});
		},
		fixdata: function(data) { //文件流转BinaryString，导入excel文件用
			var o = "",
				l = 0,
				w = 10240;
			for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
			o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
			return o;
		},
		backcall: function(d){//导入文件回掉函数，参数：d：获取到的excel文件内容 2018-5-17 zz
			if(!ebx.importExcel.datagridObj) return;

			var datagrid = ebx.importExcel.datagridObj,
				tab = ebx.importExcel.tabObj,
				data = datagrid.datagrid('getData'),
				columns = datagrid.datagrid('options').columns,
				importData = [],
				dataData = [];
			
			for(var i in d){
				var f = {};
				for(var j in d[i]){
					for(var k in columns[0]){
						if(columns[0][k].title == j){
							f[columns[0][k].field] = d[i][j]
						}
					}
				}
				importData.push(f);
			}
			
			if(data.firstRows){
				for(var i in data.firstRows){
					dataData.push(data.firstRows[i])
				}
			}else if(data.rows){
				for(var i in data.rows){
					dataData.push(data.rows[i])
				}
			}
			
			if(importData){
				for(var i in importData){
					dataData.push(importData[i]);
				}
			}

			datagrid.datagrid('loadData', {total: dataData.length, rows: dataData}); 
			
			if(tab) tab.editstatus = true;
			$.messager.show({
				title: '提示',
				msg: '成功导入了：' + importData.length + ' 行数据。',
				timeout: 3000,
				showType: 'slide'
			});	
			ebx.importExcel.btnObj.linkbutton('enable');
			
			ebx.importExcel.fileinput.remove();
			ebx.importExcel.datagridObj = null;
			ebx.importExcel.tabObj = null;
			ebx.importExcel.btnObj = null;
		}
	},
	bytesToSize: function (bytes) {  //字节转换文本函数
	　　if (bytes === 0) return '0 B';
	　　var k = 1024;
	　　sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	　　i = Math.floor(Math.log(bytes) / Math.log(k))　　
	　　//return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
	　　return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	　　//toPrecision(3) 后面保留两位小数，如1.00GB  
	} 
};

ebx.init();