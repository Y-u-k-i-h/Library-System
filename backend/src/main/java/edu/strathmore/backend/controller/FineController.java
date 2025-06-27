package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.Fine;
import edu.strathmore.backend.service.FineServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineServiceImpl fineService;

    public FineController(FineServiceImpl fineService) {
        this.fineService = fineService;
    }
    @PostMapping("/create")
    public ResponseEntity<?> createFine(@RequestBody Fine fine){
        Fine newFine = fineService.createFine(fine);
        return ResponseEntity.ok(newFine);
    }
    @GetMapping("/user/{userId}")
    public List<Fine> getUserFines(@PathVariable("userId") long userId) {
        return fineService.getFineByUserId(userId);
    }
    @PutMapping("/{fineId}/pay")
    public ResponseEntity<?> payFine(@PathVariable long fineId){
        Fine fine = fineService.payFine(fineId);
        return ResponseEntity.ok(fine);
    }

}