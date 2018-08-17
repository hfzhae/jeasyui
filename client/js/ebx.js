/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
*****************************************************************/
var ebx = {
	multitabs:0,//同一菜单链接多tabs打开支持，1为支持
	decimal:2,//小数位数，默认2
	pagesize: 128,//datagrid分页行数
	importFileMaxSize: 1024*5,//导入文件大小控制，单位K
	listview:{ //显示列数组
		productserial:1, //串号
		colorsize:1,//色码
		nat:0, //不含税额
		taxrate: 0, //税率
		taxamount: 0, //税额
		discount: 0,//折扣
		expire: 1, //保质期
		oldprice: 0, //零售价
		batch: 0, //批次
		unit: 0, //单位
		aunit: 0, //辅助单位
		aquantity: 0, //辅助数量
		relation: 0,//核算关系
	},
	productseriallength: 500000,//串号数量上限
	init: function(){
		easyloader.base = 'client/lib/easyui/';
		easyloader.theme = this.getThemes();
		easyloader.locale = "zh_CN";
		//easyloader.number = 100;
		easyloader.load([
			'parser',
			'layout',
			'messager',
			'customValidatebox'
		], function(){
			ebx.bodylayout = $('<div>').appendTo($('body'));//定义全局layout
			var bl = ebx.bodylayout
				bl.layout({
					fit: true
				}).layout('add',{
					region: 'west',
					width: 200,
					maxWidth: '50%',
					minWidth: 200,
					title: '',
					href: 'client/SimpChinese/ConceptUI/west/',
					hideExpandTool:false,
					hideCollapsedContent:false,
					border:false,
					split: true,
					collapsedContent: function(title){
						var region = $(this).panel('options').region;
						if(region =='north'|| region =='south'){
							//返回标题;
						} else {
							return '<div class="panel-title layout-expand-title layout-expand-title-down">菜单</ div>';
						}
					}
				}).layout('add',{
					region: 'north',
					height: 30,
					href:'client/SimpChinese/ConceptUI/north/',
					border:false,
					split: false
				}).layout('add',{
					region: 'center',
					border:false,
					href:'client/SimpChinese/ConceptUI/center/'
				}).layout({
					onCollapse: function(){
						$('#homeDiv').portal('resize');
					},
					onExpand: function(){
						$('#homeDiv').portal('resize');
					}
				});
				setTimeout(function(){
					bl.layout('resize')
				}, 300);
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
		Date.prototype.Format = function (fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) 
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
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
			$.messager.confirm('提醒', t + '的数据已经被修改，点击确定将不保留修改的数据，是否继续?', function(r){
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
	cloneObj: function (obj) {//克隆对象函数，暂不支持嵌套
		var newObj = {};
		if (obj instanceof Array) {
			newObj = [];
		}
		for (var key in obj) {
			newObj[key] = obj[key];
			//var val = obj[key];
			//newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
			//if(typeof(val) === 'object'){
			//	newObj[key] = this.cloneObj(val)
			//}else{
			//	newObj[key] = val;
			//}
		}
		return newObj;
	},
	convertDicToJson: function(d){//将Dic对象转化成json文本，支持字典、数组和rs的嵌套 2018-5-6 zz
		if(typeof(d) != 'object') return('{}');
		var s = '', arrtype = 1;
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
						//s += '"'+ i +'":"' + d[i] +'",';
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
						//s += '"'+ i +'":"' + d[i] +'",';
						s += '"'+ i +'":"",';//function类型设置为空
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
		ebx.clipboardData(columns, {total:1, rows:[eval('({' + columns[0][0].field +':"这是导入“' + title + '”的模板，请按以上格式编辑数据。（本行为说明文字，编辑前请删除）"})')]});
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
				iconCls: 'icon-CopyToPersonalTaskList-large',
				disabled: true
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
				draggable:true,
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
				//s += ebx.unescapeEx(columns[0][i].title.toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '\t';
				s += columns[0][i].title.toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_') + '\t';
			}
			s = s.substr(0, s.length - 1);
			s += '\n';

			for(var i in allData){//内容文字
				for(var j in columns[0]){//按表头顺序加载
					for(var k in allData[i]){
						if(columns[0][j].field == k){
							//s += ebx.unescapeEx(allData[i][k].toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_')) + '\t';
							s += allData[i][k].toString().replaceAll(' ','_').replaceAll('	', '_').replaceAll('　', '_') + '\t';
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
				copybtn.linkbutton('enable');
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

		if(ebx.validInt(data.length) <= 0) return;
		
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
		if(ebx.validInt(data.length) <= 0) return;
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

		if(tab){
			ebx.setEditstatus(tab, true)
		}
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
		getFile: function (obj, fnback) {//读取excel文件函数，使用了xlsx.full.min.js（异步加载），参数：obj：file的input对象，fnback回掉函数，回掉函数参数data，返回excel内容，空内容无字段 2018-5-17 zz
			easyloader.load(['xlsx'], function(){//异步加载xlsx.full.min.js
				if(!obj.files) {
					return;
				}

				var suffix = obj.files[0].name.split(".")[1]
				if(suffix != 'xls' && suffix !='xlsx'){
					$.messager.alert('导入失败','导入的文件格式不正确！<br>只支持后缀为：.xls或.xlsx 的Excel文件。', 'warning');
					ebx.importExcel.btnObj.linkbutton('enable');
					return
				}
				
				if(obj.files[0].size/1024 > ebx.importFileMaxSize){
					$.messager.alert('导入失败','导入的文件不能大于：' + ebx.bytesToSize(ebx.importFileMaxSize*1024) + ' 。<br>当前选择的文件大小为：' + ebx.bytesToSize(obj.files[0].size) + '。', 'warning');
					ebx.importExcel.btnObj.linkbutton('enable');
					return
				}

				var f = obj.files[0],
					reader = new FileReader(),
					wb,
					rABS = true;
				
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
					if(fnback){
						fnback(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
					}else{
						ebx.importExcel.backcall(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
					}
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
			
			if(tab) ebx.setEditstatus(tab, true);
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
	bytesToSize: function (bytes) {  //字节数转换文本函数
		if (bytes === 0) return '0 B';
		var k = 1024;
		sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		i = Math.floor(Math.log(bytes) / Math.log(k))
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},
	checkedBDvalidatebox: function (datagrid){ //校验表格的validatebox，参数：datagrid：需要校验的datagrid控件对象 2018-5-21 zz
		var checked = [],
			data = datagrid.datagrid('getData').rows;
		
			for(var i in data){
			datagrid.datagrid('beginEdit', i);
			var editors = datagrid.datagrid('getEditors', i);
			if(editors.length > 0){
				for(var j in editors){
					switch(editors[j].type.toLowerCase()){
						case 'validatebox'://判断如果编辑器是validatebox类型，那么调用validatebox的isValid方法判断录入值的合法性
							if(!editors[j].target.validatebox('isValid')){
								checked.push(data[i]);
							}else{
								datagrid.datagrid('endEdit', i);
							}
							break;
						case 'combogrid': case 'datebox': 
							if(!editors[j].target.combo('isValid')){
								checked.push(data[i]);
							}else{
								datagrid.datagrid('endEdit', i);
							}
							break;
						default:
							datagrid.datagrid('endEdit', i);
							break;
						//validatebox-text
					}
				}
			}
		}
		
		if(checked.length){
			var checkedtext = '';
			for(var i in checked){
				checkedtext += checked[i].name + '，'
			}
			$.messager.alert('错误', '保存失败！<br>'+ checkedtext + '输入有误。', 'warning');
			//$.messager.show({
			//	title: '提示',
			//	msg: checkedtext + '输入有误。',
			//	timeout: 3000,
			//	showType: 'slide'
			//});	
			return(false);
		}else{
			return(true);
		}
	},
	setDatagridEditor: {//设置datagrid的editor的编辑属性 2018-7-26 zz
		validatebox: function (c, f, e, t){//编辑框校验设置，参数：c：datagrid的列对象，f：字段名称，e：校验类型，详见renderstyler插件，t：是否必填，true为必填
			if(typeof(c) != 'object') return;
			if(typeof(f) != 'string') return;
			if(typeof(e) != 'string') return;
			if(typeof(t) != 'boolean') t = false;;
			for(var i in c){
				for(var j in c[i]){
					if(j == 'field' && c[i][j].toLowerCase() == f.toLowerCase()){
						c[i]['editor'] = {"type":"validatebox", "options":{"required":t,"validType":e}};
					}
				}
			}
		},
		editorType: function(c, f, t, o){//设置编辑类型，参数：c：datagrid的列对象，f：字段名称，t：编辑类型，o：编辑类型的options对象
			if(typeof(c) != 'object') return;
			if(typeof(f) != 'string') return;
			if(typeof(t) != 'string') t = 'text';
			if(typeof(o) != 'object') o = {};
			
			for(var i in c){
				for(var j in c[i]){
					if(j == 'field' && c[i][j].toLowerCase() == f.toLowerCase()){
						if(t == ''){
							delete c[i]['editor'];
						}else{
							c[i]['editor'] = {"type":t, "options":o};
						}
					}
				}
			}
		},
		editorMethods: function(c, f, t, o){//设置编辑得方法，参数：c：datagrid的列对象，f：字段名称，t：编辑类型，o：编辑类型的方法对象
			if(typeof(c) != 'object') return;
			if(typeof(f) != 'string') return;
			if(typeof(t) != 'string') t = 'text';
			if(typeof(o) != 'object') o = {};
			
			for(var i in c){
				for(var j in c[i]){
					if(j == 'field' && (c[i][j].toLowerCase() == f.toLowerCase())){
						this._setFunc(c[i], t, o);
						break;
					}
				}
			}
		},
		_setFunc: function(c, t, o){//方法写入
			switch(t){
				case 'combogrid':
					for(var i in o){
						switch(i){
							case 'onSelect':
								c['editor'].options.onSelect = o[i];
								break;
						}
					}
					break;
			}
		},
		setColumnsFunc:function(c, f, func){//写入明细列表字段的服务器端回调函数，参数：c：datagrid的列对象，f：字段名称，func：回掉函数名
			if(typeof(c) != 'object') return;
			if(typeof(f) != 'string') return;
			if(typeof(func) != 'string') return;
			
			for(var i in c){
				if(c[i].field.toLowerCase() == f.toLowerCase()){
					c[i].func = func;
					break;
				}
			}
		}
	},
	Render: {//显示函数全局定义对象 2018-5-23 zz
		render: [//显示函数内容对象
			{
				label: '布尔',
				value: 'boolRender',
				render: function(v, rowIndex){
					if(v == '' || v == undefined || v == 'undefined' || v == null || v == 'null' || v == 0 || v == '0'){
						return '';
					}else{
						value = '√';
						return '√';
					}
				}
			},{
				label: '行序号',
				value: 'lineNumberRender',
				render: function(v, rowIndex){
					return rowIndex + 1;
				}
			},{
				label: '隐藏列',
				value: 'hiddenRender',
				render: function(v, rowIndex){
					return '';
					//datagrid.datagrid('hideColumn', field.field);
				}
			},{
				label: '金额',
				value: 'currencyRender',
				render: function(v, rowIndex){
					v = ebx.validFloat(v, 0);
					if(v == 0){
						v = '';
					}else{
						v = v.toFixed(ebx.decimal);
					}
					return v;
				}
			},{
				label: '成本金额',
				value: 'costCurrencyRender',
				render: function(v, rowIndex){
					v = ebx.validFloat(v, 0);
					if(v == 0){
						v = '';
					}else{
						v = v.toFixed(ebx.decimal);
					}
					return v;
				}
			},{
				label: '百分数',
				value: 'percentRender',
				render: function(v, rowIndex){
					v = ebx.validFloat(v, 0);
					if(v == 0){
						v = '';
					}else{
						v = v * 100;
						v = (v.toFixed(ebx.decimal)) + '%';
					}
					return v;
				}
			},{
				label: '日期',
				value: 'dateRender',
				render: function(v, rowIndex){
					if(isNaN(v)&&!isNaN(Date.parse(v))){
						return new Date(v).Format("yyyy-MM-dd");
					}
				}
			},{
				label: '日期时间',
				value: 'datetimeRender',
				render: function(v, rowIndex){
					return new Date(v).Format("yyyy-MM-dd hh:mm:ss");
				}
			},{
				label: '无',
				value: '',
				render: function(v, rowIndex){
					if(typeof(v) == 'string'){
						v = v;
					}
					return v;
				}
			}
		],
		setRender: function(render, value, rowIndex){//设置datagrid回掉函数，参数：render：回掉函数名，value：值，rowIndex：datagrid中的行号
			if(typeof(value) == 'string'){
				value = value;
			}
			if(typeof(render) != 'string'){
				return value;
			};
			if(typeof(rowIndex) != 'number') return;
			
			var f = 0;
			for(var i in ebx.Render.render){
				if(render.toLowerCase() == ebx.Render.render[i].value.toLowerCase()){
					return ebx.Render.render[i].render(value, rowIndex);
					f = 1;
				}
			}
			if(!f){
				return value;
			}
		}
	},
	setEditstatus: function(tab, s){//内容变化状态修改
		var st = s?'<span style="color:#F00;">○</span> ':'';
		tab.editstatus = s;
		ebx.center.find('.tabs-selected').find('.tabs-closable').html(st + tab.title);
	},
	setListVies: function(c){//设置显示列，参数：c：datagrid的columns列对象
		for(var i in ebx.listview){
			for(var j in c){
				if(i.toLowerCase() == c[j].field.toLowerCase() && ebx.listview[i] == 0){
					c[j].hidden = true;
				}
				if(i.toLowerCase() == 'colorsize' && ebx.listview[i] == 0){
					if(c[j].field.toLowerCase() == 'color' || c[j].field.toLowerCase() == 'size'){
						c[j].hidden = true;
					}
				}
			}
		}
	}
};

ebx.init();