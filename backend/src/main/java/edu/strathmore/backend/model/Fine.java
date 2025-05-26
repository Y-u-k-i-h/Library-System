package edu.strathmore.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@DiscriminatorValue("FINE")
public class Fine extends PaymentDetails{

    @OneToOne
    @JoinColumn(name="borrowing_id")
    private BorrowingDetails borrowing;
    private String reason;
    private boolean paid;


    public BorrowingDetails getBorrowing() {
        return borrowing;
    }

    public void setBorrowing(BorrowingDetails borrowing) {
        this.borrowing = borrowing;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }
}
