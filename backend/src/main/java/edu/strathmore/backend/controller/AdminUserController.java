package edu.strathmore.backend.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.AdminUser;
import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.service.AdminUserService;
import edu.strathmore.backend.service.BookService;
import edu.strathmore.backend.service.UserService;

@RestController
@RequestMapping("api")
public class AdminUserController {
    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    // Admin can CRUD other admins
    @PostMapping("/admin/admins")
    public AdminUser saveAdminUser(@RequestBody AdminUser adminUser) {
        return adminUserService.addAdminUser(adminUser);
    }
    @GetMapping("/admin/admins")
    public List<AdminUser> getAllAdminUsers() {
        return adminUserService.getAllAdminUsers();
    }
    @GetMapping("/admin/admins/{id}")
    public AdminUser getAdminUser(@PathVariable int id) {
        return adminUserService.getAdminUser(id);
    }
    @PutMapping("/admin/admins/{id}")
    public ResponseEntity<?> updateAdminUser(@PathVariable int id, @RequestBody AdminUser adminUser) {
        AdminUser adminUserToBeUpdated = adminUserService.getAdminUser(id);
        if (adminUserToBeUpdated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrator not found");
        }
        return ResponseEntity.ok(adminUserToBeUpdated);

    }
    @DeleteMapping("admin/admins/{id}")
    public void deleteAdminUser(@PathVariable int id) {
        adminUserService.deleteAdminUser(id);
    }


    // Admin can search for users and delete users
    // Note: /admin/users endpoint moved to AdminController for enhanced functionality
    @GetMapping("/admin/users/{userid}")
    public ResponseEntity<?> findUserById(@PathVariable long userid) {
        User user = userService.findById(userid);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }
    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    // Manage books
    @GetMapping("/admin/books")
    public List<Book> getBooks() {
        return bookService.findAll();
    }

    @GetMapping("/admin/books/{title}")
    public ResponseEntity<?> findBookById(@PathVariable String title) {
        Book book = bookService.findByTitle(title);
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
        return ResponseEntity.ok(book);
    }

    @PostMapping("/admin/books/add")
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        book = bookService.save(book);
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/admin/books/{title}")
    public void deleteBook(@PathVariable String title) {
        Book book = bookService.findByTitle(title);
        if (book == null) {
            throw new IllegalArgumentException("Book not found");
        }
        bookService.deleteByTitle(title);

    }




}