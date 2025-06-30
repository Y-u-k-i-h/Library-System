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
        // Only seed data if the database is empty
        if (bookRepository.count() == 0) {
            seedBooks();
        }
    }

    private void seedBooks() {
        List<Book> books = Arrays.asList(
            // Classic Literature
            new Book("978-0-7432-7356-5", "To Kill a Mockingbird", "Harper Lee", "J.B. Lippincott & Co.", "Fiction", true, "Good"),
            new Book("978-0-452-28423-4", "1984", "George Orwell", "Secker & Warburg", "Dystopian Fiction", false, "Excellent"),
            new Book("978-0-7432-4722-4", "The Great Gatsby", "F. Scott Fitzgerald", "Charles Scribner's Sons", "Fiction", true, "Fair"),
            new Book("978-0-14-143951-8", "Pride and Prejudice", "Jane Austen", "T. Egerton", "Romance", true, "Excellent"),
            new Book("978-0-7432-7357-2", "The Catcher in the Rye", "J.D. Salinger", "Little, Brown and Company", "Fiction", false, "Good"),
            new Book("978-0-14-017739-8", "Jane Eyre", "Charlotte Brontë", "Smith, Elder & Co.", "Gothic Fiction", true, "Good"),
            new Book("978-0-14-143955-6", "Wuthering Heights", "Emily Brontë", "Thomas Cautley Newby", "Gothic Fiction", false, "Fair"),
            new Book("978-0-486-27061-0", "Crime and Punishment", "Fyodor Dostoevsky", "The Russian Messenger", "Classic Literature", true, "Excellent"),
            new Book("978-0-14-144114-6", "The Brothers Karamazov", "Fyodor Dostoevsky", "The Russian Messenger", "Classic Literature", true, "Good"),
            new Book("978-0-14-143957-0", "Moby Dick", "Herman Melville", "Richard Bentley", "Adventure", false, "Fair"),
            
            // Science Fiction & Fantasy
            new Book("978-0-441-17271-9", "Dune", "Frank Herbert", "Chilton Books", "Science Fiction", true, "Good"),
            new Book("978-0-544-00341-5", "The Lord of the Rings", "J.R.R. Tolkien", "George Allen & Unwin", "Fantasy", true, "Excellent"),
            new Book("978-0-553-29335-0", "Foundation", "Isaac Asimov", "Gnome Press", "Science Fiction", false, "Fair"),
            new Book("978-0-441-56956-9", "Neuromancer", "William Gibson", "Ace Books", "Cyberpunk", true, "Good"),
            new Book("978-0-345-39180-3", "The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Pan Books", "Science Fiction", true, "Excellent"),
            new Book("978-0-553-38068-2", "The Martian", "Andy Weir", "Crown Publishers", "Science Fiction", false, "Good"),
            new Book("978-0-345-39181-0", "Ender's Game", "Orson Scott Card", "Tor Books", "Science Fiction", true, "Excellent"),
            new Book("978-0-441-78042-5", "Blade Runner", "Philip K. Dick", "Doubleday", "Science Fiction", true, "Fair"),
            new Book("978-0-345-40946-1", "The Name of the Wind", "Patrick Rothfuss", "DAW Books", "Fantasy", false, "Good"),
            new Book("978-0-553-21311-8", "A Game of Thrones", "George R.R. Martin", "Bantam Spectra", "Fantasy", true, "Excellent"),
            
            // Computer Science & Programming
            new Book("978-0-13-235088-4", "Clean Code", "Robert C. Martin", "Prentice Hall", "Programming", true, "Excellent"),
            new Book("978-0-201-63361-0", "Design Patterns", "Gang of Four", "Addison-Wesley", "Software Engineering", false, "Good"),
            new Book("978-0-262-03384-8", "Introduction to Algorithms", "Thomas H. Cormen", "MIT Press", "Computer Science", true, "Fair"),
            new Book("978-0-596-51774-8", "JavaScript: The Good Parts", "Douglas Crockford", "O'Reilly Media", "Programming", true, "Good"),
            new Book("978-0-201-61622-4", "The Pragmatic Programmer", "Andrew Hunt", "Addison-Wesley", "Software Development", false, "Excellent"),
            new Book("978-0-321-12742-6", "Effective Java", "Joshua Bloch", "Addison-Wesley", "Programming", true, "Good"),
            new Book("978-0-13-597871-7", "Database System Concepts", "Abraham Silberschatz", "McGraw-Hill", "Database", false, "Fair"),
            new Book("978-0-321-35668-0", "Computer Networks", "Andrew S. Tanenbaum", "Prentice Hall", "Networking", true, "Excellent"),
            new Book("978-0-13-142930-5", "Operating System Concepts", "Abraham Silberschatz", "John Wiley & Sons", "Operating Systems", true, "Good"),
            new Book("978-0-596-52068-7", "Head First Design Patterns", "Eric Freeman", "O'Reilly Media", "Software Engineering", false, "Fair"),
            
            // Mystery & Thriller
            new Book("978-0-307-94854-4", "The Girl with the Dragon Tattoo", "Stieg Larsson", "Norstedts Förlag", "Mystery", true, "Good"),
            new Book("978-0-307-58836-4", "Gone Girl", "Gillian Flynn", "Crown Publishing", "Thriller", true, "Excellent"),
            new Book("978-0-307-47437-2", "The Da Vinci Code", "Dan Brown", "Doubleday", "Thriller", false, "Fair"),
            new Book("978-0-06-207348-4", "And Then There Were None", "Agatha Christie", "Collins Crime Club", "Mystery", true, "Good"),
            new Book("978-0-312-92458-5", "The Silence of the Lambs", "Thomas Harris", "St. Martin's Press", "Thriller", true, "Excellent"),
            new Book("978-0-375-72767-4", "In the Woods", "Tana French", "Viking Press", "Mystery", false, "Good"),
            new Book("978-0-307-35348-5", "The Big Sleep", "Raymond Chandler", "Alfred A. Knopf", "Detective Fiction", true, "Fair"),
            new Book("978-0-14-018946-9", "The Murder of Roger Ackroyd", "Agatha Christie", "William Collins", "Mystery", true, "Excellent"),
            new Book("978-0-375-50439-7", "The Talented Mr. Ripley", "Patricia Highsmith", "Coward-McCann", "Psychological Thriller", false, "Good"),
            new Book("978-0-307-26543-9", "The Girl on the Train", "Paula Hawkins", "Riverhead Books", "Thriller", true, "Fair"),
            
            // History & Biography
            new Book("978-0-06-231609-7", "Sapiens", "Yuval Noah Harari", "Harvill Secker", "History", true, "Excellent"),
            new Book("978-0-553-29698-6", "The Diary of a Young Girl", "Anne Frank", "Contact Publishing", "Biography", false, "Good"),
            new Book("978-1-4516-4853-9", "Steve Jobs", "Walter Isaacson", "Simon & Schuster", "Biography", true, "Fair"),
            new Book("978-0-553-38016-3", "A Brief History of Time", "Stephen Hawking", "Bantam Dell", "Science", true, "Good"),
            new Book("978-1-4000-5217-2", "The Immortal Life of Henrietta Lacks", "Rebecca Skloot", "Crown Publishers", "Science", true, "Excellent"),
            new Book("978-0-7432-7357-2", "John Adams", "David McCullough", "Simon & Schuster", "Biography", false, "Good"),
            new Book("978-0-307-26543-0", "The Guns of August", "Barbara Tuchman", "Macmillan", "History", true, "Fair"),
            new Book("978-0-679-64026-6", "Team of Rivals", "Doris Kearns Goodwin", "Simon & Schuster", "Biography", true, "Excellent"),
            new Book("978-0-14-303943-3", "The Silk Roads", "Peter Frankopan", "Bloomsbury Publishing", "History", false, "Good"),
            new Book("978-0-375-50442-7", "Alexander Hamilton", "Ron Chernow", "Penguin Press", "Biography", true, "Fair"),
            
            // Business & Economics
            new Book("978-1-58542-433-7", "Think and Grow Rich", "Napoleon Hill", "The Ralston Society", "Business", false, "Fair"),
            new Book("978-0-307-88789-4", "The Lean Startup", "Eric Ries", "Crown Business", "Business", true, "Good"),
            new Book("978-0-06-662099-2", "Good to Great", "Jim Collins", "HarperBusiness", "Business", true, "Excellent"),
            new Book("978-0-06-073132-6", "Freakonomics", "Steven Levitt", "William Morrow", "Economics", false, "Good"),
            new Book("978-0-06-055566-5", "The Intelligent Investor", "Benjamin Graham", "Harper & Brothers", "Finance", true, "Fair"),
            new Book("978-0-307-46314-7", "The 4-Hour Workweek", "Timothy Ferriss", "Crown Publishers", "Business", true, "Good"),
            new Book("978-0-06-256541-5", "Built to Last", "Jim Collins", "HarperBusiness", "Business", false, "Excellent"),
            new Book("978-0-307-46374-1", "Rich Dad Poor Dad", "Robert Kiyosaki", "Warner Business Books", "Finance", true, "Fair"),
            new Book("978-0-06-112008-4", "The Wealth of Nations", "Adam Smith", "W. Strahan and T. Cadell", "Economics", true, "Good"),
            new Book("978-0-375-50411-3", "Zero to One", "Peter Thiel", "Crown Business", "Business", false, "Excellent"),
            
            // Psychology & Self-Help
            new Book("978-0-374-53355-7", "Thinking, Fast and Slow", "Daniel Kahneman", "Farrar, Straus and Giroux", "Psychology", true, "Excellent"),
            new Book("978-1-982-13789-9", "The 7 Habits of Highly Effective People", "Stephen Covey", "Free Press", "Self-Help", true, "Good"),
            new Book("978-0-735-21129-2", "Atomic Habits", "James Clear", "Avery", "Self-Help", false, "Excellent"),
            new Book("978-0-8070-1427-1", "Man's Search for Meaning", "Viktor Frankl", "Beacon Press", "Psychology", true, "Fair"),
            new Book("978-1-577-31480-8", "The Power of Now", "Eckhart Tolle", "New World Library", "Spirituality", true, "Good"),
            new Book("978-0-06-112008-1", "How to Win Friends and Influence People", "Dale Carnegie", "Simon & Schuster", "Self-Help", false, "Good"),
            new Book("978-0-679-64621-3", "Flow", "Mihaly Csikszentmihalyi", "Harper & Row", "Psychology", true, "Excellent"),
            new Book("978-0-553-38371-5", "Mindset", "Carol Dweck", "Random House", "Psychology", true, "Fair"),
            new Book("978-0-06-256541-2", "The Subtle Art of Not Giving a F*ck", "Mark Manson", "HarperOne", "Self-Help", false, "Good"),
            new Book("978-0-375-50278-2", "Emotional Intelligence", "Daniel Goleman", "Bantam Books", "Psychology", true, "Excellent"),
            
            // Modern Fiction
            new Book("978-1-594-48000-3", "The Kite Runner", "Khaled Hosseini", "Riverhead Books", "Fiction", false, "Good"),
            new Book("978-0-15-100811-7", "Life of Pi", "Yann Martel", "Knopf Canada", "Adventure", true, "Excellent"),
            new Book("978-0-375-84220-7", "The Book Thief", "Markus Zusak", "Picador", "Historical Fiction", true, "Fair"),
            new Book("978-0-735-21932-8", "Where the Crawdads Sing", "Delia Owens", "G.P. Putnam's Sons", "Fiction", true, "Good"),
            new Book("978-0-06-112241-5", "The Alchemist", "Paulo Coelho", "HarperTorch", "Fiction", false, "Excellent"),
            new Book("978-0-385-72177-4", "A Thousand Splendid Suns", "Khaled Hosseini", "Riverhead Books", "Fiction", true, "Good"),
            new Book("978-0-307-26543-6", "The Help", "Kathryn Stockett", "Amy Einhorn Books", "Historical Fiction", false, "Fair"),
            new Book("978-0-06-085052-4", "Beloved", "Toni Morrison", "Alfred A. Knopf", "Historical Fiction", true, "Excellent"),
            new Book("978-0-7432-7356-2", "The Curious Incident of the Dog in the Night-Time", "Mark Haddon", "Jonathan Cape", "Fiction", true, "Good"),
            new Book("978-0-375-50388-8", "Never Let Me Go", "Kazuo Ishiguro", "Faber & Faber", "Science Fiction", false, "Fair"),
            
            // Academic Textbooks
            new Book("978-0-321-55823-7", "Campbell Biology", "Jane Reece", "Pearson", "Biology", true, "Fair"),
            new Book("978-1-305-58512-6", "Principles of Economics", "N. Gregory Mankiw", "Cengage Learning", "Economics", true, "Good"),
            new Book("978-1-285-74155-0", "Calculus: Early Transcendentals", "James Stewart", "Cengage Learning", "Mathematics", false, "Fair"),
            new Book("978-1-133-94773-8", "Physics for Scientists and Engineers", "Raymond Serway", "Cengage Learning", "Physics", true, "Good"),
            new Book("978-0-321-80322-1", "Organic Chemistry", "Paula Bruice", "Pearson", "Chemistry", true, "Excellent"),
            new Book("978-0-13-467105-8", "Fundamentals of Statistics", "Mario Triola", "Pearson", "Statistics", false, "Good"),
            new Book("978-1-133-95590-0", "Psychology: The Science of Mind and Behaviour", "Michael Passer", "McGraw-Hill", "Psychology", true, "Fair"),
            new Book("978-0-073-40293-6", "Molecular Biology of the Cell", "Bruce Alberts", "Garland Science", "Biology", true, "Excellent"),
            new Book("978-0-321-73121-5", "Linear Algebra and Its Applications", "David Lay", "Pearson", "Mathematics", false, "Good"),
            new Book("978-0-13-467306-9", "Introduction to Programming Using Java", "Y. Daniel Liang", "Pearson", "Computer Science", true, "Fair"),
            
            // Final 5 books
            new Book("978-1-590-30218-2", "The Art of War", "Sun Tzu", "Oxford University Press", "Philosophy", true, "Good"),
            new Book("978-0-399-59050-4", "Educated", "Tara Westover", "Random House", "Memoir", false, "Excellent"),
            new Book("978-1-524-76313-8", "Becoming", "Michelle Obama", "Crown Publishing", "Biography", true, "Fair"),
            new Book("978-0-525-55947-1", "The Midnight Library", "Matt Haig", "Canongate Books", "Fiction", true, "Good"),
            new Book("978-0-593-31817-1", "Klara and the Sun", "Kazuo Ishiguro", "Faber & Faber", "Science Fiction", false, "Excellent")
        );

        // Set unique book IDs
        for (int i = 0; i < books.size(); i++) {
            books.get(i).setBookId(1000 + i);
        }

        bookRepository.saveAll(books);
        System.out.println("Successfully seeded " + books.size() + " books into the database!");
    }
}
