/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/2/16
改造jeasyui的combogrid插件的keyHandler和onShowPanel事件，实现海量数据的异步处理方法，支持搜索

依赖库：scrollview

新增属性：
options.columns.search（bool）:true的字段支持搜索；
options.rows:存储原始数据
options.asynurl:异步读取的url地址
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
			var co = $(this),
				t = $.trim(co.combogrid('getText')),
				ops = co.combogrid('options'),
				rows = ops.rows,
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
				var rowsq = [];
				for (var i in rows) {
					var serachon = 0
					for(var j in searchField){
						if (rows[i][searchField[j]].toLowerCase().indexOf(t.toLowerCase()) != -1) {
							serachon = 1;
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
					//console.log(index);
					//g.datagrid('getRowIndex', index).removeClass("datagrid-row-selected");
					//co.combogrid('setValue', t);
				}
			} catch(err) {}
		}
	},
	onShowPanel:function(){
		var co = $(this)
			g = co.combogrid('grid');

		if(g.datagrid('getRows').length == 0){
			var t = $.trim(co.combogrid('getText')),
				pageSize = 50,
				mask = $('<div class="datagrid-mask" style="display:block"></div><div class="datagrid-mask-msg" style="display: block; left: 50%; height: 16px; margin-left: -98px; line-height: 16px;">Processing, please wait ...</div>'),
				ops = co.combogrid('options'),
				url = ops.asynurl;
				
			ops.rows = [];
			g.parent().append(mask);

			$.getJSON(url, function(data){				
				if(data.total > pageSize){
					g.datagrid({
						view:scrollview,
						pageSize:pageSize
					});
				}

				for(var i in data['rows']){
					ops.rows.push(data['rows'][i]);
				}

				g.datagrid('loadData', ops.rows);
				mask.remove();
				co.combogrid('setValue', t);
			});
		}
	}
});
