package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    AdminUser findByManagementId(long managementId);
    void deleteByManagementId(long managementId);
}
