<!--# include virtual="server/public.asp" -->
<%
dim template
template = request("template")

select case template
Case 2
%>
{"total":10,"rows":[
	{"productid":"FI-SW-01","productname":"Koi","unitcost":10.00,"status":true,"listprice":36.50,"attr1":"Large","itemid":"EST-1"},
	{"productid":"K9-DL-01","productname":"Dalmation","unitcost":12.00,"status":false,"listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
	{"productid":"RP-SN-01","productname":"Rattlesnake","unitcost":12.00,"status":"","listprice":38.50,"attr1":"Venomless","itemid":"EST-11"},
	{"productid":"RP-SN-02","productname":"Rattlesnake","unitcost":12.00,"status":true,"listprice":26.50,"attr1":"Rattleless","itemid":"EST-12"},
	{"productid":"RP-LI-02","productname":"Iguana","unitcost":12.00,"status":"","listprice":35.50,"attr1":"Green Adult","itemid":"EST-13"},
	{"productid":"FL-DSH-01","productname":"Manx","unitcost":12.00,"status":"","listprice":158.50,"attr1":"Tailless","itemid":"EST-14"},
	{"productid":"FL-DSH-03","productname":"Manx","unitcost":12.00,"status":"","listprice":83.50,"attr1":"With tail","itemid":"EST-15"},
	{"productid":"FL-DLH-02","productname":"Persian","unitcost":12.00,"status":"","listprice":23.50,"attr1":"Adult Female","itemid":"EST-16"},
	{"productid":"FL-DLH-04","productname":"Persian","unitcost":12.00,"status":"on","listprice":89.50,"attr1":"Adult Male","itemid":"EST-17"},
	{"productid":"AV-CB-01","productname":"Amazon Parrot","unitcost":92.00,"status":"","listprice":63.50,"attr1":"Adult Male","itemid":"EST-18"}
]}
<%
Case 3
%>
{"total":10,"rows":[
	{"Count":"","Code":"FI-SW-01","Title":"Koi","IsDeleted":1,"unitcost":10.00,"status":true,"listprice":36.50,"attr1":"Large","itemid":"EST-1"},
	{"Count":"","Code":"K9-DL-01","Title":"Dalmation","IsDeleted":1,"unitcost":12.00,"status":false,"listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
	{"Count":"","Code":"RP-SN-01","Title":"Rattlesnake","IsDeleted":1,"unitcost":12.00,"status":"","listprice":38.50,"attr1":"Venomless","itemid":"EST-11"},
	{"Count":"","Code":"RP-SN-02","Title":"Rattlesnake","IsDeleted":0,"unitcost":12.00,"status":true,"listprice":26.50,"attr1":"Rattleless","itemid":"EST-12"},
	{"Count":"","Code":"RP-LI-02","Title":"Iguana","IsDeleted":1,"unitcost":12.00,"status":"","listprice":35.50,"attr1":"Green Adult","itemid":"EST-13"},
	{"Count":"","Code":"FL-DSH-01","Title":"Manx","IsDeleted":0,"unitcost":12.00,"status":"","listprice":158.50,"attr1":"Tailless","itemid":"EST-14"},
	{"Count":"","Code":"FL-DSH-03","Title":"Manx","IsDeleted":1,"unitcost":12.00,"status":"","listprice":83.50,"attr1":"With tail","itemid":"EST-15"},
	{"Count":"","Code":"FL-DLH-02","Title":"Persian","IsDeleted":1,"unitcost":12.00,"status":"","listprice":23.50,"attr1":"Adult Female","itemid":"EST-16"},
	{"Count":"","Code":"FL-DLH-04","Title":"Persian","IsDeleted":1,"unitcost":12.00,"status":"on","listprice":89.50,"attr1":"Adult Male","itemid":"EST-17"},
	{"Count":"","Code":"AV-CB-01","Title":"Amazon Parrot","IsDeleted":1,"unitcost":92.00,"status":"","listprice":63.50,"attr1":"Adult Male","itemid":"EST-18"}
]}
<%
Case 4
%>
{"total":10,"rows":[
	{"inv":"INV0001","date":"2018-02-25","name":"名称1","note":"Note1","amount":61,"price":"104.38","cost":"6367.18","searchcode":"mc1"},
	{"inv":"INV0002","date":"2018-02-26","name":"名称2","note":"Note2","amount":80,"price":"101.68","cost":"8134.40","searchcode":"mc2"},
	{"inv":"INV0003","date":"2018-02-27","name":"Name3","note":"Note3","amount":67,"price":"117.89","cost":"7898.63"},
	{"inv":"INV0004","date":"2018-02-28","name":"Name4","note":"Note4","amount":62,"price":"123.34","cost":"7647.08"},
	{"inv":"INV0005","date":"2018-03-01","name":"Name5","note":"Note5","amount":99,"price":"154.06","cost":"15251.94"},
	{"inv":"INV0006","date":"2018-03-02","name":"Name6","note":"Note6","amount":88,"price":"161.36","cost":"14199.68"},
	{"inv":"INV0007","date":"2018-03-03","name":"Name7","note":"Note7","amount":95,"price":"103.25","cost":"9808.75"},
	{"inv":"INV0008","date":"2018-03-04","name":"Name8","note":"Note8","amount":52,"price":"104.74","cost":"5446.48"},
	{"inv":"INV0009","date":"2018-03-05","name":"Name9","note":"Note9","amount":67,"price":"130.18","cost":"8722.06"},
	{"inv":"INV0010","date":"2018-03-06","name":"Name10","note":"Note10","amount":76,"price":"187.86","cost":"14277.36"},
	{"inv":"INV0011","date":"2018-03-07","name":"Name11","note":"Note11","amount":80,"price":"183.58","cost":"14686.40"},
	{"inv":"INV0012","date":"2018-03-08","name":"Name12","note":"Note12","amount":99,"price":"194.54","cost":"19259.46"},
	{"inv":"INV0013","date":"2018-03-09","name":"Name13","note":"Note13","amount":67,"price":"194.51","cost":"13032.17"},
	{"inv":"INV0014","date":"2018-03-10","name":"Name14","note":"Note14","amount":55,"price":"102.82","cost":"5655.10"},
	{"inv":"INV0015","date":"2018-03-11","name":"Name15","note":"Note15","amount":81,"price":"192.63","cost":"15603.03"},
	{"inv":"INV0016","date":"2018-03-12","name":"Name16","note":"Note16","amount":53,"price":"184.92","cost":"9800.76"},
	{"inv":"INV0017","date":"2018-03-13","name":"Name17","note":"Note17","amount":99,"price":"167.57","cost":"16589.43"},
	{"inv":"INV0018","date":"2018-03-14","name":"Name18","note":"Note18","amount":94,"price":"130.85","cost":"12299.90"},
	{"inv":"INV0019","date":"2018-03-15","name":"Name19","note":"Note19","amount":93,"price":"111.48","cost":"10367.64"},
	{"inv":"INV0020","date":"2018-03-16","name":"Name20","note":"Note20","amount":77,"price":"182.67","cost":"14065.59"},
	{"inv":"INV0021","date":"2018-03-17","name":"Name21","note":"Note21","amount":83,"price":"130.40","cost":"10823.20"},
	{"inv":"INV0022","date":"2018-03-18","name":"Name22","note":"Note22","amount":72,"price":"154.45","cost":"11120.40"},
	{"inv":"INV0023","date":"2018-03-19","name":"Name23","note":"Note23","amount":67,"price":"149.78","cost":"10035.26"},
	{"inv":"INV0024","date":"2018-03-20","name":"Name24","note":"Note24","amount":80,"price":"168.35","cost":"13468.00"},
	{"inv":"INV0025","date":"2018-03-21","name":"Name25","note":"Note25","amount":90,"price":"110.73","cost":"9965.70"},
	{"inv":"INV0026","date":"2018-03-22","name":"Name26","note":"Note26","amount":78,"price":"139.03","cost":"10844.34"},
	{"inv":"INV0027","date":"2018-03-23","name":"Name27","note":"Note27","amount":98,"price":"153.63","cost":"15055.74"},
	{"inv":"INV0028","date":"2018-03-24","name":"Name28","note":"Note28","amount":67,"price":"128.42","cost":"8604.14"},
	{"inv":"INV0029","date":"2018-03-25","name":"Name29","note":"Note29","amount":74,"price":"144.15","cost":"10667.10"},
	{"inv":"INV0030","date":"2018-03-26","name":"Name30","note":"Note30","amount":65,"price":"110.37","cost":"7174.05"},
	{"inv":"INV0031","date":"2018-03-27","name":"Name31","note":"Note31","amount":68,"price":"138.19","cost":"9396.92"},
	{"inv":"INV0032","date":"2018-03-28","name":"Name32","note":"Note32","amount":98,"price":"133.79","cost":"13111.42"},
	{"inv":"INV0033","date":"2018-03-29","name":"Name33","note":"Note33","amount":52,"price":"181.89","cost":"9458.28"},
	{"inv":"INV0034","date":"2018-03-30","name":"Name34","note":"Note34","amount":82,"price":"191.23","cost":"15680.86"},
	{"inv":"INV0035","date":"2018-03-31","name":"Name35","note":"Note35","amount":97,"price":"118.82","cost":"11525.54"},
	{"inv":"INV0036","date":"2018-04-01","name":"Name36","note":"Note36","amount":87,"price":"158.92","cost":"13826.04"},
	{"inv":"INV0037","date":"2018-04-02","name":"Name37","note":"Note37","amount":75,"price":"117.91","cost":"8843.25"},
	{"inv":"INV0038","date":"2018-04-03","name":"Name38","note":"Note38","amount":56,"price":"182.88","cost":"10241.28"},
	{"inv":"INV0039","date":"2018-04-04","name":"Name39","note":"Note39","amount":84,"price":"172.57","cost":"14495.88"},
	{"inv":"INV0040","date":"2018-04-05","name":"Name40","note":"Note40","amount":76,"price":"147.65","cost":"11221.40"},
	{"inv":"INV0041","date":"2018-04-06","name":"Name41","note":"Note41","amount":92,"price":"107.44","cost":"9884.48"},
	{"inv":"INV0042","date":"2018-04-07","name":"Name42","note":"Note42","amount":94,"price":"177.60","cost":"16694.40"},
	{"inv":"INV0043","date":"2018-04-08","name":"Name43","note":"Note43","amount":81,"price":"120.25","cost":"9740.25"},
	{"inv":"INV0044","date":"2018-04-09","name":"Name44","note":"Note44","amount":53,"price":"109.20","cost":"5787.60"},
	{"inv":"INV0045","date":"2018-04-10","name":"Name45","note":"Note45","amount":82,"price":"137.27","cost":"11256.14"},
	{"inv":"INV0046","date":"2018-04-11","name":"Name46","note":"Note46","amount":59,"price":"101.18","cost":"5969.62"},
	{"inv":"INV0047","date":"2018-04-12","name":"Name47","note":"Note47","amount":88,"price":"114.86","cost":"10107.68"},
	{"inv":"INV0048","date":"2018-04-13","name":"Name48","note":"Note48","amount":67,"price":"181.23","cost":"12142.41"},
	{"inv":"INV0049","date":"2018-04-14","name":"Name49","note":"Note49","amount":99,"price":"199.62","cost":"19762.38"},
	{"inv":"INV0050","date":"2018-04-15","name":"Name50","note":"Note50","amount":86,"price":"190.13","cost":"16351.18"},
	{"inv":"INV0051","date":"2018-04-13","name":"Name48","note":"Note48","amount":67,"price":"181.23","cost":"12142.41"},
	{"inv":"INV0052","date":"2018-04-14","name":"Name49","note":"Note49","amount":99,"price":"199.62","cost":"19762.38"}
]}
<%
Case Else	
	
end select
%>