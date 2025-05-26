package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.Announcement;
import edu.strathmore.backend.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Announcement> create(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.create(announcement));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Announcement>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getForUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
