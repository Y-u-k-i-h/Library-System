package edu.strathmore.backend.service;

import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.Fine;

import java.util.List;

public interface FineService {
    Fine calculateFine(BorrowingDetails borrowingDetails);
    Fine payFine(long fineId);
    public List<Fine> getFineByUserId(long userId);

}
