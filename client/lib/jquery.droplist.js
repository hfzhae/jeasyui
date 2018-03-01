/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
改造jeasyui的combogrid插件的keyHandler和onShowPanel事件，实现海量数据的异步处理方法，支持搜索

依赖库：scrollview

新增属性：
options.columns.search（bool）:true的字段支持搜索；
options.oRows:存储原始数据
options.asynurl:异步读取的url地址
options.asyn:是否从服务器端读取数据，0为读取，默认0，读取后置1，按esc键置0

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
			try{
				$(this).combogrid('showPanel');
				var co = $(this).combogrid('grid');
				var selected = co.datagrid('getSelected');

				if (selected) {  
					var index = co.datagrid('getRowIndex', selected);  
					co.datagrid('selectRow', index + 1);  
				} else {  
					co.datagrid('selectRow', 0);  
				} 
			} catch(err) {}
		},
		left: function(){},
		right:function(){},
		enter: function(){
			$(this).combogrid('showPanel');
			var co = $(this),
				t = $.trim(co.combogrid('getText')),
				ops = co.combogrid('options'),
				rows = ops.oRows,
				selected = co.combogrid('grid').datagrid('getSelected'),
				columns = ops.columns,
				searchField = [];  
			for (var j in columns[0]){
				if(columns[0][j].search){
					searchField.push(columns[0][j].field);//找出需要搜索的字段名
				}
			}
			
			if (selected) {  
				co.combogrid('hidePanel');
				window.event.keyCode = 9;
			} else {  
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
			}  
		},
		query: function(q){
			try{
				var co = $(this),
					g = co.combogrid('grid'),
					t = $.trim(co.combogrid('getText'));
				var selected = g.datagrid('getSelected');  
				if (selected) {  
					var index = g.datagrid('getRowIndex', selected); 
					g.datagrid('unselectRow', index);//键盘响应，取消选中的行
				}
			} catch(err) {}
		},
		esc: function(){
			var co = $(this)
			g = co.combogrid('grid'),
			ops = co.combogrid('options')
			ops.asyn = 0;
		}
	},
	onShowPanel: function(){
		var co = $(this)
			g = co.combogrid('grid'),
			ops = co.combogrid('options'),
			pageSize = 50;
			
		if(g.datagrid('getRows').length == 0 || !ops.asyn){
			var t = $.trim(co.combogrid('getText')),
				mask = $('<div class="datagrid-mask" style="display:block"></div><div class="datagrid-mask-msg" style="display: block; left: 50%; height: 16px; margin-left: -98px; line-height: 16px;">Processing, please wait ...</div>'),
				url = ops.asynurl;
			if(!url)return;
			g.parent().append(mask);
			g.datagrid({
				view:scrollview,
				pageSize:pageSize
			});
			ops.oRows = [];
			ops.asyn = 1;
			//$.getJSON(url, { v: (new Date()).getTime() }, function(data){				
			$.getJSON(url, function(data){				
				for(var i in data['rows']){
					ops.oRows.push(data['rows'][i]);
				}
				g.datagrid('loadData', {
					total:data.rows.length,
					rows:data.rows
				});
				mask.remove();
				co.combogrid('setValue', t);
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
							var q = t.combo("getText");
							if (_a2f.previousText != q) {
								_a2f.previousText = q;
								t.combo("showPanel");
								opts.keyHandler.query.call(_a2e, q, e);
								t.combo("validate");
							}
						},
						opts.delay);
					}
			}
		}
	}

});
