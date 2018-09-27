/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/5
单据串号/色码编辑对象

*****************************************************************/

ebx.productSerial = {
	open: function(title, seriallength, d, index){//打开串号编辑界面，参数：title：产品名称，seriallength：串号长度，d：单据明细datagrid对象，index：单据明细datagrid得index
		var v = d.datagrid('getData').firstRows[index].productSerial,
			win = $('<div>').appendTo($('body')),
			productSerial = $('<div>').appendTo(win),
			toolbar = $('<div>'),
			searchtext = $('<div>').appendTo(toolbar),
			newBtn = $('<div>').appendTo(toolbar),
			delBtn = $('<div>').appendTo(toolbar),
			removebtn = $('<div>').appendTo(toolbar),
			outbtn = $('<div>').appendTo(toolbar),
			inputbtn = $('<div>').appendTo(toolbar),
			seriallengthtext = ebx.validInt(seriallength)==0?'不限制':ebx.validInt(seriallength)+'位',
			checktext = $('<table style="border-collapse:collapse;border-spacing:0px;border:0px" align="right"><tr><td>数量校验：</td><td></td></tr></table>').appendTo(toolbar),
			check = $('<div>').appendTo(checktext.find('td:last')),
			columnsData = [[    
				{field:'productSerial',title:'串号',width:300,sortable:true,
					editor:{
						type:'textbox',
						options:{
							validType:seriallength>0?['string','length[' + seriallength + ', ' + seriallength + ']']:'string',
							invalidMessage:'串号长度必须为：' + seriallengthtext,
							required:seriallength>0?true:false
						}
					}
				}  
			]],
			inputbtntemplate = $('<div>');
			
		if(!v){
			v = {total:0, rows: []};
		}
		if(d.datagrid('getData').firstRows[index].colorSize){
			if(ebx.validInt(d.datagrid('getData').firstRows[index].colorSize.total) > 0){
				$.messager.alert('错误','串号和颜色尺码不能同时使用！','error');
				return;
			}
		}
		
		win.window({
			title: title + ' 的串号，长度：' + seriallengthtext,
			width:580,    
			height:640, 
			maxWidth:'90%',
			maxHeight:'90%',
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			resizable:false,
			border:'thin',
			shadow:false,
			onBeforeClose: function(){
				var data = productSerial.datagrid('getData').firstRows,
					data1 = [],
					data2 = [],
					reserialcount = 0,
					reserial = '';
					
				if(data.length > ebx.productSerialLength){
					$.messager.alert('错误','单行产品串号的数量上限为：' + ebx.productSerialLength +'，当前数量为：' + data.length,'error');
					return false;
				}

				for(var i in data){
					reserialcount = 0
					if(data[i].productSerial != '' && data[i].productSerial != undefined){
						data1.push(data[i]);
						data2.push(data[i].productSerial);
						if(data[i].productSerial.length != ebx.validInt(seriallength) && ebx.validInt(seriallength) > 0){
							$.messager.show({
								title: '错误',
								msg: '串号：' + data[i].productSerial + ' 的长度有误！串号长度应该为：' + seriallengthtext,
								timeout: 3000,
								showType: 'slide'
							});
							//productSerial.datagrid('scrollTo', i);
							if(i > ebx.pageSize){
								productSerial.datagrid('gotoPage', (ebx.validInt(i/ebx.pageSize) + 1));
							}
							setTimeout(function(){
								productSerial.datagrid('editkeyboard', {index: i, field:'productSerial'});
								productSerial.datagrid('selectRow', i);
							}, 0);
							return false;
						}
					}
				}
				var nary=data2.sort();
				for(var i=0;i<data2.length;i++){
					if (nary[i]==nary[i+1]){
						if(reserial.indexOf(nary[i]) < 0){
							reserial += nary[i] + ',';
						}
					}
				}

				if(reserial.length > 0){
					productSerial.datagrid('clearSelections');
					$.messager.alert('错误','串号：' + reserial.substr(0, reserial.length - 1) + ' 存在重复','error');
					return false;
				}
				var oldquantity = d.datagrid('getData').firstRows[index].quantity;
				if(ebx.productSerialQuantityCheck){
					if(oldquantity != data1.length){
						$.messager.alert('错误','串号数量有误，数量应该为：' + oldquantity + '，当前数量：' + data1.length +'，关闭“数量校验”可忽略。','error');
						return false;
					}
				}
				d.datagrid('updateRow', {
					index: index,
					row:{
						productSerial: data1.length>0?{total: data1.length, rows: data1}:[],
						quantity: data1.length==0?1:data1.length
					}
				})
				if(oldquantity != data1.length && data1.length > 0){
					d.datagrid('editkeyboard', {index: index, field:'quantity'});
				}
			}
		});
		$('body').find('.window-mask').on('click', function(){
			win.window('close');
		}); 
		productSerial.datagrid({    
			view:scrollview,
			pageSize:ebx.pageSize,
			remoteSort:false,
			data: v,
			border:false,
			rownumbers:true,
			singleSelect:true,
			striped:true,
			width:'100%',
			height:'100%',
			columns:columnsData,
			toolbar: toolbar,
			fitColumns:true,
			onLoadSuccess: function(data){
				if(data.total > 128){
					productSerial.datagrid('resize');
				}
			}
		});
		searchtext.textbox({    
			buttonText:'搜索',
			onClickButton: function(){
				productSerial.datagrid('clearSelections');
				var find = searchtext.textbox('getValue'),
					data = productSerial.datagrid('getData').firstRows;
				if(find.length <= 0) return;
				for(var i in data){
					if(data[i].productSerial != undefined && data[i].productSerial != ''){
						if(find.toLowerCase() == data[i].productSerial.toLowerCase()){
							if(i > ebx.pageSize){
								productSerial.datagrid('gotoPage', (ebx.validInt(i/ebx.pageSize) + 1));
							}
							setTimeout(function(){
								//productSerial.datagrid('scrollTo', i + i%ebx.pageSize);
								productSerial.datagrid('selectRow', i);
								
							},0);
							return;
						}
					}
				}
			}
		});
		searchtext.textbox('textbox').bind('keydown', function(e) {  
			if (e.keyCode == 13) { 
				productSerial.datagrid('clearSelections');
				var find = searchtext.textbox('getValue'),
					data = productSerial.datagrid('getData').firstRows;
				if(find.length <= 0) return;
				for(var i in data){
					if(data[i].productSerial != undefined && data[i].productSerial != ''){
						if(find.toLowerCase() == data[i].productSerial.toLowerCase()){
							if(i > ebx.pageSize){
								productSerial.datagrid('gotoPage', (ebx.validInt(i/ebx.pageSize) + 1));
							}
							setTimeout(function(){
								//productSerial.datagrid('scrollTo', (i - 70));
								productSerial.datagrid('selectRow', i);
							},0);
							return;
						}
					}
				}
			}  
		});
		newBtn.linkbutton({
			text:'新行',
			iconCls: 'icon-CellsInsertDialog',
			plain:true,
			onClick: function(){
				productSerial.datagrid('appendRow', {});
				productSerial.datagrid('selectRow', productSerial.datagrid('getData').total - 1);
				productSerial.datagrid('editkeyboard', {index: productSerial.datagrid('getData').total - 1, field:'productSerial'});
			}
		});
		delBtn.linkbutton({
			text:'删行',
			iconCls: 'icon-CellsDelete',
			plain:true,
			onClick: function(){
				var index = productSerial.datagrid('getRowIndex', productSerial.datagrid('getSelected'));
				if(index < 0){
					$.messager.show({
						title: '提示',
						msg: '请先选中一行。',
						timeout: 3000,
						showType: 'slide'
					});									
					return;
				}
				$.messager.confirm('确认对话框', '您想要删除吗？删除操作后数据将无法恢复。', function(r){
					if (r){
						productSerial.datagrid('deleteRow', index);
						if(index >= productSerial.datagrid('getData').total && index > 0) index--;
						if(productSerial.datagrid('getData').total == 0 || index < 0){
							productSerial.datagrid('loadData', { total: 0, rows: [] }); 
						}else{
							productSerial.datagrid('selectRow', index);
						}
					}
				});
			}
		});
		removebtn.linkbutton({
			text:'清空',
			iconCls: 'icon-TableDelete',
			plain:true,
			onClick: function(){
				$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
					if (r){
						productSerial.datagrid('loadData', { total: 0, rows: [] }); 
					}
				});
			}
		});
		outbtn.linkbutton({
			text:'导出',
			iconCls: 'icon-ImportExcel',
			plain:true,
			onClick: function(){
				var data = productSerial.datagrid('getData').firstRows;
				ebx.clipBoardData(columnsData, {total: data.length, rows: data} );
			}
		});
		inputbtntemplate.menu({}).menu('appendItem', {
			text: '导入模板',
			iconCls:'icon-FileSaveAsExcelXlsx',
			onclick:function(){
				ebx.importTemplate(columnsData, '串号');
			}
		})
		inputbtn.splitbutton({
			text:'导入',
			iconCls: 'icon-ExportExcel',
			plain:true,
			onClick: function(){
				var ExportBtn = $(this);
				
				ebx.importExcel.fileInput = $('<input type="file" accept=".xls,.xlsx">').appendTo('body');
				ebx.importExcel.fileInput.change(function(){
					$.messager.progress({title:'正在导入...',text:''}); 
					ExportBtn.linkbutton('disable');
					ebx.importExcel.datagridObj = productSerial;
					//ebx.importExcel.tabObj = [];
					ebx.importExcel.btnObj = ExportBtn;
					ebx.importExcel.getFile(this, function(d){
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
						if(dataData.length > ebx.productSerialLength){
							$.messager.alert('错误','串号导入数量上限为：' + ebx.productSerialLength +'，当前导入数量为：' + dataData.length,'error');
							ebx.importExcel.btnObj.linkbutton('enable');
							$.messager.progress('close');
							return;
						}
						datagrid.datagrid('loadData', {total: dataData.length, rows: dataData}); 
						
						if(tab) ebx.setEditStatus(tab, true);
						$.messager.show({
							title: '提示',
							msg: '成功导入了：' + importData.length + ' 行数据。',
							timeout: 3000,
							showType: 'slide'
						});	
						ebx.importExcel.btnObj.linkbutton('enable');
						$.messager.progress('close');
						ebx.importExcel.fileInput.remove();
						ebx.importExcel.datagridObj = null;
						ebx.importExcel.tabObj = null;
						ebx.importExcel.btnObj = null;
					});
				});
				ebx.importExcel.fileInput.trigger("click");
			},
			menu:inputbtntemplate
		});
		
		check.switchbutton({
			onText:'开',
			offText:'关',
			checked:ebx.productSerialQuantityCheck?true:false,
			width:50,
			height:24,
			onChange:function(checked){
				if(checked){
					ebx.productSerialQuantityCheck = 1
					ebx.storage.set('productSerialQuantityCheck', ebx.productSerialQuantityCheck);
				}else{
					ebx.productSerialQuantityCheck = 0
					ebx.storage.set('productSerialQuantityCheck', ebx.productSerialQuantityCheck);
				}
			}
			//handleText:'数量',
			//handleWidth:12
		});
	},
	SerialtoProduct: function(t, d, tab){//搜索串号添加产品，参数：t：搜索文本框的textbox对象，d：datagrid表格对象，tab：bd的tab属性（用于标记单据修改状态） 2018-8-9 zz
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/product/open/',
			data: {find: t.textbox('getValue'), _:(new Date()).getTime()},//style名称必须和mode相吻合
			dataType: "json",
			success: function(result){
				if(result){
					if(result.total == 1){
						var data = d.datagrid('getData').firstRows,
							addflag = 0,
							index = 0,
							serialText = '';
						
						for(var i in data){
							if(data[i].productid == result.rows[0].productid){
								addflag = 1;
								index = i;
								break;
							}
						}
						
						if(addflag == 0){
							d.datagrid('appendRow', result.rows[0]);
							d.datagrid('selectRow', d.datagrid('getData').total - 1);
							if(result.rows[0].productSerial){
								if(result.rows[0].productSerial.total == 1){
									serialText = '<br>串号：' + result.rows[0].productSerial.rows[0].productSerial;
								}
							}
						}else{
							if(result.rows[0].productSerial){
								if(result.rows[0].productSerial.total == 1){
									if(data[index].productSerial){
										var rows = data[index].productSerial.rows;
									    if(rows){
										    if(rows.length >= ebx.productSerialLength){
											    $.messager.alert('错误','单行产品串号的数量上限为：' + ebx.productSerialLength +'。','error');
											    return false;
										    }

										    for(var i in rows){
											    if(rows[i].productSerial == result.rows[0].productSerial.rows[0].productSerial){
												    $.messager.alert('错误', '产品：' + data[index].productname +' 的串号：' + rows[i].productSerial + ' 已存在！', 'error', function(){
													    t.textbox('textbox').focus().select();
												    });	
												    return;
											    }
										    }
										    if(data[index].productSerial.length == 0){
											    data[index].productSerial = result.rows[0].productSerial;
										    }else{
											    rows.push(result.rows[0].productSerial.rows[0]);
											    data[index].productSerial.total++;
										    }
										}else{
										    data[index].productSerial = result.rows[0].productSerial;
										}
									}else{
										data[index].productSerial = result.rows[0].productSerial;
									}
									serialText = '<br>串号：' + result.rows[0].productSerial.rows[0].productSerial;
									data[index].quantity = data[index].productSerial.total;
								}else{
									return;
								}
							}else{
								data[index].quantity++;
							}
							
							var TaxRate = ebx.validFloat(data[index].taxRate);
							
							data[index].amount = ebx.validFloat(data[index].price) * ebx.validFloat(data[index].quantity);
							data[index].aQuantity = ebx.validFloat(data[index].quantity) * ebx.validFloat(data[index].relation);
							
							if(TaxRate != -1){
								data[index].taxAmount = data[index].amount / (TaxRate + 1) * TaxRate;
							}else{
								data[index].taxAmount = 0;
							}
							data[index].nat = ebx.validFloat(data[index].amount) - ebx.validFloat(data[index].taxAmount);
							d.datagrid('appendRow', {});
							d.datagrid('deleteRow', d.datagrid('getData').total - 1);
							d.datagrid('selectRow', index);
						}
						$.messager.show({
							title: '提示',
							msg: '产品：' + result.rows[0].productname + ' 添加成功！' + serialText,
							timeout: 2000,
							showType: 'slide'
						});	

						if(tab) ebx.setEditStatus(tab, true);
					}
				}
				t.textbox('textbox').focus().select();
			}
		});
	}
}

