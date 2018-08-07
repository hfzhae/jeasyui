/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
改造jeasyui的combogrid插件的keyHandler和onShowPanel事件，实现海量数据的异步处理方法，支持搜索

依赖库：scrollview

新增属性：
options.columns.search（bool）:true的字段支持搜索；
options.oRows:存储原始数据
options.template:查询模板的ID，获取地址server/bi/list/?
options.style:显示式样（结构：columns）的式样名称，获取地址server/bi/style/?
options.asyn:是否从服务器端读取数据，0为读取，默认0，读取后置1，按esc键置0
options.validType增加：combogridValue类型，校验值不能为空，required:true时生效
重造onValidate事件，验证成功且搜索结果为1行是焦点移动到下一个控件
*****************************************************************/

$.extend($.fn.combogrid.defaults, {
	keyHandler: {
		up: function(){
			try{
				$(this).combogrid('showPanel');
				var co = $(this).combogrid('grid');
				var selected = co.datagrid('getSelected');  

				if (selected) {  
					var index = co.datagrid('getRowIndex', selected);  
					co.datagrid('selectRow', index - 1);
				} else {
					var rows = co.datagrid('getRows');  
					co.datagrid('selectRow', rows.length - 1);  
				}
			} catch(err) {}
		},
		down: function(){
			//try{
				$(this).combogrid('showPanel');
				var co = $(this).combogrid('grid');
				var selected = co.datagrid('getSelected');

				if (selected) {  
					var index = co.datagrid('getRowIndex', selected);  
					co.datagrid('selectRow', index + 1);  
				} else {
					co.datagrid('selectRow', 0);
				} 
			//} catch(err) {}
		},
		left: function(){},
		right:function(){},
		enter: function(){
			$(this).combogrid('showPanel');
			var co = $(this),
				//t = escape($.trim(co.combogrid('getText'))),
				t = $.trim(co.combogrid('getText')),
				ops = co.combogrid('options'),
				rows = ops.oRows,
				selected = co.combogrid('grid').datagrid('getSelected'),
				columns = co.combogrid('grid').datagrid('options').columns,
				searchField = [],
				template = ops.template;
				
			/*	
			for (var j in columns[0]){
				if(columns[0][j].search){
					searchField.push(columns[0][j].field);//找出需要搜索的字段名
				}
			}
			*/
			if (selected && co.combo('getValue') != '') {//已经选中有值的，关闭下拉框，跳转到下一个可编辑控件
				co.combogrid('hidePanel');
				co.combogrid('validate');
				var inputs = $("input");//得到所有input对象
				for (var i = 0; i < inputs.length; i++) {
					if (co.combogrid('textbox')[0] == inputs[i]) {
						for(j = (i + 1); j < inputs.length; j++){
							if($(inputs[j]).css('display') != 'none' && inputs[j].id != ''){
								inputs[j].focus();
								break;
							}
						}
					}
				}
			} else { 
				co.combogrid('grid').datagrid('load', {//服务器端搜索
					template:template,
					_:(new Date()).getTime(),
					find: t
				});
				/*
				//客户端搜素
				var rowsq = [],
					serachon;
				for (var i in rows) {
					serachon = 0
					for(var j in searchField){
						if(rows[i][searchField[j]] != undefined){
							if (rows[i][searchField[j]].toLowerCase().indexOf(t.toLowerCase()) != -1) {
								serachon = 1;
							}
						}
					}
					if (serachon == 1) {
						rowsq.push(rows[i]);
					}
				}
				co.combogrid('grid').datagrid('loadData', {
					total:rowsq.length,
					rows:rowsq
				});
				if(t != ''){
					co.combogrid('grid').datagrid('selectRow', 0);
				}
				if(rowsq.length == 1){
					co.combogrid('grid').datagrid('selectRow', 0);
					co.combogrid('hidePanel');
				}
				*/
			}  
		},
		query: function(q){
			var co = $(this);
			co.combo('setValue', '')
			co.combo('setText', q);
		},
		esc: function(){
			var co = $(this),
				g = co.combogrid('grid'),
				ops = co.combogrid('options');

			ops.asyn = 0;
		}
	},
	onChange: function(newValue, oldValue){
		var co = $(this);
			//co.combo('setText', unescape(newValue));
			co.combo('setText', newValue);
		try{
			var tabs = ebx.center.tabs('getSelected'),
				tab = tabs.panel('options');
			ebx.setEditstatus(tab, true);
		}catch(e){}
	},
	onHidePanel: function(){
		var co = $(this),
			//t = unescape(co.combo('getText'));
			t = co.combo('getText');
		co.combo('setText', t);
	},
	onShowPanel: function(){
		var co = $(this),
			g = co.combogrid('grid'),
			ops = co.combogrid('options'),
			pageSize = ebx.pagesize;
		
		if(g.datagrid('getRows').length == 0 || !ops.asyn){
			var style = ops.style,//显示式样名称，获取地址server/DataProvider/style/?
				template = ops.template,//查询模板ID，获取地址server/DataProvider/list/?
				url = 'server/SimpChinese/DataProvider/list/',
				queryParams = {_:(new Date()).getTime()};
			if(!style)return;
			if(!template){
				if(ops.droplisturl){
					url = ops.droplisturl;//支持自定义url获取list数据
				}else{
					return;
				}
			}else{
				queryParams = {template:template,_:(new Date()).getTime()}
			};
			$.ajax({
				type: 'post', 
				url: 'server/SimpChinese/DataProvider/style/',
				data:{style:style,_:(new Date()).getTime()},
				dataType: "json",
				success: function(result){
					if(result){
						var data = [result.data];
						g.datagrid({
							view:scrollview,
							pageSize:pageSize,
							url:url,
							queryParams:queryParams,
							method:'post',
							loadMsg:$.fn.datagrid.defaults.loadMsg,
							columns:data,
							onLoadSuccess: function(data){
								if(data.total == 1){//查询结果只有一条记录时，默认选中
									g.datagrid('selectRow', 0);
								}
								ops.oRows = [];
								ops.asyn = 1;
							}
						}).datagrid('renderformatterstyler');
						
					}
				}
			});
		}
	},
	inputEvents: {//键盘事件重造
		keydown: function(e){
			var _a2e = e.data.target;
			var t = $(_a2e);
			var _a2f = t.data("combo");
			var opts = t.combo("options");
			_a2f.panel.panel("options").comboTarget = _a2e;			
			switch (e.keyCode) {
				case 38:
					opts.keyHandler.up.call(_a2e, e);
					break;
				case 40:
					opts.keyHandler.down.call(_a2e, e);
					break;
				case 37:
					opts.keyHandler.left.call(_a2e, e);
					break;
				case 39:
					opts.keyHandler.right.call(_a2e, e);
					break;
				case 13:
					e.preventDefault();
					opts.keyHandler.enter.call(_a2e, e);
					return false;
				case 9:
					break;
				//case 8://退格键
				//	break;
				//case 46://删除键
				//	setTimeout(function() {
				//		t.combo('setText', '');
				//		t.combo('setValue', '');
				//		t.combo('reset');
				//	},
				//	opts.delay);
				//	break;
				case 27:
					var _a39 = $.data(_a2e, "combo").panel;
					_a39.panel("close");
					opts.keyHandler.esc.call(_a2e, e);//按esc键重置查询标志，重置后，需要读取服务器端数据
					break;
				default:
					if (opts.editable) {
						if (_a2f.timer) {
							clearTimeout(_a2f.timer);
						}
						_a2f.timer = setTimeout(function() {
							try{
								var q = t.combo("getText");
								if (_a2f.previousText != q) {
									_a2f.previousText = q;
									t.combo("showPanel");
									opts.keyHandler.query.call(_a2e, q, e);
									t.combo("validate");
								}
							}catch(e){}
						},
						opts.delay);
					}
			}
		}
	},
	onValidate:function(v){//验证成功后调用事件
		if(v){
			var co = $(this);
			
			if(co.combogrid('grid')){
				var inputs = $("input"),
					count = co.combogrid('grid').datagrid('getRows').length;//得到所有当前页记录数量
				if(count == 1 && co.combo('getValue') != '') {//搜索结果唯一时
					for (var i = 0; i < inputs.length; i++) {
						if (co.combogrid('textbox')[0] == inputs[i]) {
							for(j = (i + 1); j < inputs.length; j++){
								if($(inputs[j]).css('display') != 'none' && inputs[j].id != ''){
									inputs[j].focus();
									break;
								}
							}
						}
					}
				}
			}
		}
	}
});

