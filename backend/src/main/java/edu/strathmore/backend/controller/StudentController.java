package edu.strathmore.backend.controller;


import edu.strathmore.backend.model.*;
import edu.strathmore.backend.service.BookService;
import edu.strathmore.backend.service.FeedbackServiceImpl;
import edu.strathmore.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private FeedbackServiceImpl feedbackService;

    @Autowired
    private BookService bookService;


    // CRUD for students
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        student = studentService.save(student);
        return ResponseEntity.ok(student);
    }
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.findAll();
    }
    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> findStudentById(@PathVariable int studentId){
        Student student = studentService.findByStudentId(studentId);
        if(student != null){
            return ResponseEntity.ok(student);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }

    }
    @PutMapping("/students/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable int studentId, @RequestBody Student student){
        Student updatedStudent = studentService.update(studentId, student);
        if(updatedStudent != null){
            return ResponseEntity.ok(updatedStudent);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
    }
    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable int studentId){
        Student studentToDelete = studentService.findByStudentId(studentId);
        if(studentToDelete != null){
            studentService.delete(studentId);
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
    }

    // Borrowing books
    @GetMapping("/students/{studentId}/borrowed")
    public List<BorrowingDetails> getBorrowedBooks(@PathVariable long studentId){
        return studentService.getBorrowingDetails(studentId);
    }

    // Posting feedback about a book {studentId} {BookId} {responseBody content} {LocalDate.now}

    @PostMapping("/students/{studentId}/borrowed/{title}/feedback")
    public Feedback postFeedback(@PathVariable long studentId, @PathVariable String title, @RequestBody Feedback feedback){
        Student student = studentService.findByStudentId(studentId);
        Book book = bookService.findByTitle(title);
        feedback.setUser(student);
        feedback.setBook(book);
        return feedbackService.createFeedback(feedback);

    }

}
