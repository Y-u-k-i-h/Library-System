package edu.strathmore.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.UserRepository;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    // Create
    public User save(User user) {
        return userRepository.save(user);
    }

    // Read
    public List<User> findAll() {
      return userRepository.findAll();
    }
    public User findById(long id) {
        return userRepository.findById(id).orElse(null);
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public User findByUserCode(String userCode) {
        return userRepository.findByUserCode(userCode).orElse(null);
    }


    // Update
    public User updateUser(long id, User userToBeUpdated) {
        return userRepository.findById(id).map(user -> {

            user.setFname(userToBeUpdated.getFname());
            user.setLname(userToBeUpdated.getLname());
            user.setEmail(userToBeUpdated.getEmail());
            user.setEmail(userToBeUpdated.getEmail());
            user.setAddress(userToBeUpdated.getAddress());
            user.setDateOfBirth(userToBeUpdated.getDateOfBirth());
            user.setGender(userToBeUpdated.getGender());
            user.setPassword(userToBeUpdated.getPassword());

            return userRepository.save(user);
        }).orElse(null);
    }


    // Delete
    public void deleteById(long id) {
        userRepository.deleteById(id);
    }

}
