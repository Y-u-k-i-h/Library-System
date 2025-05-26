package edu.strathmore.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Management")

public class AdminUser extends User {
    private long managementId;
    private String position;



    public AdminUser() {}



    public void setManagementId(long managementId) {
        this.managementId = managementId;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public long getManagementId() {
        return managementId;
    }
}
