package edu.strathmore.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {
    private long studentId;
    private String faculty;
    private String course;
    private String year;
    private String student_status;

    public Student() {}
    public Student(long studentId, String faculty, String course, String year, String student_status) {
        this.studentId = studentId;
        this.faculty = faculty;
        this.course = course;
        this.year = year;

        this.student_status = student_status;

    }



    public void setStudentId(long studentId) {
        this.studentId = studentId;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }



    public String getStudent_status() {
        return student_status;
    }

    public void setStudent_status(String student_status) {
        this.student_status = student_status;
    }

    public long getStudentId() {
        return studentId;
    }
}
