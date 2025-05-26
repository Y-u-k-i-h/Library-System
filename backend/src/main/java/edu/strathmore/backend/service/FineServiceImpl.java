package edu.strathmore.backend.service;

import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.Fine;
import edu.strathmore.backend.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FineServiceImpl implements FineService {
    @Autowired
    private FineRepository fineRepo;

    @Override
    public Fine calculateFine(BorrowingDetails borrowing){
        if(borrowing.getReturnDate() == null){
            throw new IllegalStateException("Book not returned yet");

        }
        long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(borrowing.getDueDate(), borrowing.getReturnDate());

        if(daysOverdue<=0){
            return null;
        }
        float fineAmount = daysOverdue*10;

        Fine fine = new Fine();
        fine.setBorrowing(borrowing);
        fine.setAmount(fineAmount);
        fine.setReason("Overdue by: "+daysOverdue+" days");
        fine.setPaymentDate(LocalDate.now());
        fine.setPaid(false);
        return fineRepo.save(fine);
    }

    @Override
    public Fine payFine(long fineId){
        Fine fine = fineRepo.findById(fineId).orElseThrow(() -> new RuntimeException("Fine not found"));

        if (fine.isPaid()){
            throw new RuntimeException("Fine already paid");
        }
        fine.setPaid(true);
        fine.setPaymentDate(LocalDate.now());
        return fineRepo.save(fine);
    }
    @Override
    public List<Fine> getFineByUserId(long userId){
        return fineRepo.findByUserId(userId);
    }
    public Fine getFineById(long fineId){
        return fineRepo.findById(fineId).orElseThrow(() -> new RuntimeException("Fine not found"));
    }
    public Fine createFine(Fine fine){
        return fineRepo.save(fine);
    }

}
