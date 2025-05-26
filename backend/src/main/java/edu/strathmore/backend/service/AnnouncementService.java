package edu.strathmore.backend.service;

import edu.strathmore.backend.model.Announcement;

import java.util.List;

public interface AnnouncementService {
    Announcement create(Announcement announcement);
    List<Announcement> getForUser(long userId);
    List<Announcement> getAll();
}
