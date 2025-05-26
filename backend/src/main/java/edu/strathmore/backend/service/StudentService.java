package edu.strathmore.backend.service;

import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.Student;
import edu.strathmore.backend.repository.BorrowingRepository;
import edu.strathmore.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BorrowingRepository borrowingRepository;

    public Student save(Student student) {
        return studentRepository.save(student);
    }
    public List<Student> findAll() {
        return studentRepository.findAll();
    }
    public Student findByStudentId(long studentId) {
        return studentRepository.findByStudentId(studentId).orElse(null);
    }
    public Student update(long studentId, Student studentToUpdate) {
        return studentRepository.findByStudentId(studentId).map(student ->{
            student.setFname(studentToUpdate.getFname());
            student.setLname(studentToUpdate.getLname());
            student.setEmail(studentToUpdate.getEmail());
            student.setPhone(studentToUpdate.getPhone());
            student.setAddress(studentToUpdate.getAddress());
            student.setGender(studentToUpdate.getGender());
            student.setPassword(studentToUpdate.getPassword());
            student.setStudentId(studentToUpdate.getStudentId());
            student.setFaculty(studentToUpdate.getFaculty());
            student.setCourse(studentToUpdate.getCourse());
            student.setYear(studentToUpdate.getYear());

            student.setStudent_status(studentToUpdate.getStudent_status());
            return studentRepository.save(student);
        }).orElse(null);
    }
    public void delete(int studentId) {
        studentRepository.deleteByStudentId(studentId);
    }
    public List<BorrowingDetails> getBorrowingDetails(long studentId) {
        return borrowingRepository.findByBorrowerIdAndReturnDateIsNull(studentId);
    }

}