ebx.colorSize = {//单据色码处理对象 2018-8-13 zz
	title:'',
	productid:0,
	group:{},
	row:{},
	index:0,
	d: [],
	tab: [],
	init:function(title, d, index, tab){//色码编辑初始化，参数：title：产品名称，d：单据明细datagrid对象，index：单据明细datagrid的index，tab：用于表示编辑状态的tab对象
		this.title = title;
		this.index = index;
		this.d = d;
		this.row = d.datagrid('getData').firstRows[index];
		this.productid = ebx.validInt(this.row.productid);
		this.tab = tab
	},
	open: function(){//打开编辑面板
		var _group = this.group,
			_productid = this.productid,
			_title = this.title,
			_title = this.title,
			_row = this.row,
			_d = this.d,
			_index = this.index,
			_tab = this.tab,
			oldquantity = _d.datagrid('getData').firstRows[_index].quantity;
			
		if(_d.datagrid('getData').firstRows[_index].productSerial){
			if(ebx.validInt(_d.datagrid('getData').firstRows[_index].productSerial.total) > 0){
				$.messager.alert('错误','串号和颜色尺码不能同时使用！','error');
				return;
			}
		}
		
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/product/getgroup/',
			data: {id: _productid, _:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result){
					if(result.total == 0){
						$.messager.alert('错误','产品：' + _title + ' 未设置颜色尺码组！','error');
						return false;
					}else{
						_group = result.rows[0];
						var win = $('<div>').appendTo($('body')),
							colorSize = $('<div>').appendTo(win),
							toolbar = $('<div>'),
							outbtn = $('<div>').appendTo(toolbar),
							delall = $('<div>').appendTo(toolbar),
							colorSizedata = $('<div>').appendTo(win),
							checktext = $('<table style="border-collapse:collapse;border-spacing:0px;border:0px" align="right"><tr><td>数量校验：</td><td></td></tr></table>').appendTo(toolbar),
							check = $('<div>').appendTo(checktext.find('td:last'));

						win.window({
							title: _title + ' 的颜色尺码，色码组：' + _group.title,
							width:640,    
							height:480, 
							maxWidth:'90%',
							maxHeight:'90%',
							modal:true,
							collapsible:false,
							minimizable:false,
							maximizable:false,
							resizable:true,
							border:'thin',
							shadow:false,
							onBeforeClose: function(){
								var data = colorSizedata.datagrid('getRows'),
									colorSize = {total:0, rows: []},
									qty = 0;
								
								for(var i in data){
									for(var k in data[i]){
										if(k.toLowerCase() != 'color' && k.toLowerCase() != 'colorid'){
											if(ebx.validInt(data[i][k]) != 0){
												colorSize.rows.push({colorid:data[i].colorid,sizeid:ebx.validInt(k.substr(5, k.length)),quantity:ebx.validInt(data[i][k])});
												qty += ebx.validInt(data[i][k]);
												colorSize.total++
											}
										}
									}
								}
								var oldquantity = _d.datagrid('getData').firstRows[_index].quantity;
								if(ebx.colorSizeQuantityCheck){
									if(oldquantity != qty){
										$.messager.alert('错误','色码数量有误，数量应该为：' + oldquantity + ' ，当前数量：' + qty +'，关闭“数量校验”可忽略。','error');
										return false;
									}
								}
								_d.datagrid('updateRow', {
									index: _index,
									row:{
										colorSize: colorSize.rows.length>0?colorSize:[],
										quantity: qty==0?1:qty
									}
								})
								if(oldquantity != qty && qty > 0){
									_d.datagrid('editkeyboard', {index: _index, field:'quantity'});
								}

							}
						});
						$('body').find('.window-mask').on('click', function(){
							win.window('close');
						});
						
						check.switchbutton({
							onText:'开',
							offText:'关',
							checked:ebx.colorSizeQuantityCheck?true:false,
							width:50,
							height:24,
							onChange:function(checked){
								if(checked){
									ebx.colorSizeQuantityCheck = 1
									ebx.storage.set('colorSizeQuantityCheck', ebx.colorSizeQuantityCheck);
								}else{
									ebx.colorSizeQuantityCheck = 0
									ebx.storage.set('colorSizeQuantityCheck', ebx.colorSizeQuantityCheck);
								}
							}
							//handleText:'数量',
							//handleWidth:12
						});
						
						$.ajax({
							type: 'post', 
							url: 'server/SimpChinese/product/getcolorSize/',
							data: {id: _group.id, _:(new Date()).getTime()},
							dataType: "json",
							success: function(result){
								if(result){
									if(_row.colorSize){
										for(var i in result.rows){
											for(var k in _row.colorSize.rows){
												if(ebx.validInt(_row.colorSize.rows[k].colorid) == ebx.validInt(result.rows[i].colorid)){
													for(var j in result.rows[i]){
														if(ebx.validInt(j.substr(5, j.length), -1) == ebx.validInt(_row.colorSize.rows[k].sizeid)){
															result.rows[i][j] = ebx.validInt(_row.colorSize.rows[k].quantity);
														}
													}
												}
											}
										}
									}
									
									colorSizedata.datagrid({
										remoteSort:false,
										view:scrollview,//使用scrollview插件，否则无法使用renderformatterstyler插件
										pageSize:500,
										data: result,
										border:false,
										//rownumbers:true,
										singleSelect:true,
										striped:true,
										width:'100%',
										height:'100%',
										columns: [result.style.rows],
										lastinsertRow:false,
										toolbar: toolbar
									}).datagrid('renderformatterstyler');
									
									outbtn.linkbutton({
										text:'导出',
										iconCls: 'icon-ImportExcel',
										plain:true,
										onClick: function(){
											var data = colorSizedata.datagrid('getRows')
											ebx.clipBoardData([result.style.rows], {total: data.length, rows: data} );
										}
									});
									
									delall.linkbutton({
										text:'清空',
										iconCls: 'icon-TableDelete',
										plain:true,
										onClick: function(){
											$.messager.confirm('确认对话框', '您想要清空吗？清空操作后数据将无法恢复。', function(r){
												if (r){
													var data = colorSizedata.datagrid('getRows');
													for(var i in data){
														for(var j in data[i]){
															if(j.toLowerCase() != 'colorid' && j.toLowerCase() != 'color'){
																data[i][j] = '';
															}
														}
														colorSizedata.datagrid('refreshRow', i);
													}
													if(_tab) ebx.setEditStatus(_tab, true);
												}
											});
										}
									});
								}
							}
						});
					}
				}
			}
		});
	}
}