$.extend($.fn.validatebox.defaults.rules, {
	//针对combo类控件，校验值（value）不能为空，参数param为控件ID，zz 2018-4-27
	combogridValue: {
		validator: function(value){
			var checkValue = $(this);
			return checkValue.parent().prev('.combogrid-f').combo('getValue').length > 0;
		},
		message: '请从下拉框中选择<br><span style="color:#999;">按回车键搜索，上下键选择</span>'
	},
	Number: {    
		validator: function (value) {    
			var reg =/^[0-9]*$/;    
			return reg.test(value);    
		},    
		message: 'Please input number.'    
	}
	
	/*
	//验证汉字    
	CHS: {    
		validator: function (value) {    
			return /^[\u0391-\uFFE5]+$/.test(value);    
		},    
		message: 'The input Chinese characters only.'    
	},    
	//移动手机号码验证    
	Mobile: {//value值为文本框中的值    
		validator: function (value) {    
			var reg = /^1[3|4|5|8|9]\d{9}$/;    
			return reg.test(value);    
		},    
		message: 'Please enter your mobile phone number correct.'    
	},    
	//国内邮编验证    
	ZipCode: {    
		validator: function (value) {    
			var reg = /^[0-9]\d{5}$/;    
			return reg.test(value);    
		},    
		message: 'The zip code must be 6 digits and 0 began.'    
	},    
	//数字    
	 //非负整数  
	Integer: {  
		validator: function (value) {  
			var reg = /^[1-9]\d*|0$/;  
			return reg.test(value);  
		},  
		message: '请输入非负整数'  
	}*/
});