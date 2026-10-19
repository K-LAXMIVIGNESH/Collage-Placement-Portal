-- =========================================================
-- 1. creating table student
-- =========================================================

create table student(
student_id bigint primary key,
name varchar(40) not null,
gender varchar(10) check(gender in('Male','Female')) not null,
age int not null,
degree varchar(15) not null,
branch varchar(30) not null,
cgpa numeric(4,2) not null,
backlogs int not null,
internships int not null,
certifications int not null,
coding_skills int not null,
communication_skills int not null,
aptitude_score int not null,
projects int not null,
placement_status varchar(30) not null,
company_type varchar(30),
package_lpa numeric(6,2),
email varchar(100),
phone varchar(15),
password varchar(100),
city varchar(50),
state varchar(50)
);

select * from student;


-- =========================================================
-- 2. creating table company
-- =========================================================

create table company(
company_id bigint primary key,
company_name varchar(50) not null,
company_type varchar(50) not null,
industry varchar(50),
location varchar(50),
website varchar(100),
email varchar(100),
phone varchar(15)
);


-- inserting values into company

insert into company
(company_id, company_name, company_type, industry, location, website, email, phone)
values
(101, 'TCS', 'IT', 'Information Technology', 'Hyderabad',
'www.tcs.com', 'hr@tcs.com', '9876543210'),

(102, 'Infosys', 'IT', 'Information Technology', 'Bangalore',
'www.infosys.com', 'hr@infosys.com', '9876543211'),

(103, 'Deloitte', 'Consulting', 'Consulting', 'Hyderabad',
'www.deloitte.com', 'hr@deloitte.com', '9876543212'),

(104, 'Amazon', 'IT', 'E-Commerce', 'Bangalore',
'www.amazon.com', 'hr@amazon.com', '9876543213'),

(105, 'Wipro', 'IT', 'Information Technology', 'Chennai',
'www.wipro.com', 'hr@wipro.com', '9876543214');

select * from company;


-- =========================================================
-- 3. creating table placement_officer
-- =========================================================

create table placement_officer(
officer_id bigint primary key,
officer_name varchar(100) not null,
email varchar(100) not null,
phone varchar(15),
password varchar(100) not null
);


-- inserting values into placement_officer

insert into placement_officer
(officer_id, officer_name, email, phone, password)
values
(801, 'anita reddy', 'anita@college.com', '9876600001', 'officer@123'),

(802, 'ravi kumar', 'ravi@college.com', '9876600002', 'officer@456'),

(803, 'vignesh',
'laxmivigneshkonkimalla@gmail.com',
'9490517699',
'Vignesh@1106');

select * from placement_officer;


-- =========================================================
-- 4. creating table placement_drive
-- company 1 : M placement_drive
-- =========================================================

create table placement_drive(
drive_id bigint primary key,
company_id bigint not null,
job_role varchar(50) not null,
package_lpa numeric(6,2) not null,
vacancies int not null,
drive_date date not null,
last_date_to_apply date not null,
foreign key(company_id) references company(company_id)
);


-- inserting values into placement_drive

insert into placement_drive
(drive_id, company_id, job_role, package_lpa, vacancies,
drive_date, last_date_to_apply)
values

(1001, 101, 'Software Developer', 7.50, 50,
'2025-09-15', '2025-09-10'),

(1002, 102, 'System Engineer', 6.50, 40,
'2025-09-20', '2025-09-15'),

(1003, 103, 'Business Analyst', 8.00, 30,
'2025-09-25', '2025-09-20'),

(1004, 104, 'Software Development Engineer', 12.00, 25,
'2025-10-05', '2025-09-30'),

(1005, 105, 'Project Engineer', 6.00, 60,
'2025-10-10', '2025-10-05');

select * from placement_drive;


-- =========================================================
-- 5. creating table eligibility
-- placement_drive 1 : 1 eligibility
-- =========================================================

create table eligibility(
eligibility_id bigint primary key,
drive_id bigint not null unique,
minimum_cgpa numeric(4,2) not null,
maximum_backlogs int not null,
foreign key(drive_id) references placement_drive(drive_id)
);


