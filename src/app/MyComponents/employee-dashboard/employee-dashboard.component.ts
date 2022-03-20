import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeedata !:any;

  showAdd!:boolean;
  showUpdate!:boolean;

  employeeobj : EmployeeModel = new EmployeeModel();

  constructor(private formbuilder: FormBuilder,private api : ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary: ['']
    })
    this.getAllEmployee();
  }


  // clickAddEmployee method is used for hiding update button 
  clickAddEmployee(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate=false;
  }

  



  // postEmployeeDetails is used to Add new Employee in a  table using json server
  postEmployeeDetails(){
    this.employeeobj.firstName =this.formValue.value.firstName;
    this.employeeobj.lastName =this.formValue.value.lastName;
    this.employeeobj.email =this.formValue.value.email;
    this.employeeobj.mobile=this.formValue.value.mobile;
    this.employeeobj.salary=this.formValue.value.salary;

    this.api.postEmployee(this.employeeobj)
    .subscribe({
      next:(res:any)=>{console.log(res); alert("Employee Added Successfully")},
      error:(err:any)=>{alert("Something went Wrong")},
      complete:()=>{
        let ref = document.getElementById('close')
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();}
    });
  }
  
  // getAllEmployee is showing all the Employee details stored in json-server
  getAllEmployee(){
    this.api.getEmployee(this.employeedata)
    .subscribe({
      next:(res:any)=>{this.employeedata=res;}
    })
    
  }

  // deleteEmployeebyid is deleteing  Employee details stored in json-server
  deleteEmployeebyid(row:any){
    this.api.deleteEmployee(row.id)
    .subscribe({
      next:(res:any)=>{alert("Employee Deleted");
      this.getAllEmployee();}
    })

  }

  // onEdit method is used to edit the existing form 
  onEdit(row:any){
    this.showAdd = false;
    this.showUpdate=true;
    this.employeeobj.id= row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);

    

  }

  // updateEmployeeDetails is used to update the existing form
  updateEmployeeDetails(){
    this.employeeobj.firstName =this.formValue.value.firstName;
    this.employeeobj.lastName =this.formValue.value.lastName;
    this.employeeobj.email =this.formValue.value.email;
    this.employeeobj.mobile=this.formValue.value.mobile;
    this.employeeobj.salary=this.formValue.value.salary;

    this.api.updateEmployee(this.employeeobj,this.employeeobj.id)
    .subscribe(res=>{
      alert("Updated Successfully")
      let ref = document.getElementById('close')
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
    },
    err=>{
      alert("Something went Wrong");
    })

  }

}
