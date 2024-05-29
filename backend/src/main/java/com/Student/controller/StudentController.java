package com.Student.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.Student.model.Student;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Student.repo.StudentRepository;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(value="/api")
public class StudentController {

	@Autowired
	StudentRepository repository;

	@GetMapping("students-list")
	public ResponseEntity<List<Student>> allstudents() {
		List<Student> students = new ArrayList<>();
		try {
			repository.findAll().forEach(students::add);
			if (students.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(students, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("student/{student_id}")
	public ResponseEntity<Student>  getStudentByID(@PathVariable("student_id") long id) {
		try {
			Optional<Student> student = repository.findById(id);
			return new ResponseEntity(student, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "save-student")
	public ResponseEntity<Student> saveStudent(@RequestBody Student student) {
		try {
			repository.save(student);
			return new ResponseEntity<>(student, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
	}
    @PutMapping(value = "update-student/{student_id}")
    public ResponseEntity updateStudent(@RequestBody Student student, @PathVariable("student_id") Long student_id) {
		return repository.findById(student_id)
				.map(newStudent -> {
					try {
                			newStudent.setStudent_branch(student.getStudent_branch());
							newStudent.setStudent_email(student.getStudent_email());
							newStudent.setStudent_name(student.getStudent_name());
                			repository.save(newStudent);
                			return new ResponseEntity(newStudent, HttpStatus.CREATED);
            			} catch (Exception e) {
                			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
					}})
                .orElseGet(() -> {
					student.setStudent_id(student_id);
					repository.save(student);
					return new ResponseEntity(student, HttpStatus.CREATED);
					});
    }
	@DeleteMapping("delete-student/{student_id}")
	public ResponseEntity<HttpStatus> deleteStudent(@PathVariable("student_id") Long student_id) {
		try {
			repository.deleteById(student_id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
	}



}



