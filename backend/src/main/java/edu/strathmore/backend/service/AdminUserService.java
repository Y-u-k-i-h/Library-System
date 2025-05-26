package edu.strathmore.backend.service;

import edu.strathmore.backend.model.AdminUser;
import edu.strathmore.backend.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    public AdminUser addAdminUser(AdminUser adminUser) {
        return adminUserRepository.save(adminUser);
    }
    public List<AdminUser> getAllAdminUsers() {
        return adminUserRepository.findAll();
    }
    public AdminUser getAdminUser(int id) {
        return adminUserRepository.findByManagementId(id);
    }
    public AdminUser updateAdminUser(AdminUser adminUser) {
        return adminUserRepository.save(adminUser);
    }
    public void deleteAdminUser(int id) {
        adminUserRepository.deleteByManagementId(id);
    }


}
