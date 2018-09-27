/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/17
单据打印对象，依赖组件：'print','barcode','qrcode','switchbutton','numberspinner'

*****************************************************************/

ebx.bd.print = {
	id: 0,
	mode: '',
	init:function(id, mode){//初始化
		this.id = id;
		this.mode = mode;
	},
	preview:function(){//预览
		this.printData(function(d){
			if(d){
				var win = $('<div style="background-color:#ccc;">').appendTo('body');
				ebx.loadStyles("/client/css/print.css");
				d.appendTo(win);
				var pringBtn = $('<div>').appendTo(win);
				pringBtn.linkbutton({
					text:'打印',
					iconCls:'icon-PrintDialogAccess-large',
					iconAlign:'top',
					size:'large',
					onClick: function(){
						win.window('close');
						var printbody = $('<div>');
						d.find('.pagediv').css({'margin':0,'border':0,'box-shadow':'0px 0px 0px #fff'});
						printbody.html(d.html()).print({globalStyles:false,iframe:true,stylesheet:'/client/css/print.css'});
					}
				}).css({
					'position':'absolute',
					'top':33,
					'left':5,
					'width':60
				});
				win.window({
					title: '打印预览',
					width:910,    
					height:'90%', 
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
						win.remove();
					}
				});
				$('body').find('.window-mask').on('click', function(){
					win.window('close');
				}); 
			}
		});
	},
	print: function(){//快速打印
		this.printData(function(d){
			if(d){
				var printbody = $('<div>');
				d.find('.pagediv').css({'margin':0,'border':0,'box-shadow':'0px 0px 0px #fff'});
				printbody.html(d.html()).print({globalStyles:false,iframe:true,stylesheet:'/client/css/print.css'});
			}
		});
	},
	printData:function(callBack){//打印数据渲染
		if(ebx.validInt(this.id) == 0){
			$.messager.show({
				title: '提示',
				msg: '请先保存单据！',
				timeout: 3000,
				showType: 'slide'
			});
			return;	
		}
		$.messager.progress({title:'正在打印...',text:''});
		var _id = this.id;
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + this.mode + '/print/',
			data: {findid: this.id, _:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result.result){
					var titleStr = '<div class="headtitle">' + result.title + '</div>',
						head = result.head,
						foot = result.foot,
						bdHead= '',
						headText = result.headText.length==0?'<div class="headText"></div>':'<div class="headText">' + result.headText + '</div>',
						bdFoot = '',
						footText = (result.footText.length==0?'':'<div class="footText">' + result.footText + '</div>'),
						list = result.bdList.rows,
						listStyle = result.listStyle,
						listBody = '',
						pageListBody = [],
						listHead = ''
						listFoot = {},
						pageFoot = {},
						pageSize = 0,
						listCount = '',
						pageCount = '',
						listBodyCount = 0,
						color = result.color.rows,
						size = result.size.rows,
						productSerial = '',
						border = ebx.validInt(result.border, 1),
						header = ebx.validInt(result.header, 1),
						footer = ebx.validInt(result.footer, 1),
						listWidth = ebx.validInt(result.listWidth, 100),
						headWidth = ebx.validInt(result.headWidth, 100),
						footWidth = ebx.validInt(result.footWidth, 100),
						headHeight = ebx.validInt(result.headHeight, 0);

					if(ebx.validInt(listStyle.length) == 0 || ebx.validInt(head.length) == 0 || ebx.validInt(foot.length) == 0){
						$.messager.alert('错误', '没有设置打印“'+result.title+'”的显示式样！', 'error');	
					}else{
						bdHead = '<table style="width:'+headWidth+'%;margin-top:'+headHeight+'px;" align="center" class="bdHeadtable">'
						var j = 0
						for(var i in head){
							if(j == 0)bdHead += '<tr>';
							bdHead += '<td class="bdHead" style="'+head[i].style+';">' + head[i].name +'：' + ebx.render.getRender((head[i].value?head[i].value:''), head[i].render) + '</td>';
							if(j == 2)bdHead += '</tr>';
							j++;
							if(j>2)j=0;
						}
						if(j<2)bdHead += '</tr>';
						bdHead += '</table>'
						
						bdFoot = '<table style="width:'+footWidth+'%;" align="center" class="bdFoottable">'
						var j = 0
						for(var i in foot){
							if(j == 0)bdFoot += '<tr>';
							bdFoot += '<td class="bdFoot" style="'+foot[i].style+';">' + foot[i].name +'：' +  ebx.render.getRender((foot[i].value?foot[i].value:''), foot[i].render)  + '</td>';
							if(j == 2)bdFoot += '</tr>';
							j++;
							if(j>2)j=0;
						}
						if(j<2)bdFoot += '</tr>';
						bdFoot += '</table>'
						
						if(header){
							listHead = '<tr><td class="listHead" style="border-right:2px solid #000;">No.</td>'
							for(var i in listStyle){
								listHead += '<td class="listHead" style="width:'+listStyle[i].width+';">' + listStyle[i].name + '</td>';
							}
							listHead += '</tr>'
						}
						
						var j = 0, page = 0;
						for(var i in list){
							listBodyCount++;
							page++;
							listBody += '<tr><td class="listBody" style="border-right:2px solid #000;text-align:center;">'+listBodyCount+'</td>';
							for(var j in listStyle){
								var v = list[i][listStyle[j].field.toLowerCase()]===''?'　':list[i][listStyle[j].field.toLowerCase()];
								listBody += '<td class="listBody" style="'+listStyle[j].style+';">' + ebx.render.getRender(v, listStyle[j].render) + '</td>';
								if(listStyle[j].foot){
									listFoot[listStyle[j].field.toLowerCase()] = ebx.validFloat(listFoot[listStyle[j].field.toLowerCase()]) + ebx.validFloat(list[i][listStyle[j].field.toLowerCase()]);
									pageFoot[listStyle[j].field.toLowerCase()] = ebx.validFloat(pageFoot[listStyle[j].field.toLowerCase()]) + ebx.validFloat(list[i][listStyle[j].field.toLowerCase()]);
								}else{
									listFoot[listStyle[j].field.toLowerCase()] = '';
									pageFoot[listStyle[j].field.toLowerCase()] = '';
								}
							}
							listBody += '</tr>';

							if(list[i].productSerial){
								if(list[i].productSerial.total > 0){
									if(list[i].productSerial.total>10){
										productSerial += '<div class="pagediv"><h3>附件：No.'+listBodyCount+'的串号：</h3>';
										for(var j in list[i].productSerial.rows){
											productSerial += list[i].productSerial.rows[j].productSerial + ' ';
										}
										productSerial += '</div>'
										listBody += '<tr><td class="listBody" style="border-right:2px solid #000;"></td>';
										listBody += '<td class="listBody" colspan="'+listStyle.length+'">串号：详见附件（串号数量大于10个的在附件中打印）';
										listBody += '</td>';
										listBody += '</tr>';
									}else{
										listBody += '<tr><td class="listBody" style="border-right:2px solid #000;"></td>';
										listBody += '<td class="listBody" colspan="'+listStyle.length+'">串号：';
										for(var j in list[i].productSerial.rows){
											listBody += list[i].productSerial.rows[j].productSerial + ' ';
										}
										listBody += '</td>';
										listBody += '</tr>';
									}
								}
							}
							if(list[i].colorSize){
								if(list[i].colorSize.total > 0){
									var colortext = '',
										sizetext = '';
									listBody += '<tr><td class="listBody" style="border-right:2px solid #000;"></td>';
									listBody += '<td class="listBody" colspan="'+listStyle.length+'">色码：';
									for(var j in list[i].colorSize.rows){
										for(var k in color){
											if(ebx.validInt(color[k].id) == ebx.validInt(list[i].colorSize.rows[j].colorid)){
												colortext = color[k].title;
											}
										}
										for(var k in size){
											if(ebx.validInt(size[k].id) == ebx.validInt(list[i].colorSize.rows[j].sizeid)){
												sizetext = size[k].title;
											}
										}
										listBody += colortext + (sizetext.length==0?'':'(' + sizetext + ')') + ':' + list[i].colorSize.rows[j].quantity + ' ';
										colortext = '';
										sizetext = '';
									}
									listBody += '</td>';
									listBody += '</tr>';
								}
							}
							if(page >= ebx.printPageSize){
								pageSize++;
								if(footer){
									pageCount += '<tr>';
									for(var i in listStyle){
										if(i == 0){
											pageCount += '<td class="listBody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+listStyle[i].width+';">本页合计</td>';
										}else{
											pageCount += '<td class="listBody" style="border-top:2px solid #000;width:'+listStyle[i].width+';'+listStyle[i].style+';">' + ebx.render.getRender(pageFoot[listStyle[i].field.toLowerCase()], listStyle[i].render) + '</td>';
										}
									}
									pageCount += '</tr>';
								}
								pageListBody.push({titleStr:titleStr, headText:headText, bdHead:bdHead, listHead:listHead, listBody: listBody, bdFoot: bdFoot, footText:footText, pageCount: pageCount});
								pageCount = '';
								pageFoot = {};
								listBody = '';
								page = 0;
							}
						}

						if(page <= ebx.printPageSize && page > 0){
							pageSize++;
							if(footer){
								pageCount += '<tr>';
								for(var i in listStyle){
									if(i == 0){
										pageCount += '<td class="listBody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+listStyle[i].width+';">本页合计</td>';
									}else{
										pageCount += '<td class="listBody" style="border-top:2px solid #000;width:'+listStyle[i].width+';'+listStyle[i].style+';">' + ebx.render.getRender(pageFoot[listStyle[i].field.toLowerCase()], listStyle[i].render) + '</td>';
									}
								}
								pageCount += '</tr>';
							}
							pageListBody.push({titleStr:titleStr, headText:headText, bdHead:bdHead, listHead:listHead, listBody: listBody, bdFoot: bdFoot, footText:footText, pageCount: pageCount});
						}
						
						if(footer){
							listCount += '<tr>';
							for(var i in listStyle){
								if(i == 0){
									listCount += '<td class="listBody" colspan="2" style="text-align:center;border-bottom:2px solid #000;width:'+listStyle[i].width+';">总计</td>';
								}else{
									listCount += '<td class="listBody" style="border-bottom:2px solid #000;width:'+listStyle[i].width+';'+listStyle[i].style+';">' + ebx.render.getRender(listFoot[listStyle[i].field.toLowerCase()], listStyle[i].render) + '</td>';
								}
							}
							listCount += '</tr>';
						}
						var s = '',
							qrcodediv = $('<div id="qrcode" class="qrcode">').appendTo('body'),
							barcord = $('<svg id="barcode" class="barcord"></svg>').appendTo('body');
						
						JsBarcode("#barcode", ebx.PrefixInteger(_id, 11), {
							displayValue: false,
							height:50,
							width:1.5,//每条竖线间隔距离
							fontSize:15,
							lineColor: "#000"
						});
						
						var qrcode = new QRCode(document.getElementById("qrcode"), {
							width: 100, //设置宽高
							height: 100
						});
						qrcode.makeCode('https://www.zydsoft.com');
						setTimeout(function(){
							for(var i in pageListBody){
								s += '<div class="pagediv">'
								s += pageListBody[i].titleStr;
								s += pageListBody[i].headText;
								s += pageListBody[i].bdHead;
								s += '<table style="width:'+listWidth+'%;" align="center" class="listHeadtable">' 
								s += pageListBody[i].listHead;
								s += pageListBody[i].listBody;
								s += pageListBody[i].pageCount;
								s += listCount;
								s += '</table>';
								s += pageListBody[i].bdFoot;
								s += pageListBody[i].footText;
								s += '<div class="pageSize">共 ' + pageSize + ' 页，第 ' + (ebx.validInt(i) + 1) + ' 页，打印时间：' + new Date().Format("yyyy-MM-dd hh:mm:ss") + '</div>';
								s += '</div>';
								$('#qrcode').remove();
								$('#barcode').remove();
							}
							if(productSerial.length > 0){
								s += productSerial;
							}
							var printData = $('<div>').html(s);
							if(border == 0){
								printData.find('td').css({'border':0});
								printData.find('table').css({'border':0});
							}
							printData.find('.pagediv:first').append(barcord).append(qrcodediv);
							barcord.show();
							qrcodediv.show();
							if(callBack)callBack(printData);
						},0)
					}
				}else{
					$.messager.alert('错误', '打印失败！<br>' + result.msg, 'error');	
				}
				$.messager.progress('close');
			}
		});
	},
	setup: function(){//打印设置
		var win = $('<div style="padding:3px;text-align:center;">').appendTo('body'),
			pageSize = $('<div>').appendTo(win),
			printType = $('<div>').appendTo(win),
			foot = $('<div style="padding:3px;text-align:center;">'),
			okBtn = $('<div>').appendTo(foot),
			cancelBtn = $('<div>').appendTo(foot),
			defaultBtn = $('<div>').appendTo(foot);
		
		win.window({
			title: '打印设置',
			width:200,    
			height:110, 
			maxWidth:'90%',
			maxHeight:'90%',
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			resizable:false,
			noheader:true,
			border:'thin',
			shadow:false,
			footer: foot,
			onBeforeClose: function(){
				win.remove();
			}
		}).css({'padding':10});
		
		$('body').find('.window-mask').on('click', function(){
			win.window('close');
		}); 

		pageSize.numberspinner({    
			min: 1,    
			max: 100,    
			editable: true,
			label:'每页打印行数',
			value: ebx.printPageSize
		}).css({'margin':'5px'}); 

		printType.combobox({
			label:'打印样式',
			data:[{
				text: '宽行',
				id: '0'
			},{
				text: '窄行',
				id: '1'
			}],    
			valueField:'id',    
			textField:'text',
			value:ebx.printType,
			panelHeight: 'auto',
			disabled:true,
			onChange:function(){
				ebx.printType = printType.combobox('getValue');
				setPrintToStorage();
			}
		}).css({'margin':'5px'}); 

		okBtn.linkbutton({
			text: '确定',
			iconCls:'icon-AcceptTask',
			plain:true,
			onClick:function(){
				ebx.printPageSize = pageSize.numberspinner('getValue');
				setPrintToStorage();
				win.window('close');
			}
		});
		cancelBtn.linkbutton({
			text: '取消',
			iconCls:'icon-DeclineInvitation',
			plain:true,
			onClick:function(){
				win.window('close');
			}
		});


		defaultBtn.linkbutton({
			text:'默认',
			plain: true,
			iconCls:'icon-Recurrence',
			onClick:function(){
				pageSize.numberspinner('setValue', 10);
				//ebx.printPageSize = 10;
				printType.combobox('setValue', 0);
				//ebx.printType = 0;
				//setPrintToStorage();
			}
		});
		
		function setPrintToStorage(){
			ebx.storage.set('print', {printType:ebx.printType, printPageSize: ebx.printPageSize});
		}
		win.parent().find('.panel-footer').css({'border-left': 0,'border-bottom': 0,'border-right': 0});
		win.window('resize');
	}
}