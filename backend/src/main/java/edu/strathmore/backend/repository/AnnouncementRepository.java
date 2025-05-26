package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByTargetUser_Id(Long userId);
    List<Announcement> findByPostedBy_Id(Long adminId);
}
