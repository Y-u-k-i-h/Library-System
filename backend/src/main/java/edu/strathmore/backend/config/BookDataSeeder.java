package edu.strathmore.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.repository.BookRepository;

@Component
public class BookDataSeeder implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed books if the database is empty
        if (bookRepository.count() == 0) {
            seedBooks();
            System.out.println("Database was empty, seeded books successfully");
        } else {
            System.out.println("Books already exist in database, skipping seeding");
        }
    }

    private void seedBooks() {
        List<Book> books = Arrays.asList(
            // Fiction - 20 books
            new Book("978-0-7432-7356-5", "To Kill a Mockingbird", "Harper Lee", "J.B. Lippincott & Co.", "Fiction", true, "Good"),
            new Book("978-0-452-28423-4", "1984", "George Orwell", "Secker & Warburg", "Fiction", true, "Excellent"),
            new Book("978-0-7432-4722-4", "The Great Gatsby", "F. Scott Fitzgerald", "Charles Scribner's Sons", "Fiction", true, "Fair"),
            new Book("978-0-14-143951-8", "Pride and Prejudice", "Jane Austen", "T. Egerton", "Fiction", true, "Excellent"),
            new Book("978-0-7432-7357-2", "The Catcher in the Rye", "J.D. Salinger", "Little, Brown and Company", "Fiction", true, "Good"),
            new Book("978-0-14-017739-8", "Jane Eyre", "Charlotte Brontë", "Smith, Elder & Co.", "Fiction", true, "Good"),
            new Book("978-0-441-17271-9", "Dune", "Frank Herbert", "Chilton Books", "Fiction", true, "Good"),
            new Book("978-0-544-00341-5", "The Lord of the Rings", "J.R.R. Tolkien", "George Allen & Unwin", "Fiction", true, "Excellent"),
            new Book("978-0-345-39180-3", "The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Pan Books", "Fiction", true, "Excellent"),
            new Book("978-0-553-21311-8", "A Game of Thrones", "George R.R. Martin", "Bantam Spectra", "Fiction", true, "Excellent"),
            new Book("978-0-14-143955-6", "Wuthering Heights", "Emily Brontë", "Thomas Cautley Newby", "Fiction", true, "Fair"),
            new Book("978-0-486-27061-0", "Crime and Punishment", "Fyodor Dostoevsky", "The Russian Messenger", "Fiction", true, "Excellent"),
            new Book("978-0-14-144114-6", "The Brothers Karamazov", "Fyodor Dostoevsky", "The Russian Messenger", "Fiction", true, "Good"),
            new Book("978-0-14-143957-0", "Moby Dick", "Herman Melville", "Richard Bentley", "Fiction", true, "Fair"),
            new Book("978-0-553-29335-0", "Foundation", "Isaac Asimov", "Gnome Press", "Fiction", true, "Fair"),
            new Book("978-0-441-56956-9", "Neuromancer", "William Gibson", "Ace Books", "Fiction", true, "Good"),
            new Book("978-0-553-38068-2", "The Martian", "Andy Weir", "Crown Publishers", "Fiction", true, "Good"),
            new Book("978-0-345-39181-0", "Ender's Game", "Orson Scott Card", "Tor Books", "Fiction", true, "Excellent"),
            new Book("978-0-441-78042-5", "Blade Runner", "Philip K. Dick", "Doubleday", "Fiction", true, "Fair"),
            new Book("978-0-345-40946-1", "The Name of the Wind", "Patrick Rothfuss", "DAW Books", "Fiction", true, "Good"),

            // Non-Fiction - 20 books
            new Book("978-0-06-231609-7", "Sapiens", "Yuval Noah Harari", "Harvill Secker", "Non-Fiction", true, "Excellent"),
            new Book("978-0-553-38016-3", "A Brief History of Time", "Stephen Hawking", "Bantam Dell", "Non-Fiction", true, "Good"),
            new Book("978-1-4000-5217-2", "The Immortal Life of Henrietta Lacks", "Rebecca Skloot", "Crown Publishers", "Non-Fiction", true, "Excellent"),
            new Book("978-0-307-26543-0", "The Guns of August", "Barbara Tuchman", "Macmillan", "Non-Fiction", true, "Fair"),
            new Book("978-0-14-303943-3", "The Silk Roads", "Peter Frankopan", "Bloomsbury Publishing", "Non-Fiction", true, "Good"),
            new Book("978-0-06-073132-6", "Freakonomics", "Steven Levitt", "William Morrow", "Non-Fiction", true, "Good"),
            new Book("978-0-06-112008-4", "The Wealth of Nations", "Adam Smith", "W. Strahan and T. Cadell", "Non-Fiction", true, "Good"),
            new Book("978-1-58542-433-7", "Think and Grow Rich", "Napoleon Hill", "The Ralston Society", "Non-Fiction", true, "Fair"),
            new Book("978-0-307-88789-4", "The Lean Startup", "Eric Ries", "Crown Business", "Non-Fiction", true, "Good"),
            new Book("978-0-375-50411-3", "Zero to One", "Peter Thiel", "Crown Business", "Non-Fiction", true, "Excellent"),
            new Book("978-0-14-044329-0", "The Republic", "Plato", "Ancient Greece Publishers", "Non-Fiction", true, "Good"),
            new Book("978-0-14-044394-8", "Meditations", "Marcus Aurelius", "Ancient Rome Publishers", "Non-Fiction", true, "Excellent"),
            new Book("978-0-14-044395-5", "The Nicomachean Ethics", "Aristotle", "Ancient Greece Publishers", "Non-Fiction", true, "Fair"),
            new Book("978-0-14-044396-2", "Beyond Good and Evil", "Friedrich Nietzsche", "German Publishers", "Non-Fiction", true, "Good"),
            new Book("978-0-06-662099-2", "Good to Great", "Jim Collins", "HarperBusiness", "Non-Fiction", true, "Excellent"),
            new Book("978-0-06-055566-5", "The Intelligent Investor", "Benjamin Graham", "Harper & Brothers", "Non-Fiction", true, "Fair"),
            new Book("978-0-307-46314-7", "The 4-Hour Workweek", "Timothy Ferriss", "Crown Publishers", "Non-Fiction", true, "Good"),
            new Book("978-0-06-256541-5", "Built to Last", "Jim Collins", "HarperBusiness", "Non-Fiction", true, "Excellent"),
            new Book("978-0-307-46374-1", "Rich Dad Poor Dad", "Robert Kiyosaki", "Warner Business Books", "Non-Fiction", true, "Fair"),
            new Book("978-0-375-50412-0", "Homo Deus", "Yuval Noah Harari", "Harvill Secker", "Non-Fiction", true, "Good"),

            // Textbook - 25 books
            new Book("978-0-321-57428-4", "Calculus: Early Transcendentals", "James Stewart", "Cengage Learning", "Textbook", true, "Good"),
            new Book("978-0-321-98650-4", "Linear Algebra and Its Applications", "David Lay", "Pearson", "Textbook", true, "Excellent"),
            new Book("978-0-470-45840-5", "Discrete Mathematics and Its Applications", "Kenneth Rosen", "McGraw-Hill", "Textbook", true, "Fair"),
            new Book("978-0-321-73571-8", "Statistics for Engineers and Scientists", "William Navidi", "McGraw-Hill", "Textbook", true, "Good"),
            new Book("978-0-321-74362-1", "University Physics with Modern Physics", "Hugh Young", "Pearson", "Textbook", true, "Excellent"),
            new Book("978-0-471-40185-7", "Fundamentals of Physics", "David Halliday", "Wiley", "Textbook", true, "Good"),
            new Book("978-0-321-90362-4", "Physics for Scientists and Engineers", "Raymond Serway", "Cengage", "Textbook", true, "Fair"),
            new Book("978-0-321-80924-7", "Chemistry: The Central Science", "Theodore Brown", "Pearson", "Textbook", true, "Good"),
            new Book("978-0-534-42012-3", "General Chemistry", "Darrell Ebbing", "Cengage Learning", "Textbook", true, "Excellent"),
            new Book("978-0-321-95721-4", "Organic Chemistry", "Paula Bruice", "Pearson", "Textbook", true, "Fair"),
            new Book("978-0-321-55823-9", "Campbell Biology", "Jane Reece", "Pearson", "Textbook", true, "Excellent"),
            new Book("978-0-321-74367-6", "Molecular Biology of the Cell", "Bruce Alberts", "Garland Science", "Textbook", true, "Good"),
            new Book("978-0-321-74841-1", "Principles of Genetics", "Peter Snustad", "Wiley", "Textbook", true, "Fair"),
            new Book("978-0-13-235088-4", "Clean Code", "Robert C. Martin", "Prentice Hall", "Textbook", true, "Excellent"),
            new Book("978-0-262-03384-8", "Introduction to Algorithms", "Thomas H. Cormen", "MIT Press", "Textbook", true, "Fair"),
            new Book("978-0-321-12742-6", "Effective Java", "Joshua Bloch", "Addison-Wesley", "Textbook", true, "Good"),
            new Book("978-0-13-597871-7", "Database System Concepts", "Abraham Silberschatz", "McGraw-Hill", "Textbook", true, "Fair"),
            new Book("978-0-321-35668-0", "Computer Networks", "Andrew S. Tanenbaum", "Prentice Hall", "Textbook", true, "Excellent"),
            new Book("978-0-13-142930-5", "Operating System Concepts", "Abraham Silberschatz", "John Wiley & Sons", "Textbook", true, "Good"),
            new Book("978-0-312-64729-8", "A History of World Societies", "John McKay", "Bedford/St. Martin's", "Textbook", true, "Good"),
            new Book("978-0-495-05065-0", "Western Civilizations", "Joshua Cole", "W. W. Norton", "Textbook", true, "Excellent"),
            new Book("978-0-321-42733-3", "African History: From Earliest Times to Independence", "Philip Curtin", "Longman", "Textbook", true, "Fair"),
            new Book("978-0-19-957676-8", "Constitutional Law: Principles and Policies", "Erwin Chemerinsky", "Wolters Kluwer", "Textbook", true, "Good"),
            new Book("978-0-314-18206-4", "Criminal Law", "Wayne LaFave", "West Academic", "Textbook", true, "Excellent"),
            new Book("978-0-13-294886-9", "Principles of Economics", "N. Gregory Mankiw", "Cengage Learning", "Textbook", true, "Good"),

            // Biography - 10 books
            new Book("978-0-553-29698-6", "The Diary of a Young Girl", "Anne Frank", "Contact Publishing", "Biography", true, "Good"),
            new Book("978-1-4516-4853-9", "Steve Jobs", "Walter Isaacson", "Simon & Schuster", "Biography", true, "Fair"),
            new Book("978-0-7432-7358-9", "John Adams", "David McCullough", "Simon & Schuster", "Biography", true, "Good"),
            new Book("978-0-679-64026-6", "Team of Rivals", "Doris Kearns Goodwin", "Simon & Schuster", "Biography", true, "Excellent"),
            new Book("978-0-375-50442-7", "Alexander Hamilton", "Ron Chernow", "Penguin Press", "Biography", true, "Fair"),
            new Book("978-0-670-03073-4", "Einstein: His Life and Universe", "Walter Isaacson", "Simon & Schuster", "Biography", true, "Good"),
            new Book("978-0-670-03074-1", "Leonardo da Vinci", "Walter Isaacson", "Simon & Schuster", "Biography", true, "Excellent"),
            new Book("978-0-375-50443-4", "Washington: A Life", "Ron Chernow", "Penguin Press", "Biography", true, "Good"),
            new Book("978-0-553-29699-3", "Long Walk to Freedom", "Nelson Mandela", "Little, Brown", "Biography", true, "Fair"),
            new Book("978-0-670-03075-8", "Benjamin Franklin: An American Life", "Walter Isaacson", "Simon & Schuster", "Biography", true, "Excellent"),

            // Poetry - 8 books
            new Book("978-0-14-042470-1", "The Complete Poems of Emily Dickinson", "Emily Dickinson", "Little, Brown", "Poetry", true, "Excellent"),
            new Book("978-0-679-64224-6", "The Collected Poems of W.B. Yeats", "W.B. Yeats", "Macmillan", "Poetry", true, "Good"),
            new Book("978-0-14-018473-0", "Selected Poems", "Robert Frost", "Henry Holt", "Poetry", true, "Fair"),
            new Book("978-0-374-53302-4", "The Waste Land and Other Poems", "T.S. Eliot", "Harcourt", "Poetry", true, "Excellent"),
            new Book("978-0-14-044789-2", "Leaves of Grass", "Walt Whitman", "David McKay", "Poetry", true, "Good"),
            new Book("978-0-14-042471-8", "The Complete Poems of Maya Angelou", "Maya Angelou", "Random House", "Poetry", true, "Good"),
            new Book("978-0-679-64225-3", "The Collected Poems of Langston Hughes", "Langston Hughes", "Vintage", "Poetry", true, "Fair"),
            new Book("978-0-374-53303-1", "Ariel", "Sylvia Plath", "Harper & Row", "Poetry", true, "Excellent"),

            // Research Paper - 6 books
            new Book("978-0-262-51298-4", "Advances in Machine Learning Research", "MIT Research Lab", "MIT Press", "Research Paper", true, "Good"),
            new Book("978-0-471-23094-7", "Climate Change Research Findings", "Environmental Science Group", "Wiley", "Research Paper", true, "Excellent"),
            new Book("978-0-321-77432-1", "Quantum Computing Research Papers", "Physics Department", "Academic Press", "Research Paper", true, "Fair"),
            new Book("978-0-894-03821-5", "Biomedical Engineering Research", "Medical Research Institute", "Elsevier", "Research Paper", true, "Good"),
            new Book("978-0-262-51299-1", "Artificial Intelligence Research Advances", "Stanford AI Lab", "MIT Press", "Research Paper", true, "Excellent"),
            new Book("978-0-471-23095-4", "Renewable Energy Research", "Energy Institute", "Wiley", "Research Paper", true, "Fair"),

            // Atlas/Maps - 6 books
            new Book("978-0-19-532338-4", "Oxford Atlas of the World", "Oxford University Press", "Oxford Press", "Atlas/Maps", true, "Excellent"),
            new Book("978-0-7922-6200-6", "National Geographic World Atlas", "National Geographic", "National Geographic", "Atlas/Maps", true, "Good"),
            new Book("978-0-528-84157-2", "Rand McNally World Atlas", "Rand McNally", "Rand McNally", "Atlas/Maps", true, "Fair"),
            new Book("978-0-07-147877-6", "Times Atlas of the World", "Times Books", "Times Books", "Atlas/Maps", true, "Good"),
            new Book("978-0-19-532339-1", "Oxford Historical Atlas", "Oxford University Press", "Oxford Press", "Atlas/Maps", true, "Excellent"),
            new Book("978-0-7922-6201-3", "National Geographic Kids World Atlas", "National Geographic", "National Geographic", "Atlas/Maps", true, "Good"),

            // Children's Literature - 12 books
            new Book("978-0-06-440055-8", "Where the Wild Things Are", "Maurice Sendak", "Harper & Row", "Children's Literature", true, "Excellent"),
            new Book("978-0-439-70818-8", "Harry Potter and the Philosopher's Stone", "J.K. Rowling", "Bloomsbury", "Children's Literature", true, "Good"),
            new Book("978-0-14-036753-3", "The Cat in the Hat", "Dr. Seuss", "Random House", "Children's Literature", true, "Fair"),
            new Book("978-0-06-440020-6", "Charlotte's Web", "E.B. White", "Harper & Brothers", "Children's Literature", true, "Excellent"),
            new Book("978-0-14-036742-7", "The Very Hungry Caterpillar", "Eric Carle", "World Publishing", "Children's Literature", true, "Good"),
            new Book("978-0-06-440017-6", "Goodnight Moon", "Margaret Wise Brown", "Harper & Brothers", "Children's Literature", true, "Fair"),
            new Book("978-0-439-13597-4", "The Giving Tree", "Shel Silverstein", "Harper & Row", "Children's Literature", true, "Good"),
            new Book("978-0-439-70819-5", "Harry Potter and the Chamber of Secrets", "J.K. Rowling", "Bloomsbury", "Children's Literature", true, "Excellent"),
            new Book("978-0-14-036754-0", "Green Eggs and Ham", "Dr. Seuss", "Random House", "Children's Literature", true, "Good"),
            new Book("978-0-06-440021-3", "Stuart Little", "E.B. White", "Harper & Brothers", "Children's Literature", true, "Fair"),
            new Book("978-0-439-70820-1", "Harry Potter and the Prisoner of Azkaban", "J.K. Rowling", "Bloomsbury", "Children's Literature", true, "Excellent"),
            new Book("978-0-14-036755-7", "Oh, the Places You'll Go!", "Dr. Seuss", "Random House", "Children's Literature", true, "Good")
        );

        bookRepository.saveAll(books);
        System.out.println("Seeded " + books.size() + " books into the database");
    }
}
