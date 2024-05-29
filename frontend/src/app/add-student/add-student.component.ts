import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/service/student.service';
import {FormControl,FormGroup,NgForm,Validators} from '@angular/forms';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  alreadyExist: boolean = false
  submitted: boolean = false

  constructor(private studentservice:StudentService) { }

  ngOnInit() {
  }

  studentsaveform=new FormGroup({
    student_name:new FormControl('' , [Validators.required , Validators.minLength(5)]),
    student_email:new FormControl('',[Validators.required,Validators.email]),
    student_branch:new FormControl(null, [ Validators.required ])
  });

  saveStudent(f: NgForm){
    let payload = this.studentsaveform.getRawValue()
    this.studentservice.createStudent(payload).subscribe(() => {
      this.submitted = true
      f.form.reset()
      Object.keys(this.studentsaveform.controls).forEach(key => {
        this.studentsaveform.get(key).setErrors(null) ;
      });
      this.alreadyExist = false
    }, () => this.alreadyExist = true)
  }

  get StudentName(){
    return this.studentsaveform.get('student_name');
  }

  get StudentEmail(){
    return this.studentsaveform.get('student_email');
  }

  get StudentBranch(){
    return this.studentsaveform.get('student_branch');
  }
}