-- inserting values into eligibility

insert into eligibility
(eligibility_id, drive_id, minimum_cgpa, maximum_backlogs)
values

(201, 1001, 7.00, 0),
(202, 1002, 6.50, 1),
(203, 1003, 7.50, 0),
(204, 1004, 8.00, 0),
(205, 1005, 6.00, 2);

select * from eligibility;


-- testing placement drive and eligibility relationship

select
placement_drive.drive_id,
company.company_name,
placement_drive.job_role,
eligibility.minimum_cgpa,
eligibility.maximum_backlogs
from placement_drive
join company
on placement_drive.company_id = company.company_id
join eligibility
on placement_drive.drive_id = eligibility.drive_id;


-- =========================================================
-- 6. creating table eligibility_allowed_branch
-- multivalued attribute allowed_branch
-- =========================================================

create table eligibility_allowed_branch(
eligibility_id bigint not null,
allowed_branch varchar(30) not null,
primary key(eligibility_id, allowed_branch),
foreign key(eligibility_id)
references eligibility(eligibility_id)
);


-- inserting values into eligibility_allowed_branch

insert into eligibility_allowed_branch
(eligibility_id, allowed_branch)
values

(201, 'CSE'),
(201, 'IT'),

(202, 'CSE'),
(202, 'IT'),
(202, 'ECE'),

(203, 'CSE'),
(203, 'IT'),
(203, 'EEE'),

(204, 'CSE'),
(204, 'IT'),

(205, 'CSE'),
(205, 'IT'),
(205, 'ECE'),
(205, 'EEE');

select * from eligibility_allowed_branch;


-- =========================================================
-- 7. creating table hr
-- company 1 : M hr
-- =========================================================

create table hr(
hr_id bigint primary key,
company_id bigint not null,
hr_name varchar(100) not null,
email varchar(100) not null,
phone varchar(15),
foreign key(company_id) references company(company_id)
);


-- inserting values into hr

insert into hr
(hr_id, company_id, hr_name, email, phone)
values

(301, 101, 'rahul sharma',
'rahul.hr@tcs.com', '9876500001'),

(302, 102, 'priya reddy',
'priya.hr@infosys.com', '9876500002'),

(303, 103, 'arjun kumar',
'arjun.hr@deloitte.com', '9876500003'),

(304, 104, 'sneha rao',
'sneha.hr@amazon.com', '9876500004'),

(305, 105, 'kiran patel',
'kiran.hr@wipro.com', '9876500005');

select * from hr;


-- company and hr relationship

select
hr.hr_id,
hr.hr_name,
company.company_name,
hr.email
from hr
join company
on hr.company_id = company.company_id;


-- =========================================================
-- 8. creating table applies
-- M : N relationship
-- student M : N placement_drive
-- =========================================================

create table applies(
student_id bigint not null,
drive_id bigint not null,
primary key(student_id, drive_id),
foreign key(student_id) references student(student_id),
foreign key(drive_id) references placement_drive(drive_id)
);


-- inserting values into applies

insert into applies
(student_id, drive_id)
values

(1, 1001),
(2, 1001),
(3, 1002),
(4, 1003),
(5, 1004);

select * from applies;


-- =========================================================
-- 9. creating table application
-- placement_officer 1 : M application
-- student 1 : M application
-- placement_drive 1 : M application
-- =========================================================

create table application(
application_id bigint primary key,
student_id bigint not null,
drive_id bigint not null,
officer_id bigint not null,
application_date date not null,
application_status varchar(30) not null,

foreign key(student_id)
references student(student_id),

foreign key(drive_id)
references placement_drive(drive_id),

foreign key(officer_id)
references placement_officer(officer_id)
);


-- inserting values into application

insert into application
(application_id, student_id, drive_id, officer_id,
application_date, application_status)
values

(5001, 1, 1001, 801,
'2025-09-01', 'Applied'),

