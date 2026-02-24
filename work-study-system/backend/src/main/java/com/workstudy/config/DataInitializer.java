package com.workstudy.config;

import com.workstudy.entity.*;
import com.workstudy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final WorkHoursRepository workHoursRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // ── Users ──────────────────────────────────────────────
        User admin = createUser("admin", "admin123", "admin@workstudy.edu",
                "System Administrator", User.Role.ADMIN, "Administration", "9876543210");

        User student1 = createUser("student", "student123", "student@workstudy.edu",
                "Test Student", User.Role.STUDENT, "Computer Science", "9876543211");

        User student2 = createUser("rahul", "rahul123", "rahul@workstudy.edu",
                "Rahul Sharma", User.Role.STUDENT, "Electronics Engineering", "9876543212");

        User student3 = createUser("priya", "priya123", "priya@workstudy.edu",
                "Priya Patel", User.Role.STUDENT, "Mathematics", "9876543213");

        User student4 = createUser("amit", "amit123", "amit@workstudy.edu",
                "Amit Kumar", User.Role.STUDENT, "Physics", "9876543214");

        // ── Job Postings ───────────────────────────────────────
        JobPosting job1 = createJob("Library Assistant",
                "Assist librarians with book shelving, cataloging, and helping students find resources. Must be organized and detail-oriented.",
                "Central Library", "Main Library Building", new BigDecimal("12.50"), 15, 3, LocalDate.now().plusDays(30), admin);

        JobPosting job2 = createJob("Computer Lab Tutor",
                "Help students with programming assignments in Java, Python, and C++. Conduct walk-in tutoring sessions during lab hours.",
                "Computer Science", "CS Building Room 204", new BigDecimal("15.00"), 20, 2, LocalDate.now().plusDays(25), admin);

        JobPosting job3 = createJob("IT Help Desk Support",
                "Provide first-level technical support for students and faculty. Troubleshoot Wi-Fi, email, and software issues.",
                "Information Technology", "IT Service Center", new BigDecimal("14.00"), 15, 4, LocalDate.now().plusDays(20), admin);

        JobPosting job4 = createJob("Research Assistant – Physics",
                "Assist faculty with ongoing physics experiments. Data collection, lab equipment maintenance, and preliminary analysis.",
                "Physics", "Physics Lab 101", new BigDecimal("16.00"), 10, 1, LocalDate.now().plusDays(15), admin);

        JobPosting job5 = createJob("Campus Tour Guide",
                "Lead prospective students and families on campus tours. Must have excellent communication skills and campus knowledge.",
                "Admissions", "Admissions Office", new BigDecimal("13.00"), 10, 5, LocalDate.now().plusDays(35), admin);

        JobPosting job6 = createJob("Administrative Assistant",
                "Assist department office with filing, data entry, scheduling, and front-desk reception. Proficiency in MS Office required.",
                "Administration", "Admin Building Room 110", new BigDecimal("13.50"), 20, 2, LocalDate.now().plusDays(28), admin);

        // ── Applications ───────────────────────────────────────
        // student1 (Test Student)
        Application app1 = createApplication(student1, job1, "I love reading and organizing. I have worked in my school library for 2 years.", Application.Status.APPROVED, admin, "Great candidate, approved.");
        Application app2 = createApplication(student1, job2, "I am proficient in Java and Python and enjoy teaching others.", Application.Status.PENDING, null, null);

        // student2 (Rahul)
        Application app3 = createApplication(student2, job2, "Experienced in Java, Python, and C. I tutored peers during my first year.", Application.Status.APPROVED, admin, "Strong technical skills.");
        Application app4 = createApplication(student2, job3, "I have troubleshot hardware and software issues for friends and family for years.", Application.Status.PENDING, null, null);

        // student3 (Priya)
        Application app5 = createApplication(student3, job4, "I'm a math major with a keen interest in physics research. I scored well in experimental physics.", Application.Status.APPROVED, admin, "Good fit for the role.");
        Application app6 = createApplication(student3, job5, "I know the campus well and enjoy interacting with new people!", Application.Status.REJECTED, admin, "Position filled.");

        // student4 (Amit)
        Application app7 = createApplication(student4, job5, "I am enthusiastic, personable, and have been on campus for 3 years.", Application.Status.APPROVED, admin, "Excellent communication skills.");
        Application app8 = createApplication(student4, job6, "I am proficient in Excel with strong organizational skills.", Application.Status.PENDING, null, null);

        // ── Work Hours (for approved applications) ─────────────
        createWorkHours(student1, job1, LocalDate.now().minusDays(7), LocalTime.of(9, 0), LocalTime.of(12, 0), new BigDecimal("3.0"), "Shelved returned books and organized periodical section.", WorkHours.Status.APPROVED, admin, "Good work.");
        createWorkHours(student1, job1, LocalDate.now().minusDays(5), LocalTime.of(13, 0), LocalTime.of(16, 30), new BigDecimal("3.5"), "Updated catalog entries and helped students with research queries.", WorkHours.Status.APPROVED, admin, "Excellent service.");
        createWorkHours(student1, job1, LocalDate.now().minusDays(2), LocalTime.of(10, 0), LocalTime.of(14, 0), new BigDecimal("4.0"), "Managed front desk and processed new book arrivals.", WorkHours.Status.PENDING, null, null);

        createWorkHours(student2, job2, LocalDate.now().minusDays(6), LocalTime.of(14, 0), LocalTime.of(17, 0), new BigDecimal("3.0"), "Tutored 5 students on Java data structures.", WorkHours.Status.APPROVED, admin, "Students gave positive feedback.");
        createWorkHours(student2, job2, LocalDate.now().minusDays(3), LocalTime.of(10, 0), LocalTime.of(13, 0), new BigDecimal("3.0"), "Helped students debug Python assignments.", WorkHours.Status.APPROVED, admin, null);
        createWorkHours(student2, job2, LocalDate.now().minusDays(1), LocalTime.of(15, 0), LocalTime.of(18, 0), new BigDecimal("3.0"), "Conducted walk-in tutoring session on C++ pointers.", WorkHours.Status.PENDING, null, null);

        createWorkHours(student3, job4, LocalDate.now().minusDays(4), LocalTime.of(9, 0), LocalTime.of(12, 0), new BigDecimal("3.0"), "Collected data from pendulum experiment.", WorkHours.Status.APPROVED, admin, "Accurate data collection.");
        createWorkHours(student3, job4, LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(11, 30), new BigDecimal("2.5"), "Calibrated lab spectrophotometers.", WorkHours.Status.PENDING, null, null);

        createWorkHours(student4, job5, LocalDate.now().minusDays(5), LocalTime.of(10, 0), LocalTime.of(12, 0), new BigDecimal("2.0"), "Led a campus tour for 15 prospective students.", WorkHours.Status.APPROVED, admin, "Very engaging tour.");
        createWorkHours(student4, job5, LocalDate.now().minusDays(2), LocalTime.of(14, 0), LocalTime.of(16, 0), new BigDecimal("2.0"), "Led afternoon tour group and answered parent questions.", WorkHours.Status.APPROVED, admin, null);

        // ── Feedback ───────────────────────────────────────────
        createFeedback(student1, job1, admin, 5, "Outstanding dedication and reliability. Always punctual and takes initiative.", "Organization, Customer Service, Reliability");
        createFeedback(student2, job2, admin, 4, "Strong technical knowledge. Students benefit a lot from tutoring sessions.", "Technical Skills, Communication, Patience");
        createFeedback(student3, job4, admin, 4, "Meticulous and careful with equipment. Good at following research protocols.", "Attention to Detail, Lab Safety, Data Analysis");
        createFeedback(student4, job5, admin, 5, "Exceptional communication skills. Prospective students love the tours.", "Public Speaking, Enthusiasm, Campus Knowledge");
    }

    // ── Helper methods ─────────────────────────────────────────

    private User createUser(String username, String password, String email, String fullName, User.Role role, String department, String phone) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFullName(fullName);
        user.setRole(role);
        user.setDepartment(department);
        user.setPhone(phone);
        user.setActive(true);
        return userRepository.save(user);
    }

    private JobPosting createJob(String title, String description, String department, String location, BigDecimal hourlyRate, int maxHours, int totalPositions, LocalDate deadline, User postedBy) {
        JobPosting job = new JobPosting();
        job.setTitle(title);
        job.setDescription(description);
        job.setDepartment(department);
        job.setLocation(location);
        job.setHourlyRate(hourlyRate);
        job.setMaxHoursPerWeek(maxHours);
        job.setTotalPositions(totalPositions);
        job.setFilledPositions(0);
        job.setApplicationDeadline(deadline);
        job.setStatus(JobPosting.Status.ACTIVE);
        job.setPostedBy(postedBy);
        return jobPostingRepository.save(job);
    }

    private Application createApplication(User student, JobPosting job, String coverLetter, Application.Status status, User reviewedBy, String adminNotes) {
        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setCoverLetter(coverLetter);
        app.setStatus(status);
        app.setAdminNotes(adminNotes);
        if (reviewedBy != null) {
            app.setReviewedBy(reviewedBy);
        }
        return applicationRepository.save(app);
    }

    private void createWorkHours(User student, JobPosting job, LocalDate date, LocalTime start, LocalTime end, BigDecimal hours, String description, WorkHours.Status status, User approvedBy, String notes) {
        WorkHours wh = new WorkHours();
        wh.setStudent(student);
        wh.setJob(job);
        wh.setWorkDate(date);
        wh.setStartTime(start);
        wh.setEndTime(end);
        wh.setHoursWorked(hours);
        wh.setDescription(description);
        wh.setStatus(status);
        if (approvedBy != null) {
            wh.setApprovedBy(approvedBy);
        }
        wh.setSupervisorNotes(notes);
        workHoursRepository.save(wh);
    }

    private void createFeedback(User student, JobPosting job, User givenBy, int rating, String comments, String performanceAreas) {
        Feedback fb = new Feedback();
        fb.setStudent(student);
        fb.setJob(job);
        fb.setGivenBy(givenBy);
        fb.setRating(rating);
        fb.setComments(comments);
        fb.setPerformanceAreas(performanceAreas);
        feedbackRepository.save(fb);
    }
}
