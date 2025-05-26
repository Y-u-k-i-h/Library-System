package edu.strathmore.backend.controller;


import edu.strathmore.backend.model.Staff;
import edu.strathmore.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody Staff staff) {
        staff = staffService.save(staff);
        return ResponseEntity.status(HttpStatus.CREATED).body(staff);
    }
    @GetMapping("/staff")
    public List<Staff> getAllStaffs() {
        return staffService.findAll();
    }
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<?> findStaffById(@PathVariable int staffId){
        Optional<Staff> staff = staffService.findByStaffId(staffId);
        if(staff.isPresent()){
            return ResponseEntity.ok(staff);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("staff not found");
        }

    }
    @PutMapping("/staff/{staffId}")
    public ResponseEntity<?> updateStaff(@PathVariable int staffId, @RequestBody Staff staff){
        Staff updatedstaff = staffService.updateStaff(staffId, staff);
        if(updatedstaff != null){
            return ResponseEntity.ok(updatedstaff);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("staff not found");
        }
    }
    @DeleteMapping("/staff/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable int staffId){
        Optional<Staff> staffToDelete = staffService.findByStaffId(staffId);
        if(staffToDelete.isPresent()){
            staffService.deleteStaff(staffId);
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found");
        }
    }

}