(5002, 2, 1001, 801,
'2025-09-02', 'Eligible'),

(5003, 3, 1002, 802,
'2025-09-03', 'Applied'),

(5004, 4, 1003, 803,
'2025-09-04', 'Shortlisted'),

(5005, 5, 1004, 803,
'2025-09-05', 'Interview Scheduled');

select * from application;


-- testing application relationship

select
application.application_id,
student.name,
company.company_name,
placement_drive.job_role,
placement_officer.officer_name,
application.application_date,
application.application_status
from application

join student
on application.student_id = student.student_id

join placement_drive
on application.drive_id = placement_drive.drive_id

join company
on placement_drive.company_id = company.company_id

join placement_officer
on application.officer_id = placement_officer.officer_id;


-- =========================================================
-- 10. creating table interview
-- application 1 : M interview
-- =========================================================

create table interview(
interview_id bigint primary key,
application_id bigint not null,
interview_round varchar(50) not null,
interview_date date not null,
result varchar(30) not null,
remarks varchar(200),

foreign key(application_id)
references application(application_id)
);


-- inserting values into interview

insert into interview
(interview_id, application_id, interview_round,
interview_date, result, remarks)
values

(6001, 5004, 'technical',
'2025-09-10', 'selected',
'good technical knowledge'),

(6002, 5005, 'technical',
'2025-09-12', 'selected',
'strong coding skills'),

(6003, 5005, 'managerial',
'2025-09-15', 'selected',
'good communication'),

(6004, 5005, 'hr',
'2025-09-18', 'selected',
'good overall performance'),

(6005, 5003, 'technical',
'2025-09-14', 'rejected',
'technical skills need improvement');

select * from interview;


-- testing interview relationship

select
interview.interview_id,
student.name,
company.company_name,
placement_drive.job_role,
interview.interview_round,
interview.interview_date,
interview.result,
interview.remarks

from interview

join application
on interview.application_id = application.application_id

join student
on application.student_id = student.student_id

join placement_drive
on application.drive_id = placement_drive.drive_id

join company
on placement_drive.company_id = company.company_id;


-- =========================================================
-- 11. creating table offer
-- student 1 : M offer
-- company 1 : M offer
-- =========================================================

create table offer(
offer_id bigint primary key,
student_id bigint not null,
company_id bigint not null,
offer_date date not null,
package_lpa numeric(6,2) not null,
offer_status varchar(30) not null,

foreign key(student_id)
references student(student_id),

foreign key(company_id)
references company(company_id)
);


-- inserting values into offer

insert into offer
(offer_id, student_id, company_id,
offer_date, package_lpa, offer_status)
values

(7001, 4, 103,
'2025-09-20', 8.00, 'accepted'),

(7002, 5, 104,
'2025-09-25', 12.00, 'pending');

select * from offer;


-- testing offer relationship

select
offer.offer_id,
student.name,
company.company_name,
offer.offer_date,
offer.package_lpa,
offer.offer_status

from offer

join student
on offer.student_id = student.student_id

join company
on offer.company_id = company.company_id;


-- add on delete cascade to eligibility_allowed_branch

alter table eligibility_allowed_branch
drop constraint eligibility_allowed_branch_eligibility_id_fkey;

alter table eligibility_allowed_branch
add constraint eligibility_allowed_branch_eligibility_id_fkey
foreign key (eligibility_id)
references eligibility(eligibility_id)
on delete cascade;


select sum(package_lpa) as total_package_lpa
from placement_drive;


select
    c.company_name,
    avg(pd.package_lpa) as average_package
from company c
join placement_drive pd
    on c.company_id = pd.company_id
group by c.company_id, c.company_name;


select
    application_status,
    count(*) as total_applications
from application
group by application_status;


select
    max(package_lpa) as highest_package,
    min(package_lpa) as lowest_package
from placement_drive;



select
    c.company_name,
    count(pd.drive_id) as total_drives
from company c
join placement_drive pd
    on c.company_id = pd.company_id
group by c.company_id, c.company_name
having count(pd.drive_id) > 1;