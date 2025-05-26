package edu.strathmore.backend.service;

import edu.strathmore.backend.model.Announcement;
import edu.strathmore.backend.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private AnnouncementRepository announcementRepo;

    @Override
    public Announcement create(Announcement announcement) {
        return announcementRepo.save(announcement);
    }
    @Override
    public List<Announcement> getForUser(long userId){
        return announcementRepo.findByTargetUser_Id(userId);

    }
    @Override
    public List<Announcement> getAll(){
        return announcementRepo.findAll();
    }

}
