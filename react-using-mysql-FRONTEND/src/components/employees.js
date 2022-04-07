import React, { Component } from 'react';

class Employees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments:[],
      employees: [],
      modalTitle: '',
      employeeName: '',
      employeeId: 0,
      employeeDepartment:'',
      profilePic:'',
      picEnable:false,
      fileToUpload:[],
      get_image:"http://localhost:8000/api/employees/getImage/",
      put_image:"http://localhost:8000/api/employees/uploadImage/"
    };
  }

  componentDidMount() {
    this.depReq();
    this.employeeReq();
  }

  employeeReq= async()=> {
    var result=await fetch('http://localhost:8000/api/employees')
    var data=await result.json()
    this.setState({employees:data.result})
  }

  depReq=async()=>{
    var result= await fetch("http://localhost:8000/api/departments")
    var data=await result.json()
    this.setState({departments:data.result})
  }

  addClick(){
    this.setState({
      modalTitle:"Add employee",
      employeeName: '',
      employeeId: 0,
      employeeDepartment:'',
      picEnable:false,
    })

  }

  editClick(emp){
    this.setState({
      modalTitle:'Edit employee',
      employeeName:emp.employeeName ,
      employeeId: emp.employeeId,
      employeeDepartment:emp.employeeDepartment,
      profilePic:emp.profilePic,
      picEnable:true
    })
  }

  addEmployee(){      
    fetch("http://localhost:8000/api/employees",{
      method:'POST',
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        employeeName:this.state.employeeName,
        employeeId: this.state.employeeId,
        employeeDepartment:this.state.employeeDepartment,
      })
    })
    .then(response => response.json())
    .then(data=>{
      this.setState({
        modalTitle:'Edit employee',
        employeeName: data.resultado[0].employeeName,
        employeeId: data.resultado[0].employeeId,
        employeeDepartment:data.resultado[0].employeeDepartment
      })
      this.uploadImage(this.state.put_image+this.state.employeeId,[],this.state.fileToUpload,'file')
    })
    .then(()=>{
      alert("Se ha creado el perfil")
      this.employeeReq()
    })
  }

  updateEmployee(id){      
    fetch("http://localhost:8000/api/employees",{
      method:'PUT',
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        employeeName:this.state.employeeName,
        employeeDepartment:this.state.employeeDepartment,
        employeeId: this.state.employeeId
      })
    })
    .then(this.uploadImage(this.state.put_image+this.state.employeeId,[],this.state.fileToUpload,'file'))
    .then(()=>{
      this.employeeReq()
      alert("Trabajador actualizado exitosamente")
    
    })
  }

  deleteEmployee(id){
    if(window.confirm('¿Seguro?')){
      fetch("http://localhost:8000/api/employees/"+id,{
        method:'DELETE',
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      })
      .then(()=>{
        alert("Trabajador borrado exitosamente")
        this.employeeReq()
        this.setState({
          employeeName: '',
          employeeId: 0,
          employeeDepartment:'',
        })

      })
    }
  }

  uploadImage=(url,params,files,name)=>{
    return new Promise(function(resolve,reject){
      var formData=new FormData()
      var xhr=new XMLHttpRequest()

      for(let i=0;i<files.length;i++){
        formData.append(name,files[i],files[i].name)
      }

      xhr.onreadystatechange=function(){
        if (xhr.readyState===4){
          if(xhr.status===200){
            resolve(JSON.parse(xhr.response));
          }
          else{
            console.log(xhr.response);
          }
        }
      }

      xhr.open('PUT',url,true)
      xhr.send(formData)
    })
  }
  

  render() {
    return (
      <div>
        <h1> Employees cargada</h1>

        <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>this.addClick()}>Add employee</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Employees ID</th>
              <th>Employees Name</th>
              <th>Employees Department </th>
            </tr>
          </thead>
          <tbody>
            {this.state.employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td> {emp.employeeId} </td>
                <td> {emp.employeeName} </td>
                <td> {emp.employeeDepartment}</td>
                <td>
                  <button type="button" data-bs-target="#exampleModal" data-bs-toggle="modal" className="btn btn-light mr-1" value={emp.employeeName} onClick={()=>this.editClick(emp)}>
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light mr-1" onClick={()=>this.deleteEmployee(emp.employeeId)} >
                    Borrar
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

         <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
               <div className="modal-content">
                  <div className="modal-header">
                   <h5 className="modal-title">{this.state.modalTitle}</h5>
                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div className="modal-body">
                     <div className="d-flex flex-row bd-highlight mb-3">
                        <div className="p-2 w-50 bd-highlight">
                           <div className="input-group mb-3">
                              <span className="input-group-text"> Employee Name </span>
                              <input type="text" className="form-control" placeholder="Employee name" value={this.state.employeeName} onChange={(e) => this.setState({ employeeName: e.target.value })}/>
                           </div>
                           
                           <div className="input-group mb-3">
                              <span className="input-group-text"> Employee Department </span>
                              <select className="form-select" value={this.state.employeeDepartment} onChange={(e)=>this.setState({employeeDepartment:e.target.value})}>
                                {this.state.departments.map((dep)=>(
                                  <option key={dep.departmentId}>
                                    {dep.departmentName}
                                  </option>
                                ))}
                              </select>
                           </div>
                           
                        </div>
   
                        <div className="p-2 w-50 bd-highlight">
                          <img width="250px" height="250px" alt="Employee profile pic"src={this.state.picEnable?this.state.get_image+this.state.profilePic:null}/>
                          <input type="file" className="m-2" onChange={(e)=>this.setState({fileToUpload:e.target.files})} />
                        </div>                        

                        {this.state.employeeId===0?
                          <button type="button" className="btn btn-primary float-start" onClick={()=>this.addEmployee()}>Create</button>
                        :null}

                        {this.state.employeeId!==0?
                          <button type="button" className="btn btn-primary float-start" onClick={()=>this.updateEmployee()} >Update</button>
                        :null}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }
}


export default Employees;