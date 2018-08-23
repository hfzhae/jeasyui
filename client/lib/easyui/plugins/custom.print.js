/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/17
单据打印对象，依赖于jquery.print.js

*****************************************************************/

ebx.bd.print = {
	id: 0,
	mode: '',
	title: '',
	init:function(id, mode){
		this.id = id;
		this.mode = mode;
	},
	preview:function(){
		this.printdata(function(d){
			if(d){
				var win = $('<div style="background-color:#525659;">').appendTo('body');
				// 动态加载css文件                                              
				function loadStyles(url) {                                     
					 var link = document.createElement("link");                 
					 link.type = "text/css";                                    
					 link.rel = "stylesheet";                                   
					 link.href = url;                                           
					 document.getElementsByTagName("head")[0].appendChild(link);
				}                                                              
				// 测试
				loadStyles("/client/css/print.css");
				
				d.appendTo(win);
				
				var pringbtn = $('<div>').appendTo(win);
				
				pringbtn.linkbutton({
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
					width:'60%',    
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
	print: function(){
		this.printdata(function(d){
			if(d){
				var printbody = $('<div>');
				d.find('.pagediv').css({'margin':0,'border':0,'box-shadow':'0px 0px 0px #fff'});
				printbody.html(d.html()).print({globalStyles:false,iframe:true,stylesheet:'/client/css/print.css'});
			}
		});
	},
	printdata:function(callback){
		if(ebx.validInt(this.id) == 0){
			$.messager.alert('错误', '请先保存单据！', 'error');	
		}
		$.messager.progress({title:'正在打印...',text:''});
		var _id = this.id,
			_PrefixInteger = this.PrefixInteger;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + this.mode + '/print/',
			data: {findid: this.id, _:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result.result){
					var titlestr = '<div class="headtitle">' + result.title + '</div>',
						head = result.head,
						foot = result.foot,
						bdhead= '',
						headtext = result.headtext.length==0?'<div class="headtext"></div>':'<div class="headtext">' + result.headtext + '</div>',
						bdfoot = '',
						foottext = (result.foottext.length==0?'':'<div class="foottext">' + result.foottext + '</div>'),
						list = result.bdlist.rows,
						liststyle = result.liststyle,
						listbody = '',
						pagelistbody = [],
						listhead = ''
						listfoot = {},
						pagefoot = {},
						pagesize = 0,
						listcount = '',
						pagecount = '',
						listbodycount = 0,
						color = result.color.rows,
						size = result.size.rows,
						productserial = '',
						border = ebx.validInt(result.border, 1),
						header = ebx.validInt(result.header, 1),
						footer = ebx.validInt(result.footer, 1),
						listwidth = ebx.validInt(result.listwidth, 100),
						headwidth = ebx.validInt(result.headwidth, 100),
						footwidth = ebx.validInt(result.footwidth, 100),
						headheight = ebx.validInt(result.headheight, 0);

					if(ebx.validInt(liststyle.length) == 0 || ebx.validInt(head.length) == 0 || ebx.validInt(foot.length) == 0){
						$.messager.alert('错误', '没有设置打印“'+result.title+'”的显示式样！', 'error');	
					}else{
						bdhead = '<table style="width:'+headwidth+'%;margin-top:'+headheight+'px;" align="center" class="bdheadtable">'
						var j = 0
						for(var i in head){
							if(j == 0)bdhead += '<tr>';
							bdhead += '<td class="bdhead" style="'+head[i].style+';">' + head[i].name +'：' + ebx.Render.getRender((head[i].value?head[i].value:''), head[i].render) + '</td>';
							if(j == 2)bdhead += '</tr>';
							j++;
							if(j>2)j=0;
						}
						if(j<2)bdhead += '</tr>';
						bdhead += '</table>'
						
						bdfoot = '<table style="width:'+footwidth+'%;" align="center" class="bdfoottable">'
						var j = 0
						for(var i in foot){
							if(j == 0)bdfoot += '<tr>';
							bdfoot += '<td class="bdfoot" style="'+foot[i].style+';">' + foot[i].name +'：' +  ebx.Render.getRender((foot[i].value?foot[i].value:''), foot[i].render)  + '</td>';
							if(j == 2)bdfoot += '</tr>';
							j++;
							if(j>2)j=0;
						}
						if(j<2)bdfoot += '</tr>';
						bdfoot += '</table>'
						
						if(header){
							listhead = '<tr><td class="listhead" style="border-right:2px solid #000;">No.</td>'
							for(var i in liststyle){
								listhead += '<td class="listhead" style="width:'+liststyle[i].width+';">' + liststyle[i].name + '</td>';
							}
							listhead += '</tr>'
						}
						
						var j = 0, page = 0;
						for(var i in list){
							listbodycount++;
							page++;
							listbody += '<tr><td class="listbody" style="border-right:2px solid #000;">'+listbodycount+'</td>';
							for(var j in liststyle){
								var v = list[i][liststyle[j].field.toLowerCase()]===''?'　':list[i][liststyle[j].field.toLowerCase()];
								listbody += '<td class="listbody" style="'+liststyle[j].style+';">' + ebx.Render.getRender(v, liststyle[j].render) + '</td>';
								if(liststyle[j].foot){
									listfoot[liststyle[j].field.toLowerCase()] = ebx.validFloat(listfoot[liststyle[j].field.toLowerCase()]) + ebx.validFloat(list[i][liststyle[j].field.toLowerCase()]);
									pagefoot[liststyle[j].field.toLowerCase()] = ebx.validFloat(pagefoot[liststyle[j].field.toLowerCase()]) + ebx.validFloat(list[i][liststyle[j].field.toLowerCase()]);
								}else{
									listfoot[liststyle[j].field.toLowerCase()] = '';
									pagefoot[liststyle[j].field.toLowerCase()] = '';
								}
							}
							listbody += '</tr>';

							if(list[i].productserial){
								if(list[i].productserial.total > 0){
									if(list[i].productserial.total>10){
										productserial += '<div class="pagediv"><h3>附件：No.'+listbodycount+'的串号：</h3>';
										for(var j in list[i].productserial.rows){
											productserial += list[i].productserial.rows[j].productserial + ' ';
										}
										productserial += '</div>'
										listbody += '<tr><td class="listbody" style="border-right:2px solid #000;"></td>';
										listbody += '<td class="listbody" colspan="'+liststyle.length+'">串号：详见附件（串号数量大于10个的在附件中打印）';
										listbody += '</td>';
										listbody += '</tr>';
									}else{
										listbody += '<tr><td class="listbody" style="border-right:2px solid #000;"></td>';
										listbody += '<td class="listbody" colspan="'+liststyle.length+'">串号：';
										for(var j in list[i].productserial.rows){
											listbody += list[i].productserial.rows[j].productserial + ' ';
										}
										listbody += '</td>';
										listbody += '</tr>';
									}
								}
							}
							if(list[i].colorsize){
								if(list[i].colorsize.total > 0){
									var colortext = '',
										sizetext = '';
									listbody += '<tr><td class="listbody" style="border-right:2px solid #000;"></td>';
									listbody += '<td class="listbody" colspan="'+liststyle.length+'">色码：';
									for(var j in list[i].colorsize.rows){
										for(var k in color){
											if(ebx.validInt(color[k].id) == ebx.validInt(list[i].colorsize.rows[j].colorid)){
												colortext = color[k].title;
											}
										}
										for(var k in size){
											if(ebx.validInt(size[k].id) == ebx.validInt(list[i].colorsize.rows[j].sizeid)){
												sizetext = size[k].title;
											}
										}
										listbody += colortext + '(' + sizetext + '):' + list[i].colorsize.rows[j].quantity + ' ';
										colortext = '';
										sizetext = '';
									}
									listbody += '</td>';
									listbody += '</tr>';
								}
							}
							if(page >= ebx.printpagesize){
								pagesize++;
								if(footer){
									pagecount += '<tr>';
									for(var i in liststyle){
										if(i == 0){
											pagecount += '<td class="listbody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+liststyle[i].width+';">本页合计</td>';
										}else{
											pagecount += '<td class="listbody" style="border-top:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(pagefoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
										}
									}
									pagecount += '</tr>';
								}
								pagelistbody.push({titlestr:titlestr, headtext:headtext, bdhead:bdhead, listhead:listhead, listbody: listbody, bdfoot: bdfoot, foottext:foottext, pagecount: pagecount});
								pagecount = '';
								pagefoot = {};
								listbody = '';
								page = 0;
							}
						}

						if(page <= ebx.printpagesize && page > 0){
							pagesize++;
							if(footer){
								pagecount += '<tr>';
								for(var i in liststyle){
									if(i == 0){
										pagecount += '<td class="listbody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+liststyle[i].width+';">本页合计</td>';
									}else{
										pagecount += '<td class="listbody" style="border-top:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(pagefoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
									}
								}
								pagecount += '</tr>';
							}
							pagelistbody.push({titlestr:titlestr, headtext:headtext, bdhead:bdhead, listhead:listhead, listbody: listbody, bdfoot: bdfoot, foottext:foottext, pagecount: pagecount});
						}
						
						if(footer){
							listcount += '<tr>';
							for(var i in liststyle){
								if(i == 0){
									listcount += '<td class="listbody" colspan="2" style="text-align:center;border-bottom:2px solid #000;width:'+liststyle[i].width+';">总计</td>';
								}else{
									listcount += '<td class="listbody" style="border-bottom:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(listfoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
								}
							}
							listcount += '</tr>';
						}
						var s = '',
							qrcodediv = $('<div id="qrcode" class="qrcode">').appendTo('body'),
							barcord = $('<svg id="barcode" class="barcord"></svg>').appendTo('body');
						
						JsBarcode("#barcode", _PrefixInteger(_id, 10), {
							displayValue: false,
							height:50,
							fontSize:15,
							lineColor: "#000"
						});
						
						var qrcode = new QRCode(document.getElementById("qrcode"), {
							width: 100, //设置宽高
							height: 100
						});
						qrcode.makeCode('https://www.zydsoft.com');
						var codeview = 0;
						setTimeout(function(){
							for(var i in pagelistbody){
								s += '<div class="pagediv">'
								s += pagelistbody[i].titlestr;
								s += pagelistbody[i].headtext;
								s += pagelistbody[i].bdhead;
								s += '<table style="width:'+listwidth+'%;" align="center" class="listheadtable">' 
								s += pagelistbody[i].listhead;
								s += pagelistbody[i].listbody;
								s += pagelistbody[i].pagecount;
								s += listcount;
								s += '</table>';
								s += pagelistbody[i].bdfoot;
								s += pagelistbody[i].foottext;
								s += '<div class="pagesize">共 ' + pagesize + ' 页，第 ' + (ebx.validInt(i) + 1) + ' 页，打印时间：' + new Date().Format("yyyy-MM-dd hh:mm:ss") + '</div>';
								s += '</div>';
								$('#qrcode').remove();
								$('#barcode').remove();
							}
							if(productserial.length > 0){
								s += productserial;
							}
							var printdata = $('<div>').html(s);
							if(border == 0){
								printdata.find('td').css({'border':0});
								printdata.find('table').css({'border':0});
							}
							printdata.find('.pagediv:first').append(barcord).append(qrcodediv);
							barcord.show();
							qrcodediv.show();
							if(callback)callback(printdata);
						},0);
					}
				}
				$.messager.progress('close');
			}
		});
	},
	PrefixInteger: function(num, length) {
		return (Array(length).join('0') + num).slice(-length);
	},
	setup: function(){
		var win = $('<div>').appendTo('body'),
			pagesize = $('<div>').appendTo(win),
			printtype = $('<div>').appendTo(win),
			defaultbtn = $('<div>').appendTo(win);
		
		win.window({
			title: '打印设置',
			width:200,    
			height:120, 
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
		}).css({'padding':10});
		
		$('body').find('.window-mask').on('click', function(){
			win.window('close');
		}); 

		pagesize.numberspinner({    
			min: 1,    
			max: 100,    
			editable: false,
			label:'每页打印行数',
			value: ebx.printpagesize,
			onSpinUp:function(){
				ebx.printpagesize = pagesize.numberspinner('getValue');
				ebx.storage.set('printpagesize', ebx.printpagesize);
			},
			onSpinDown:function(){
				ebx.printpagesize = pagesize.numberspinner('getValue');
				ebx.storage.set('printpagesize', ebx.printpagesize);
			}
		}).css({'margin':'5px'}); 

		printtype.combobox({
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
			value:ebx.printtype,
			panelHeight: 'auto',
			disabled:true,
			onChange:function(){
				ebx.printtype = printtype.combobox('getValue');
				ebx.storage.set('printtype', ebx.printtype);
			}
		}).css({'margin':'5px'}); 

		defaultbtn.linkbutton({
			text:'恢复默认值',
			onClick:function(){
				pagesize.numberspinner('setValue', 10);
				ebx.printpagesize = 10;
				ebx.storage.set('printpagesize', ebx.printpagesize);
				printtype.combobox('setValue', 0);
				ebx.printtype = 0;
				ebx.storage.set('printtype', ebx.printtype);
			}
		}).css({'margin-top':'10px'});

	}
}