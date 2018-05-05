<%@language="javascript"%>
<% @debug=on
var ebx = {
	conn: [], 
	stdin: Server.CreateObject("Scripting.Dictionary"),
	stdout: Server.CreateObject("Scripting.Dictionary"),
	parseToJson: function (json_data){//Json格式转对象
		eval("var o=" + json_data);
		return o;
	},
	getRequestParamet: function(s){//get参数格式转对象
		var arr = s.split('&'),
			d = Server.CreateObject("Scripting.Dictionary");
		if(arr.length <= 0) return d;
		for(var i in arr){
			d.Add(arr[i].split('=')[0], arr[i].split('=')[1]);
		}
		return d;
	},
	Initialize: function (){
		var ParametStr, FormSize, FormData, Paramet
		if(Request.ServerVariables('Request_Method') == 'POST' ){ //post
			FormSize = Request.TotalBytes;
			FormData = Request.BinaryRead(FormSize);
			ParametStr = ebx.stream_binarytostring(FormData, '');
			if(typeof(ParametStr) == 'string'){
				try{
					var Paramet = ebx.parseToJson(ParametStr);
					ebx.convertObjToDic(ebx.stdin, Paramet);
				}catch(e){
					if(e.name == 'SyntaxError'){
						ebx.stdin = ebx.getRequestParamet(ParametStr);
					}
				}
			}
		}else{ //get
			ParametStr = Request.ServerVariables("QUERY_STRING")(1);
			if(typeof(ParametStr) == 'string'){
				ebx.stdin = ebx.getRequestParamet(ParametStr);
			}
		}
		
		ebx.conn = Server.CreateObject('ADODB.Connection');
		ebx.conn.open(Application('DateBase.ConnectString'));
	},
	stream_binarytostring: function (binary, charset){//用adodb.stream获取requet内容 2018-5-4 zz
		var binarystream = Server.CreateObject('adodb.stream');

		binarystream.type = 1
		binarystream.open
		binarystream.write(binary)
		binarystream.position = 0
		binarystream.type = 2
		
		if(charset.length > 0){
			binarystream.charset = charset
		}else{
			binarystream.charset = 'us-ascii'
		}
		return binarystream.readtext
	},
	convertObjToDic: function(dic, obj){//将Json转换成object的对象转换成可嵌套的字典对象 2018-5-5 zz
		if(typeof(obj) == 'object'){
			for(var i in obj){
				if(typeof(obj[i]) == 'object'){
					var d = Server.CreateObject("Scripting.Dictionary");
					ebx.convertObjToDic(d, obj[i]);
					dic.Add(i, d);
				}else{
					dic.Add(i, obj[i]);
				}
			}
		}
	},
	convertRsToJson: function(rs){//将rs对象转化成json文本 2018-5-4 zz
		var s = '';
		if(!rs.eof){ 
			var fields = rs.Fields;
				
			rs.MoveFirst();
			while(!rs.eof){
				s += '{';
				for(var i = 0; i <= fields.Count - 1; i++){
					s += '"' + fields(i).name.toLowerCase() + '":' + ebx.getType(fields(i)) + ',';
				}
				s = s.substr(0, s.length - 1);
				s += '},';
				rs.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}
		return '[' + s + ']';
	},
	getType: function(Fields){ //数据类型判断函数，Fields：字段rs.Fields对象，sup：补充字段，返回针对类型处理后的值
		var v = ebx.escapeEx(Fields.value)
		switch(Fields.type){
			case 202:
				return '"' + v + '"'; //"文本"
				break;
			case 203:
				return  '"' + v + '"'; //"备注"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 2:
				return v; //"整型"
				break;
			case 17:
				return v; //"字节"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 4:
				return v; //"单精浮点"
				break;
			case 5:
				return v; //"双精浮点"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 72:
				return v; //"同步复制ID"
				break;
			case 131:
				return v; //"小数"
				break;
			case 135:
				return '"' + v + '"'; //"日期/时间"
				break;
			case 6:
				return v; //"货币"
				break;
			case 11:
				return '"' + v + '"'; //"是/否"
				break;
			case 205:
				return '[' + ebx.convertRsToJson(ebx.convertBinToRs(v)) + ']'; //"OLE对象" 处理数据库里的rs对象二级制存储数据
				break;
		}
	},
	escapeEx: function(str){ //判断是否汉字字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		if(/^[\u3220-\uFA29]+$/.test(str)){
			return escape(str);
		}else{
			return str;
		}
	},
	convertBinToRs: function(sBin){ //二进制流转换成rs对象
		
		var stm = Server.CreateObject("adodb.stream"),
			rs = Server.CreateObject("adodb.recordset");
		if(sBin != null){
			stm.type = 1;
			stm.Open();
			stm.Write(sBin);
			stm.position = 0;
			rs.open(stm);
		}
		return(rs);
	},
	convertRsToBin: function(rs){ //rs对象转换成二进制流
		if(rs == null) return(null);
		if(typeof(rs) == 'object') return(null);
		if(rs.recordcount = 0) return(null);
		
		var stm = Server.CreateObject("adodb.stream");
		stm.type = 1;
		stm.Open();
		rs.save(stm);
		stm.position = 0
		return stm.read();
	}
}

ebx.Initialize();

%>
