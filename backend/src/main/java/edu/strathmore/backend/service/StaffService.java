package edu.strathmore.backend.service;
// Main Logic layer
import edu.strathmore.backend.model.Staff;
import edu.strathmore.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;
    
    public Staff save(Staff staff) {
        return staffRepository.save(staff);
    }
    public List<Staff> findAll() {
        return staffRepository.findAll();
    }
    public Optional<Staff> findByStaffId(int id) {
        return staffRepository.findByStaffId(id);
    }
    public Staff updateStaff(int id, Staff staffToUpdate) {
        return staffRepository.findByStaffId(id).map(staff -> {
            staff.setFname(staffToUpdate.getFname());
            staff.setLname(staffToUpdate.getLname());
            staff.setEmail(staffToUpdate.getEmail());
            staff.setPhone(staffToUpdate.getPhone());
            staff.setAddress(staffToUpdate.getAddress());
            staff.setGender(staffToUpdate.getGender());
            staff.setPassword(staffToUpdate.getPassword());
            staff.setStaffId(staffToUpdate.getStaffId());
            staff.setFaculty(staffToUpdate.getFaculty());
            staff.setDepartment(staffToUpdate.getDepartment());
            return staffRepository.save(staff);
        }).orElse(null);
    }
    public void deleteStaff(int id) {
        staffRepository.deleteByStaffId(id);
    }


}
