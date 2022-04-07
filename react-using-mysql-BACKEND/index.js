'use strict'

var express=require('express');
var app=express();
var bodyParser=require("body-parser");
var mysql=require("mysql");
var connectMultiparty=require("connect-multiparty");
var fs=require("fs");
var path=require("path");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var multipart=connectMultiparty({uploadDir:"./photos"});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var connection=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"4578ginebra",
	database:"Pruebas"
});

app.get("/api/departments",(req,res)=>{
	let query="SELECT * FROM departments";

	connection.query(query,(err,result,fields)=>{
		if(err) return res.status(500).send({"Ocurrio un error":err});
		return res.status(200).send({result});
	})
})

app.post("/api/departments",(req,res)=>{
	let query="INSERT INTO departments (departmentName) VALUES(?)";

	var values=[
		req.body['departmentName']
	];

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({"Error recibido":err});
		return res.status(200).send({result});
	})
})

app.put("/api/departments",(req,res)=>{
	let query="UPDATE departments SET departmentName=? WHERE departmentId=?";

	let values=[
		req.body['departmentName'],
		req.body['departmentId']
	];

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({"An error was recibed":err});
		return res.status(200).send({result});
	})
})

app.delete("/api/departments/:id",(req,res)=>{
	let query="DELETE from departments where departmentId=?";

	let values=[
		parseInt(req.params.id)
	];

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({"ERROR":err});

		return res.status(200).send({result});
	})
})

app.get("/api/employees",(req,res)=>{
	let query="SELECT employeeId,employeeName,employeeDepartment,profilePic FROM employees";

	connection.query(query,(error,result)=>{
		if(error) return res.status(500).send({"Error":error});

		return res.status(200).send({result});
	})
})

app.post("/api/employees",(req,res)=>{
	let query=`INSERT INTO employees (employeeName,employeeDepartment) 
				VALUES(?,?)`;
    let query2=`SELECT * FROM employees ORDER BY employeeId DESC LIMIT 1`


	var values=[
		req.body['employeeName'],
		req.body['employeeDepartment']
	]

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({error:err})
		
		connection.query(query2,(err,result)=>{
			if(err) return res.status(500).send({error:err})
			return res.status(200).send({resultado:result}) 
		})
	})
})

app.put("/api/employees",(req,res)=>{
	let query="UPDATE employees SET employeeName=?,employeeDepartment=? WHERE employeeId=?";

	let values=[
		req.body['employeeName'],
		req.body['employeeDepartment'],
		req.body['employeeId']
	];

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({err});

		return res.status(200).send({result});
	})
})

app.delete("/api/employees/:id",(req,res)=>{
	let query="DELETE FROM employees WHERE employeeId=?";

	let values=[
		parseInt(req.params.id)
	];

	connection.query(query,values,(err,result)=>{
		if(err) return res.status(500).send({err});

		return res.status(200).send({result});
	})
})

app.put("/api/employees/uploadImage/:id",multipart,(req,res)=>{

	let query="UPDATE employees SET profilePic=? WHERE employeeId=?";
	let id=req.params.id;

	if(req.files){
		var filePath=req.files.file.path;
		var fileSplit=filePath.split("\\");
		var fileName=fileSplit[1];

		var extSplit=fileName.split("\.");
		var fileExt=extSplit[1];

		if(fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg" || fileExt=="gif"){
			let values=[
				fileName,
				id
			];

			connection.query(query,values,(err,result)=>{
				if(err) return res.status(500).send({"Todo mal":err});
				return res.status(200).send({"Todo bien":result});
			}) 
		}else{
			fs.unlink(filePath,(err)=>{
				return res.status(200).send({"Mensaje":"Extension no valida"})
			})
		}
	}else{
		return res.status(200).send({"Mensaje":"Un error con el archivo"});
	}
})

app.get("/api/employees/getImage/:image",(req,res)=>{
	let file=req.params.image;
	let path_file="./photos/"+file;

	fs.access(path_file,(err)=>{
		if(!err) return res.sendFile(path.resolve(path_file));
		else return res.status(200).send({mensaje:"La imagen no existe"});
	})
})

app.listen(8000,()=>{
	console.log("Servidor arriba");

	connection.connect((error)=>{
		if(error) throw error;
		console.log("Conexion a base de datos realizada");
	})

})