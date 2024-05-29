import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/service/student.service';
import { Student } from 'src/model/student';
import { Observable, Subject } from "rxjs";

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  modalReference: any;
  closeResult: string;

  constructor(private studentservice: StudentService, private modalService: NgbModal) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: DataTables.Api;

  studentsArray: any[] = [];
  dtOptions: DataTables.Settings = {
    pageLength: 5,
    stateSave: true,
    lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "All"]],
    processing: true
  };
  dtTrigger: Subject<any> = new Subject();


  students: Observable<Student[]>;
  student: Student = new Student();
  deleteMessage = false;
  error: boolean = false;


  ngOnInit() {
    this.studentservice.getStudentList().subscribe(data => {
      this.students = data;
      this.dtTrigger.next();
    })
  }

  deleteStudent(id: number) {
    this.studentservice.deleteStudent(id)
      .subscribe(
        () => {
          this.deleteMessage = true;
          this.rerender();
        });
  }

  studentupdateform = new FormGroup({
    student_id: new FormControl(),
    student_name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    student_email: new FormControl('', [Validators.required, Validators.email]),
    student_branch: new FormControl(null, [Validators.required])
  });

  updateStudent() {
    this.error = false;
    this.student = new Student();
    this.student.student_id = this.StudentId.value;
    this.student.student_name = this.StudentName.value;
    this.student.student_email = this.StudentEmail.value;
    this.student.student_branch = this.StudentBranch.value;

    this.studentservice.updateStudent(this.student.student_id, this.student).subscribe(
      () => {
        this.rerender();
        this.modalReference.close();
      },
      () => {
        this.error = true;
      });
  }

  get StudentName() {
    return this.studentupdateform.get('student_name');
  }

  get StudentEmail() {
    return this.studentupdateform.get('student_email');
  }

  get StudentBranch() {
    return this.studentupdateform.get('student_branch');
  }

  get StudentId() {
    return this.studentupdateform.get('student_id');
  }

  rerender(): void {
    this.studentservice.getStudentList().subscribe(data => {
      this.students = data;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    });
  }



  triggerModal(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.rerender();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.rerender();
      return 'by clicking on a backdrop';
    } else {
      this.rerender();
      return `with: ${reason}`;
    }
  }
  cancel() {
    this.modalReference.close();
    this.rerender();
  }
}
