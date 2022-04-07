import React, { Component } from 'react';

class Department extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      modalTitle: '',
      departmentName: '',
      departmentId: 0,
    };
  }

  depReq= async()=> {
    var result=await fetch('http://localhost:8000/api/departments')
    var data=await result.json()
    this.setState({departments:data.result})
  }

  addClick(){
    this.setState({
      modalTitle:"Add department",
      departmentId:0,
      departmentName:''
    })
  }

  editClick(dep){
    this.setState({
      modalTitle:'Edit department',
      departmentId:dep.departmentId,
      departmentName:dep.departmentName
    })
  }

  addDepartment(){
    fetch("http://localhost:8000/api/departments",{
      method:'POST',
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({departmentName:this.state.departmentName})
    })
    .then(()=>{
      alert("Departamento añadido exitosamente")
      this.setState({
        departmentName:'',
        departmentId:0
      })

      this.depReq()
    })
  }

  updateDepartment(){
    fetch("http://localhost:8000/api/departments",{
      method:'PUT',
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({departmentId:this.state.departmentId,departmentName:this.state.departmentName})
    })
    .then(()=>{
      alert("Departamento actualizado exitosamente")
      this.setState({
        departmentName:'',
        departmentId:0
      })

      this.depReq()
    })
  }

  deleteDepartment(id){
    if(window.confirm('¿Seguro?')){
      fetch("http://localhost:8000/api/departments/"+id,{
        method:'DELETE',
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      })
      .then(()=>{
        alert("Departamento borrado exitosamente")
        this.setState({
          departmentName:'',
          departmentId:0
        })

        this.depReq()
      })
    }
  }

  componentDidMount() {
    this.depReq();
  }

  render() {
    return (
      <div>
        <h1> Department cargada</h1>

        <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>this.addClick()}>Add department</button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.departments.map((dep) => (
              <tr key={dep.departmentId}>
                <td> {dep.departmentId} </td>
                <td> {dep.departmentName} </td>
                <td>
                  <button type="button" data-bs-target="#exampleModal" data-bs-toggle="modal" className="btn btn-light mr-1" value={dep.departmentName} onClick={()=>this.editClick(dep)}>
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn btn-light mr-1" onClick={()=>this.deleteDepartment(dep.departmentId)} >
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
                <div className="input-group mb-3">
                  <span className="input-group-text"> Department Name </span>
                  <input type="text" className="form-control" placeholder="Department name" value={this.state.departmentName} onChange={(e) => this.setState({ departmentName: e.target.value })}/>
                
                  {this.state.departmentId===0?
                    <button type="button" className="btn btn-primary float-start" onClick={()=>this.addDepartment()}>Create</button>
                  :null}

                  {this.state.departmentId!==0?
                    <button type="button" className="btn btn-primary float-start" onClick={()=>this.updateDepartment()} >Update</button>
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

export default Department;