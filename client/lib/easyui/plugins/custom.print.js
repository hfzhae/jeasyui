/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/17
单据打印对象，依赖于jquery.print.js

*****************************************************************/

ebx.bd.print = {
	id:[],
	tab: [],
	mode: '',
	title: '',
	init:function(id, mode, tab){
		this.id = id;
		this.mode = mode;
		this.tab = tab;
	},
	print: function(){
		if(ebx.validInt(this.id) == 0){
			$.messager.alert('错误', '请先保存单据！', 'error');	
		}
		$.messager.progress({title:'正在打印...',text:''});
		var _id = this.id,
			_PrefixInteger = this.PrefixInteger;
			
		$.ajax({
			type: 'post', 
			url: 'server/SimpChinese/' + this.mode + '/print/',
			data: {id: this.id, _:(new Date()).getTime()},
			dataType: "json",
			success: function(result){
				if(result.result){
					var titlestr = '<div class="headtitle">' + result.title + '</div>',
						printbody = $('<div>'),
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
						productserial = '';

					if(ebx.validInt(liststyle.length) == 0 || ebx.validInt(head.length) == 0 || ebx.validInt(foot.length) == 0){
						$.messager.alert('错误', '没有设置打印“'+result.title+'”的显示式样！', 'error');	
					}else{
						bdhead = '<table class="bdheadtable">'
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
						
						bdfoot = '<table class="bdfoottable">'
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
						
						
						listhead = '<tr><td class="listhead" style="border-right:2px solid #000;">No.</td>'
						for(var i in liststyle){
							listhead += '<td class="listhead" style="width:'+liststyle[i].width+';">' + liststyle[i].name + '</td>';
						}
						listhead += '</tr>'
						
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
										productserial += '<div style="page-break-after:always;font-size:12px;"><h3>附件：No.'+listbodycount+'的串号：</h3>';
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
								pagecount += '<tr>';
								for(var i in liststyle){
									if(i == 0){
										pagecount += '<td class="listbody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+liststyle[i].width+';">本页合计</td>';
									}else{
										pagecount += '<td class="listbody" style="border-top:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(pagefoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
									}
								}
								pagecount += '</tr>';
								
								pagelistbody.push({titlestr:titlestr, headtext:headtext, bdhead:bdhead, listhead:listhead, listbody: listbody, bdfoot: bdfoot, foottext:foottext, pagecount: pagecount});
								pagecount = '';
								pagefoot = {};
								listbody = '';
								page = 0;
							}
						}

						if(page <= ebx.printpagesize && page > 0){
							pagesize++;
							pagecount += '<tr>';
							for(var i in liststyle){
								if(i == 0){
									pagecount += '<td class="listbody" colspan="2" style="text-align:center;border-top:2px solid #000;width:'+liststyle[i].width+';">本页合计</td>';
								}else{
									pagecount += '<td class="listbody" style="border-top:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(pagefoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
								}
							}
							pagecount += '</tr>';
							pagelistbody.push({titlestr:titlestr, headtext:headtext, bdhead:bdhead, listhead:listhead, listbody: listbody, bdfoot: bdfoot, foottext:foottext, pagecount: pagecount});
						}
						
						listcount += '<tr>';
						for(var i in liststyle){
							if(i == 0){
								listcount += '<td class="listbody" colspan="2" style="text-align:center;border-bottom:2px solid #000;width:'+liststyle[i].width+';">总计</td>';
							}else{
								listcount += '<td class="listbody" style="border-bottom:2px solid #000;width:'+liststyle[i].width+';'+liststyle[i].style+';">' + ebx.Render.getRender(listfoot[liststyle[i].field.toLowerCase()], liststyle[i].render) + '</td>';
							}
						}
						listcount += '</tr>';

						var s = '',
							qrcodediv = $('<div id="qrcode">').appendTo('body'),
							barcord = $('<svg id="barcode"></svg>').appendTo('body');
						
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
						//debugger;
						setTimeout(function(){
							for(var i in pagelistbody){
								s += '<div style="page-break-after:always;">'
								s += '<svg class="barcord">' + $(barcord[0]).html() + '</svg>';
								s += '<div class="qrcode">' + $(qrcode._el).html() + '</div>';
								s += pagelistbody[i].titlestr;
								s += pagelistbody[i].headtext;
								s += pagelistbody[i].bdhead;
								s += '<table class="listheadtable">' 
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
							printbody.html(s).print({iframe:true,stylesheet:'/client/css/print.css'});
						},0);
					}
				}
				$.messager.progress('close');
			}
		});
	},
	PrefixInteger: function(num, length) {
		return (Array(length).join('0') + num).slice(-length);
	}
}