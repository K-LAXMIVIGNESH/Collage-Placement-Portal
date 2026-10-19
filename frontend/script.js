let current_role = '';
let current_student = null;


/* =====================================================
   login
===================================================== */

function select_role(role) {
    current_role = role;

    const student_login = document.getElementById('student-login');
    const admin_login_box = document.getElementById('admin-login');
    const buttons = document.querySelectorAll('.role-button');

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    if (role === 'student') {
        student_login.classList.remove('hidden');
        admin_login_box.classList.add('hidden');

        if (buttons[0]) {
            buttons[0].classList.add('active');
        }

        /*
         * Make sure no admin password field exists
         * while student login is being used.
         */
        const password_container = document.getElementById(
            'admin-password-container'
        );

        if (password_container) {
            password_container.innerHTML = '';
        }
    } else {
        student_login.classList.add('hidden');
        admin_login_box.classList.remove('hidden');

        if (buttons[1]) {
            buttons[1].classList.add('active');
        }

        create_admin_password_field();
    }
}


/* =====================================================
   admin password
===================================================== */

function create_admin_password_field() {
    const container = document.getElementById(
        'admin-password-container'
    );

    if (!container) {
        return;
    }

    if (document.getElementById('admin-password')) {
        return;
    }

    container.innerHTML = `
        <input
            type="password"
            id="admin-password"
            name="admin_secret"
            autocomplete="new-password"
            placeholder="enter password"
        >
    `;
}


/* =====================================================
   student login
===================================================== */

async function student_login() {
    const student_id_element =
        document.getElementById('student-id');

    const message =
        document.getElementById('login-message');

    if (!student_id_element) {
        return;
    }

    const student_id =
        student_id_element.value.trim();

    if (!student_id) {
        message.textContent =
            'please enter student id';
        return;
    }

    try {
        const response = await fetch(
            `/api/students/${encodeURIComponent(student_id)}`
        );

        if (!response.ok) {
            message.textContent =
                'student not found';
            return;
        }

        current_student =
            await response.json();

        document.getElementById('login-page')
            ?.classList.add('hidden');

        document.getElementById('student-dashboard')
            ?.classList.remove('hidden');

        const welcome =
            document.getElementById('student-welcome');

        if (welcome) {
            welcome.textContent =
                `welcome, ${current_student.name}`;
        }

        const student_name =
            document.getElementById('student-name');

        if (student_name) {
            student_name.textContent =
                current_student.name;
        }

        load_student_dashboard();

    } catch (error) {
        console.error(error);

        message.textContent =
            'unable to connect to server';
    }
}


/* =====================================================
   admin login
===================================================== */

async function admin_login() {
    const email_element =
        document.getElementById('admin-email');

    const password_element =
        document.getElementById('admin-password');

    const message =
        document.getElementById('login-message');

    const email =
        email_element
            ? email_element.value.trim()
            : '';

    const password =
        password_element
            ? password_element.value
            : '';

    if (!email || !password) {
        message.textContent =
            'please enter email and password';
        return;
    }

    try {
        const response =
            await fetch('/api/placement-officers');

        if (!response.ok) {
            message.textContent =
                'unable to fetch admin details';
            return;
        }

        const officers =
            await response.json();

        const officer =
            officers.find(item =>
                String(item.email).toLowerCase() ===
                    email.toLowerCase() &&
                String(item.password) ===
                    String(password)
            );

        if (!officer) {
            message.textContent =
                'invalid admin email or password';
            return;
        }

        document.getElementById('login-page')
            ?.classList.add('hidden');

        document.getElementById('admin-dashboard')
            ?.classList.remove('hidden');

        const welcome =
            document.getElementById('admin-welcome');

        if (welcome) {
            welcome.textContent =
                `welcome, ${officer.officer_name}`;
        }

        load_admin_dashboard();

    } catch (error) {
        console.error(error);

        message.textContent =
            'unable to connect to server';
    }
}


/* =====================================================
   student dashboard
===================================================== */

async function load_student_dashboard() {
    await load_student_profile();
    await load_student_drives();
    await load_student_applications();
    await load_student_interviews();
    await load_student_offers();
}


/* =====================================================
   student profile
===================================================== */

async function load_student_profile() {
    const container =
        document.getElementById(
            'student-profile-data'
        );

    if (!container || !current_student) {
        return;
    }

    container.innerHTML = `
        <div class="profile-grid">

            <div class="profile-item">
                <strong>student id</strong>
                <span>${placex_escape(current_student.student_id)}</span>
            </div>

            <div class="profile-item">
                <strong>name</strong>
                <span>${placex_escape(current_student.name)}</span>
            </div>

            <div class="profile-item">
                <strong>gender</strong>
                <span>${placex_escape(current_student.gender)}</span>
            </div>

            <div class="profile-item">
                <strong>age</strong>
                <span>${placex_escape(current_student.age)}</span>
            </div>

            <div class="profile-item">
                <strong>degree</strong>
                <span>${placex_escape(current_student.degree)}</span>
            </div>

            <div class="profile-item">
                <strong>branch</strong>
                <span>${placex_escape(current_student.branch)}</span>
            </div>

            <div class="profile-item">
                <strong>cgpa</strong>
                <span>${placex_escape(current_student.cgpa)}</span>
            </div>

            <div class="profile-item">
                <strong>backlogs</strong>
                <span>${placex_escape(current_student.backlogs)}</span>
            </div>

            <div class="profile-item">
                <strong>internships</strong>
                <span>${placex_escape(current_student.internships)}</span>
            </div>

            <div class="profile-item">
                <strong>certifications</strong>
                <span>${placex_escape(current_student.certifications)}</span>
            </div>

            <div class="profile-item">
                <strong>coding skills</strong>
                <span>${placex_escape(current_student.coding_skills)}</span>
            </div>

            <div class="profile-item">
                <strong>communication skills</strong>
                <span>${placex_escape(current_student.communication_skills)}</span>
            </div>

            <div class="profile-item">
                <strong>aptitude score</strong>
                <span>${placex_escape(current_student.aptitude_score)}</span>
            </div>

            <div class="profile-item">
                <strong>projects</strong>
                <span>${placex_escape(current_student.projects)}</span>
            </div>

            <div class="profile-item">
                <strong>placement status</strong>
                <span>${placex_escape(current_student.placement_status)}</span>
            </div>

            <div class="profile-item">
                <strong>company type</strong>
                <span>${placex_escape(current_student.company_type || 'N/A')}</span>
            </div>

            <div class="profile-item">
                <strong>package lpa</strong>
                <span>${placex_escape(current_student.package_lpa)}</span>
            </div>

            <div class="profile-item">
                <strong>email</strong>
                <span>${placex_escape(current_student.email || 'N/A')}</span>
            </div>

            <div class="profile-item">
                <strong>mobile number</strong>
                <span>${placex_escape(current_student.phone || 'N/A')}</span>
            </div>

            <div class="profile-item">
                <strong>city</strong>
                <span>${placex_escape(current_student.city || 'N/A')}</span>
            </div>

            <div class="profile-item">
                <strong>state</strong>
                <span>${placex_escape(current_student.state || 'N/A')}</span>
            </div>

        </div>
    `;
}


/* =====================================================
   student placement drives
===================================================== */

async function load_student_drives() {
    const container =
        document.getElementById(
            'student-drives-data'
        );

    const dashboard_container =
        document.getElementById(
            'student-drive-list'
        );

    try {
        const response =
            await fetch('/api/drives');

        if (!response.ok) {
            throw new Error(
                'failed to fetch placement drives'
            );
        }

        const drives =
            await response.json();

        const count =
            document.getElementById(
                'student-drive-count'
            );

        if (count) {
            count.textContent =
                drives.length;
        }

        if (container) {
            if (drives.length === 0) {
                container.innerHTML =
                    '<p>no placement drives available</p>';
            } else {
                container.innerHTML =
                    drives.map(drive => `
                        <div class="drive-card">

                            <h4>
                                ${placex_escape(
                                    drive.company_name
                                )}
                            </h4>

                            <p>
                                <strong>job role:</strong>
                                ${placex_escape(
                                    drive.job_role
                                )}
                            </p>

                            <p>
                                <strong>package:</strong>
                                ${placex_escape(
                                    drive.package_lpa
                                )} lpa
                            </p>

                            <p>
                                <strong>vacancies:</strong>
                                ${placex_escape(
                                    drive.vacancies
                                )}
                            </p>

                            <p>
                                <strong>drive date:</strong>
                                ${placex_escape(
                                    drive.drive_date
                                )}
                            </p>

                            <p>
                                <strong>last date:</strong>
                                ${placex_escape(
                                    drive.last_date_to_apply
                                )}
                            </p>

                            <button
                                class="apply-button"
                                onclick="apply_for_drive(${Number(
                                    drive.drive_id
                                )})">
                                apply
                            </button>

                        </div>
                    `).join('');
            }
        }

        if (container) {
            const searchInput = document.getElementById('student-drives-search');
            const searchButton = document.getElementById('student-drives-search-button');
            const packageFilter = document.getElementById('student-drives-package-filter');
            const clearButton = document.getElementById('student-drives-clear-button');
            if (packageFilter && !packageFilter.dataset.populated) {
                [...new Set(drives.map(d => String(d.package_lpa ?? '').trim()).filter(Boolean))]
                    .sort((a, b) => Number(a) - Number(b)).forEach(value => {
                        const option = document.createElement('option'); option.value = value; option.textContent = `${value} LPA`; packageFilter.appendChild(option);
                    });
                packageFilter.dataset.populated = 'true';
            }
            const renderDrives = () => {
                const term = String(searchInput?.value ?? '').trim().toLowerCase();
                const selectedPackage = String(packageFilter?.value ?? '');
                const filtered = drives.filter(d => {
                    const searchable = [d.drive_id, d.company_name, d.job_role, d.package_lpa, d.vacancies, d.drive_date, d.last_date_to_apply].join(' ').toLowerCase();
                    return (!term || searchable.includes(term)) && (!selectedPackage || String(d.package_lpa ?? '') === selectedPackage);
                });
                container.innerHTML = filtered.length ? filtered.map(drive => `
                    <div class="drive-card"><h4>${placex_escape(drive.company_name)}</h4>
                    <p><strong>job role:</strong> ${placex_escape(drive.job_role)}</p>
                    <p><strong>package:</strong> ${placex_escape(drive.package_lpa)} lpa</p>
                    <p><strong>vacancies:</strong> ${placex_escape(drive.vacancies)}</p>
                    <p><strong>drive date:</strong> ${placex_escape(drive.drive_date)}</p>
                    <p><strong>last date:</strong> ${placex_escape(drive.last_date_to_apply)}</p>
                    <button class="apply-button" onclick="apply_for_drive(${Number(drive.drive_id)})">apply</button></div>`).join('') : '<p class="student-applications-empty">No placement drives match your search or filter.</p>';
            };
            if (searchButton && !searchButton.dataset.bound) { searchButton.addEventListener('click', renderDrives); searchButton.dataset.bound = 'true'; }
            if (searchInput && !searchInput.dataset.bound) { searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') renderDrives(); }); searchInput.dataset.bound = 'true'; }
            if (packageFilter && !packageFilter.dataset.bound) { packageFilter.addEventListener('change', renderDrives); packageFilter.dataset.bound = 'true'; }
            if (clearButton && !clearButton.dataset.bound) { clearButton.addEventListener('click', () => { if (searchInput) searchInput.value = ''; if (packageFilter) packageFilter.value = ''; renderDrives(); }); clearButton.dataset.bound = 'true'; }
            renderDrives();
        }

        if (dashboard_container) {
            dashboard_container.innerHTML =
                drives.slice(0, 3).map(drive => `
                    <div class="drive-card">

                        <h4>
                            ${placex_escape(
                                drive.company_name
                            )}
                        </h4>

                        <p>
                            ${placex_escape(
                                drive.job_role
                            )}
                        </p>

                        <p>
                            ${placex_escape(
                                drive.package_lpa
                            )} lpa
                        </p>

                    </div>
                `).join('');
        }

    } catch (error) {
        console.error(error);

        if (container) {
            container.innerHTML =
                '<p>failed to load placement drives</p>';
        }
    }
}


/* =====================================================
   student applications
===================================================== */

async function load_student_applications() {
    const container = document.getElementById('student-applications-data');

    if (!current_student) return;

    try {
        const response = await fetch(
            `/api/applications/student/${encodeURIComponent(current_student.student_id)}`
        );
        if (!response.ok) throw new Error('failed to fetch applications');

        const applications = await response.json();
        const count = document.getElementById('student-application-count');
        if (count) count.textContent = applications.length;
        if (!container) return;

        if (applications.length === 0) {
            container.innerHTML = '<p>no applications found</p>';
            return;
        }

        // Keep the original application rows and add search/status filtering only here.
        const searchInput = document.getElementById('student-applications-search');
        const searchButton = document.getElementById('student-applications-search-button');
        const statusFilter = document.getElementById('student-applications-status-filter');
        const clearButton = document.getElementById('student-applications-clear-button');
        const columns = ['application_id', 'company_name', 'job_role', 'application_date', 'application_status'];

        if (statusFilter && !statusFilter.dataset.populated) {
            const statuses = [...new Set(applications.map(row => String(row.application_status ?? '').trim()).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b));
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                statusFilter.appendChild(option);
            });
            statusFilter.dataset.populated = 'true';
        }

        const renderApplications = () => {
            const term = String(searchInput?.value ?? '').trim().toLowerCase();
            const selectedStatus = String(statusFilter?.value ?? '').toLowerCase();
            const filtered = applications.filter(row => {
                const matchesSearch = !term || columns.some(column =>
                    String(row[column] ?? '').toLowerCase().includes(term)
                );
                const matchesStatus = !selectedStatus ||
                    String(row.application_status ?? '').toLowerCase() === selectedStatus;
                return matchesSearch && matchesStatus;
            });
            container.innerHTML = filtered.length
                ? create_table(filtered, columns)
                : '<p class="student-applications-empty">No applications match your search or filter.</p>';
        };

        if (searchButton && !searchButton.dataset.bound) {
            searchButton.addEventListener('click', renderApplications);
            searchButton.dataset.bound = 'true';
        }
        if (searchInput && !searchInput.dataset.bound) {
            searchInput.addEventListener('keydown', event => {
                if (event.key === 'Enter') renderApplications();
            });
            searchInput.dataset.bound = 'true';
        }
        if (statusFilter && !statusFilter.dataset.bound) {
            statusFilter.addEventListener('change', renderApplications);
            statusFilter.dataset.bound = 'true';
        }
        if (clearButton && !clearButton.dataset.bound) {
            clearButton.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (statusFilter) statusFilter.value = '';
                renderApplications();
            });
            clearButton.dataset.bound = 'true';
        }
        renderApplications();
    } catch (error) {
        console.error(error);
        if (container) container.innerHTML = '<p>failed to load applications</p>';
    }
}


/* =====================================================
   student interviews
===================================================== */

async function load_student_interviews() {
    const container =
        document.getElementById(
            'student-interviews-data'
        );

    if (!current_student) {
        return;
    }

    try {
        const response =
            await fetch('/api/interviews');

        if (!response.ok) {
            throw new Error(
                'failed to fetch interviews'
            );
        }

        const interviews =
            await response.json();

        /*
         * PostgreSQL bigint values can arrive as numbers
         * or strings depending on the API.
         *
         * Convert both sides to String before comparing.
         */
        const student_interviews =
            interviews.filter(interview =>
                String(interview.student_id) ===
                String(current_student.student_id)
            );

        const count =
            document.getElementById(
                'student-interview-count'
            );

        if (count) {
            count.textContent =
                student_interviews.length;
        }

        if (!container) {
            return;
        }

        if (student_interviews.length === 0) {
            container.innerHTML =
                '<p>no interviews found</p>';
            return;
        }

        const columns = ['interview_id', 'company_name', 'job_role', 'interview_round', 'interview_date', 'result'];
        const searchInput = document.getElementById('student-interviews-search');
        const searchButton = document.getElementById('student-interviews-search-button');
        const resultFilter = document.getElementById('student-interviews-result-filter');
        const clearButton = document.getElementById('student-interviews-clear-button');
        if (resultFilter && !resultFilter.dataset.populated) {
            [...new Set(student_interviews.map(r => String(r.result ?? '').trim()).filter(Boolean))].sort().forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; resultFilter.appendChild(option); });
            resultFilter.dataset.populated = 'true';
        }
        const renderInterviews = () => {
            const term = String(searchInput?.value ?? '').trim().toLowerCase();
            const selected = String(resultFilter?.value ?? '').toLowerCase();
            const filtered = student_interviews.filter(row => (!term || columns.some(col => String(row[col] ?? '').toLowerCase().includes(term))) && (!selected || String(row.result ?? '').toLowerCase() === selected));
            container.innerHTML = filtered.length ? create_table(filtered, columns) : '<p class="student-applications-empty">No interviews match your search or filter.</p>';
        };
        if (searchButton && !searchButton.dataset.bound) { searchButton.addEventListener('click', renderInterviews); searchButton.dataset.bound = 'true'; }
        if (searchInput && !searchInput.dataset.bound) { searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') renderInterviews(); }); searchInput.dataset.bound = 'true'; }
        if (resultFilter && !resultFilter.dataset.bound) { resultFilter.addEventListener('change', renderInterviews); resultFilter.dataset.bound = 'true'; }
        if (clearButton && !clearButton.dataset.bound) { clearButton.addEventListener('click', () => { if (searchInput) searchInput.value = ''; if (resultFilter) resultFilter.value = ''; renderInterviews(); }); clearButton.dataset.bound = 'true'; }
        renderInterviews();

    } catch (error) {
        console.error(error);

        if (container) {
            container.innerHTML =
                '<p>failed to load interviews</p>';
        }
    }
}


/* =====================================================
   student offers
===================================================== */

async function load_student_offers() {
    const container =
        document.getElementById(
            'student-offers-data'
        );

    if (!current_student) {
        return;
    }

    try {
        const response =
            await fetch('/api/offers');

        if (!response.ok) {
            throw new Error(
                'failed to fetch offers'
            );
        }

        const offers =
            await response.json();

        const student_offers =
            offers.filter(offer =>
                String(offer.student_id) ===
                String(current_student.student_id)
            );

        const count =
            document.getElementById(
                'student-offer-count'
            );

        if (count) {
            count.textContent =
                student_offers.length;
        }

        if (!container) {
            return;
        }

        if (student_offers.length === 0) {
            container.innerHTML =
                '<p>no offers found</p>';
            return;
        }

        const columns = ['offer_id', 'company_name', 'offer_date', 'package_lpa', 'offer_status'];
        const searchInput = document.getElementById('student-offers-search');
        const searchButton = document.getElementById('student-offers-search-button');
        const statusFilter = document.getElementById('student-offers-status-filter');
        const clearButton = document.getElementById('student-offers-clear-button');
        if (statusFilter && !statusFilter.dataset.populated) {
            [...new Set(student_offers.map(r => String(r.offer_status ?? '').trim()).filter(Boolean))].sort().forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; statusFilter.appendChild(option); });
            statusFilter.dataset.populated = 'true';
        }
        const renderOffers = () => {
            const term = String(searchInput?.value ?? '').trim().toLowerCase();
            const selected = String(statusFilter?.value ?? '').toLowerCase();
            const filtered = student_offers.filter(row => (!term || columns.some(col => String(row[col] ?? '').toLowerCase().includes(term))) && (!selected || String(row.offer_status ?? '').toLowerCase() === selected));
            container.innerHTML = filtered.length ? create_table(filtered, columns) : '<p class="student-applications-empty">No offers match your search or filter.</p>';
        };
        if (searchButton && !searchButton.dataset.bound) { searchButton.addEventListener('click', renderOffers); searchButton.dataset.bound = 'true'; }
        if (searchInput && !searchInput.dataset.bound) { searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') renderOffers(); }); searchInput.dataset.bound = 'true'; }
        if (statusFilter && !statusFilter.dataset.bound) { statusFilter.addEventListener('change', renderOffers); statusFilter.dataset.bound = 'true'; }
        if (clearButton && !clearButton.dataset.bound) { clearButton.addEventListener('click', () => { if (searchInput) searchInput.value = ''; if (statusFilter) statusFilter.value = ''; renderOffers(); }); clearButton.dataset.bound = 'true'; }
        renderOffers();

    } catch (error) {
        console.error(error);

        if (container) {
            container.innerHTML =
                '<p>failed to load offers</p>';
        }
    }
}


/* =====================================================
   apply for placement drive
===================================================== */

async function apply_for_drive(drive_id) {
    if (!current_student) {
        alert('please login first');
        return;
    }

    const application_id =
        Date.now();

    try {
        const response =
            await fetch('/api/applications', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    application_id:
                        application_id,

                    student_id:
                        current_student.student_id,

                    drive_id:
                        drive_id,

                    application_date:
                        new Date()
                            .toISOString()
                            .split('T')[0],

                    application_status:
                        'Applied'
                })
            });

        const data =
            await response.json();

        alert(
            data.message ||
            (
                response.ok
                    ? 'application submitted successfully'
                    : 'unable to apply'
            )
        );

        if (response.ok) {
            await load_student_applications();
        }

    } catch (error) {
        console.error(error);

        alert(
            'unable to connect to server'
        );
    }
}


/* =====================================================
   admin dashboard
===================================================== */

async function load_admin_dashboard() {
    try {
        const response =
            await fetch(
                '/api/dashboard/statistics'
            );

        if (!response.ok) {
            throw new Error(
                'failed to fetch dashboard statistics'
            );
        }

        const data =
            await response.json();

        set_text(
            'total-students',
            data.total_students
        );

        set_text(
            'placed-students',
            data.placed_students
        );

        set_text(
            'total-companies',
            data.total_companies
        );

        set_text(
            'total-drives',
            data.total_drives
        );

        set_text(
            'total-applications',
            data.total_applications
        );

        set_text(
            'total-offers',
            data.total_offers
        );

        set_text(
            'highest-package',
            `${data.highest_package} lpa`
        );

        set_text(
            'placement-percentage',
            `${data.placement_percentage}%`
        );

        const summary =
            document.getElementById(
                'admin-summary'
            );

        if (summary) {
            summary.innerHTML = `
                <p>
                    average package:
                    ${placex_escape(
                        data.average_package
                    )} lpa
                </p>

                <p>
                    interviews:
                    ${placex_escape(
                        data.total_interviews
                    )}
                </p>

                <p>
                    accepted offers:
                    ${placex_escape(
                        data.accepted_offers
                    )}
                </p>
            `;
        }

    } catch (error) {
        console.error(error);
    }
}


/* =====================================================
   admin students
===================================================== */

async function load_admin_students() {
    const response =
        await fetch('/api/students');

    if (!response.ok) {
        throw new Error(
            'failed to fetch students'
        );
    }

    placex_admin_data.students =
        await response.json();

    placex_setup_toolbar(
        'students',
        placex_admin_data.students,
        'placement_status',
        'all placement statuses',
        true
    );

    placex_apply_filter('students');
}


/* =====================================================
   admin companies
===================================================== */

async function load_admin_companies() {
    const response =
        await fetch('/api/companies');

    if (!response.ok) {
        throw new Error(
            'failed to fetch companies'
        );
    }

    placex_admin_data.companies =
        await response.json();

    placex_setup_toolbar(
        'companies',
        placex_admin_data.companies,
        'company_type',
        'all company types'
    );

    placex_apply_filter('companies');
}


/* =====================================================
   admin drives
===================================================== */

async function load_admin_drives() {
    const response =
        await fetch('/api/drives');

    if (!response.ok) {
        throw new Error(
            'failed to fetch drives'
        );
    }

    placex_admin_data.drives =
        await response.json();

    placex_setup_toolbar(
        'drives',
        placex_admin_data.drives,
        'job_role',
        'all job roles'
    );

    placex_apply_filter('drives');
}


/* =====================================================
   admin applications
===================================================== */

async function load_admin_applications() {
    const response =
        await fetch('/api/applications');

    if (!response.ok) {
        throw new Error(
            'failed to fetch applications'
        );
    }

    placex_admin_data.applications =
        await response.json();

    placex_setup_toolbar(
        'applications',
        placex_admin_data.applications,
        'application_status',
        'all application statuses'
    );

    placex_apply_filter('applications');
}


/* =====================================================
   admin interviews
===================================================== */

async function load_admin_interviews() {
    const response =
        await fetch('/api/interviews');

    if (!response.ok) {
        throw new Error(
            'failed to fetch interviews'
        );
    }

    placex_admin_data.interviews =
        await response.json();

    placex_setup_toolbar(
        'interviews',
        placex_admin_data.interviews,
        'result',
        'all interview results'
    );

    placex_apply_filter('interviews');
}


/* =====================================================
   admin offers
===================================================== */

async function load_admin_offers() {
    const response =
        await fetch('/api/offers');

    if (!response.ok) {
        throw new Error(
            'failed to fetch offers'
        );
    }

    placex_admin_data.offers =
        await response.json();

    placex_setup_toolbar(
        'offers',
        placex_admin_data.offers,
        'offer_status',
        'all offer statuses'
    );

    placex_apply_filter('offers');
}


/* =====================================================
   admin hr
===================================================== */

async function load_admin_hr() {
    const response =
        await fetch('/api/hr');

    if (!response.ok) {
        throw new Error(
            'failed to fetch hr'
        );
    }

    placex_admin_data.hr =
        await response.json();

    placex_setup_toolbar(
        'hr',
        placex_admin_data.hr,
        'company_name',
        'all companies'
    );

    placex_apply_filter('hr');
}


/* =====================================================
   section navigation
===================================================== */

function show_student_section(section_id) {
    const sections =
        document.querySelectorAll(
            '#student-dashboard .content-section'
        );

    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const selected =
        document.getElementById(section_id);

    if (selected) {
        selected.classList.remove('hidden');
    }

    const title =
        section_id
            .replace('student-', '')
            .replaceAll('-', ' ');

    set_text(
        'student-page-title',
        title
    );
}


async function show_admin_section(section_id) {
    const sections =
        document.querySelectorAll(
            '#admin-dashboard .content-section'
        );

    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const selected =
        document.getElementById(section_id);

    if (selected) {
        selected.classList.remove('hidden');
    }

    const title =
        section_id
            .replace('admin-', '')
            .replaceAll('-', ' ');

    set_text(
        'admin-page-title',
        title
    );

    if (section_id === 'admin-students') {
        await load_admin_students();
    }

    if (section_id === 'admin-companies') {
        await load_admin_companies();
    }

    if (section_id === 'admin-drives') {
        await load_admin_drives();
    }

    if (section_id === 'admin-applications') {
        await load_admin_applications();
    }

    if (section_id === 'admin-interviews') {
        await load_admin_interviews();
    }

    if (section_id === 'admin-offers') {
        await load_admin_offers();
    }

    if (section_id === 'admin-hr') {
        await load_admin_hr();
    }
}


/* =====================================================
   generic table
===================================================== */

function create_table(data, columns) {
    if (!data || data.length === 0) {
        return '<p>no data found</p>';
    }

    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
    `;

    columns.forEach(column => {
        html += `
            <th>
                ${placex_escape(
                    column.replaceAll('_', ' ')
                )}
            </th>
        `;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(row => {
        html += '<tr>';

        columns.forEach(column => {
            html += `
                <td>
                    ${placex_escape(
                        row[column] ?? ''
                    )}
                </td>
            `;
        });

        html += '</tr>';
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    return html;
}


/* =====================================================
   logout
===================================================== */

function logout() {
    current_role = '';
    current_student = null;

    document.getElementById(
        'student-dashboard'
    )?.classList.add('hidden');

    document.getElementById(
        'admin-dashboard'
    )?.classList.add('hidden');

    document.getElementById(
        'login-page'
    )?.classList.remove('hidden');

    const student_id =
        document.getElementById(
            'student-id'
        );

    if (student_id) {
        student_id.value = '';
    }

    const admin_email =
        document.getElementById(
            'admin-email'
        );

    if (admin_email) {
        admin_email.value = '';
    }

    const password_container =
        document.getElementById(
            'admin-password-container'
        );

    if (password_container) {
        password_container.innerHTML = '';
    }

    const message =
        document.getElementById(
            'login-message'
        );

    if (message) {
        message.textContent = '';
    }

    /*
     * Return to student login after logout.
     */
    select_role('student');
}


/* =====================================================
   admin management data
===================================================== */

const placex_admin_data = {
    students: [],
    companies: [],
    drives: [],
    applications: [],
    interviews: [],
    offers: [],
    hr: []
};


/* =====================================================
   utility functions
===================================================== */

function set_text(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? '';
    }
}


function placex_escape(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/* =====================================================
   management toolbar
===================================================== */

function placex_management_toolbar(
    key,
    filter_label,
    filter_field,
    add_button = false
) {
    return `
        <div
            class="management-toolbar"
            id="toolbar-${key}"
        >

            <div class="search-wrap">
                <span>⌕</span>

                <input
                    class="management-search"
                    id="search-${key}"
                    type="search"
                    autocomplete="off"
                    placeholder="search ${key}..."
                    oninput="
                        placex_apply_filter('${key}')
                    "
                >
            </div>

            <select
                class="management-filter"
                id="filter-${key}"
                onchange="
                    placex_apply_filter('${key}')
                "
            >
                <option value="">
                    ${placex_escape(filter_label)}
                </option>
            </select>

            ${
                add_button
                    ? `
                        <button
                            class="add-button"
                            type="button"
                            onclick="open_student_modal()"
                        >
                            + add student
                        </button>
                    `
                    : ''
            }

            <span
                class="result-count"
                id="count-${key}"
            ></span>

        </div>
    `;
}


/* =====================================================
   unique filter values
===================================================== */

function placex_unique_values(
    data,
    field
) {
    return [
        ...new Set(
            data
                .map(row => row?.[field])
                .filter(
                    value =>
                        value !== null &&
                        value !== undefined &&
                        value !== ''
                )
        )
    ].sort(
        (a, b) =>
            String(a).localeCompare(
                String(b),
                undefined,
                {
                    numeric: true
                }
            )
    );
}


/* =====================================================
   fill filter
===================================================== */

function placex_fill_filter(
    key,
    data,
    field,
    label
) {
    const select =
        document.getElementById(
            `filter-${key}`
        );

    if (!select) {
        return;
    }

    const values =
        placex_unique_values(
            data,
            field
        );

    select.innerHTML =
        `<option value="">
            ${placex_escape(label)}
        </option>` +

        values
            .map(value =>
                `
                <option
                    value="${placex_escape(value)}"
                >
                    ${placex_escape(value)}
                </option>
                `
            )
            .join('');
}


/* =====================================================
   filter data
===================================================== */

function placex_filter_data(
    key,
    data,
    filter_field
) {
    const search =
        (
            document.getElementById(
                `search-${key}`
            )?.value || ''
        )
            .trim()
            .toLowerCase();

    const filter =
        (
            document.getElementById(
                `filter-${key}`
            )?.value || ''
        )
            .trim()
            .toLowerCase();

    return data.filter(row => {
        const searchable =
            Object.values(
                row || {}
            )
                .join(' ')
                .toLowerCase();

        const search_ok =
            !search ||
            searchable.includes(search);

        const filter_ok =
            !filter ||
            String(
                row?.[filter_field] ?? ''
            )
                .toLowerCase() ===
            filter;

        return search_ok &&
            filter_ok;
    });
}


/* =====================================================
   render management table
===================================================== */

function placex_render_table(
    key,
    data,
    columns,
    filter_field,
    filter_label
) {
    const container =
        document.getElementById(
            `admin-${key}-data`
        );

    if (!container) {
        return;
    }

    const filtered =
        placex_filter_data(
            key,
            data,
            filter_field
        );

    const count =
        document.getElementById(
            `count-${key}`
        );

    if (count) {
        count.textContent =
            `${filtered.length} result${
                filtered.length === 1
                    ? ''
                    : 's'
            }`;
    }

    if (!filtered.length) {
        container.innerHTML =
            `
            <div class="no-results">
                no matching records found
            </div>
            `;

        return;
    }

    let html =
        `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
        `;

    columns.forEach(column => {
        html += `
            <th>
                ${placex_escape(
                    column.replaceAll('_', ' ')
                )}
            </th>
        `;
    });

    if (key === 'students') {
        html += '<th>actions</th>';
    }

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    filtered.forEach(row => {
        html += '<tr>';

        columns.forEach(column => {
            html += `
                <td>
                    ${placex_escape(
                        row[column] ?? ''
                    )}
                </td>
            `;
        });

        if (key === 'students') {
            html += `
                <td class="table-actions">

                    <button
                        class="edit-button"
                        type="button"
                        onclick="
                            open_student_modal_by_id(
                                ${Number(row.student_id)}
                            )
                        "
                    >
                        edit
                    </button>

                    <button
                        class="delete-button"
                        type="button"
                        onclick="
                            delete_student(
                                ${Number(row.student_id)}
                            )
                        "
                    >
                        delete
                    </button>

                </td>
            `;
        }

        html += '</tr>';
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML =
        html;
}


/* =====================================================
   filter configuration
===================================================== */

function placex_apply_filter(key) {
    const configs = {
        students: {
            data:
                placex_admin_data.students,

            columns: [
                'student_id',
                'name',
                'gender',
                'degree',
                'branch',
                'cgpa',
                'backlogs',
                'placement_status'
            ],

            field:
                'placement_status',

            label:
                'all placement statuses'
        },

        companies: {
            data:
                placex_admin_data.companies,

            columns: [
                'company_id',
                'company_name',
                'company_type',
                'industry',
                'location'
            ],

            field:
                'company_type',

            label:
                'all company types'
        },

        drives: {
            data:
                placex_admin_data.drives,

            columns: [
                'drive_id',
                'company_name',
                'job_role',
                'package_lpa',
                'vacancies',
                'drive_date',
                'last_date_to_apply'
            ],

            field:
                'job_role',

            label:
                'all job roles'
        },

        applications: {
            data:
                placex_admin_data.applications,

            columns: [
                'application_id',
                'student_name',
                'company_name',
                'job_role',
                'application_date',
                'application_status'
            ],

            field:
                'application_status',

            label:
                'all application statuses'
        },

        interviews: {
            data:
                placex_admin_data.interviews,

            columns: [
                'interview_id',
                'student_name',
                'company_name',
                'job_role',
                'interview_round',
                'interview_date',
                'result'
            ],

            field:
                'result',

            label:
                'all interview results'
        },

        offers: {
            data:
                placex_admin_data.offers,

            columns: [
                'offer_id',
                'student_name',
                'company_name',
                'offer_date',
                'package_lpa',
                'offer_status'
            ],

            field:
                'offer_status',

            label:
                'all offer statuses'
        },

        hr: {
            data:
                placex_admin_data.hr,

            columns: [
                'hr_id',
                'hr_name',
                'company_name',
                'email',
                'phone'
            ],

            field:
                'company_name',

            label:
                'all companies'
        }
    };

    const config =
        configs[key];

    if (!config) {
        return;
    }

    placex_render_table(
        key,
        config.data,
        config.columns,
        config.field,
        config.label
    );
}


/* =====================================================
   setup toolbar
===================================================== */

function placex_setup_toolbar(
    key,
    data,
    filter_field,
    filter_label,
    add_button = false
) {
    const container =
        document.getElementById(
            `admin-${key}-data`
        );

    if (!container) {
        return;
    }

    if (
        !document.getElementById(
            `toolbar-${key}`
        )
    ) {
        container.insertAdjacentHTML(
            'beforebegin',

            placex_management_toolbar(
                key,
                filter_label,
                filter_field,
                add_button
            )
        );
    }

    placex_fill_filter(
        key,
        data,
        filter_field,
        filter_label
    );
}


/* =====================================================
   student registration / add / edit
===================================================== */

function student_form_html(
    student = {}
) {
    const editing =
        Boolean(student.student_id);

    return `
        <div
            class="placex-modal"
            id="student-modal"
        >

            <div class="placex-modal-card">

                <div class="placex-modal-header">

                    <div>
                        <span>
                            ${
                                editing
                                    ? 'STUDENT MANAGEMENT'
                                    : 'NEW STUDENT REGISTRATION'
                            }
                        </span>

                        <h3>
                            ${
                                editing
                                    ? 'Edit Student'
                                    : 'Create Student Account'
                            }
                        </h3>
                    </div>

                    <button
                        class="modal-close"
                        type="button"
                        onclick="close_student_modal()"
                    >
                        ×
                    </button>

                </div>


                <form
                    id="student-form"
                    autocomplete="off"
                    onsubmit="save_student(event)"
                >

                    <input
                        type="hidden"
                        id="student-edit-id"
                        value="${placex_escape(
                            student.student_id || ''
                        )}"
                    >

                    <div class="student-form-grid">

                        ${student_field(
                            'name',
                            'full name',
                            'text',
                            student.name,
                            true
                        )}

                        ${student_field(
                            'gender',
                            'gender',
                            'select',
                            student.gender,
                            true,
                            [
                                'Male',
                                'Female',
                                'Other'
                            ]
                        )}

                        ${student_field(
                            'age',
                            'age',
                            'number',
                            student.age,
                            true
                        )}

                        ${student_field(
                            'degree',
                            'degree',
                            'text',
                            student.degree,
                            true
                        )}

                        ${student_field(
                            'branch',
                            'branch',
                            'text',
                            student.branch,
                            true
                        )}

                        ${student_field(
                            'cgpa',
                            'cgpa',
                            'number',
                            student.cgpa,
                            true,
                            [],
                            '0',
                            '10',
                            '0.01'
                        )}

                        ${student_field(
                            'backlogs',
                            'backlogs',
                            'number',
                            student.backlogs ?? 0,
                            true
                        )}

                        ${student_field(
                            'internships',
                            'internships',
                            'number',
                            student.internships ?? 0,
                            true
                        )}

                        ${student_field(
                            'certifications',
                            'certifications',
                            'number',
                            student.certifications ?? 0,
                            true
                        )}

                        ${student_field(
                            'coding_skills',
                            'coding skill score',
                            'number',
                            student.coding_skills ?? 0,
                            true,
                            [],
                            '0',
                            '10',
                            '1'
                        )}

                        ${student_field(
                            'communication_skills',
                            'communication skill score',
                            'number',
                            student.communication_skills ?? 0,
                            true,
                            [],
                            '0',
                            '10',
                            '1'
                        )}

                        ${student_field(
                            'aptitude_score',
                            'aptitude score',
                            'number',
                            student.aptitude_score ?? 0,
                            true,
                            [],
                            '0',
                            '100',
                            '1'
                        )}

                        ${student_field(
                            'projects',
                            'projects',
                            'number',
                            student.projects ?? 0,
                            true
                        )}

                        ${student_field(
                            'placement_status',
                            'placement status',
                            'select',
                            student.placement_status ||
                                'Not Placed',
                            true,
                            [
                                'Not Placed',
                                'Eligible',
                                'Applied',
                                'Shortlisted',
                                'Selected',
                                'Placed',
                                'Rejected'
                            ]
                        )}

                        ${student_field(
                            'company_type',
                            'company type',
                            'text',
                            student.company_type ||
                                '',
                            false
                        )}

                        ${student_field(
                            'package_lpa',
                            'package (lpa)',
                            'number',
                            student.package_lpa ?? 0,
                            false,
                            [],
                            '0',
                            '',
                            '0.01'
                        )}

                        ${student_field(
                            'email',
                            'email',
                            'email',
                            student.email || '',
                            false
                        )}

                        ${student_field(
                            'phone',
                            'mobile number',
                            'tel',
                            student.phone || '',
                            false
                        )}

                        ${student_field(
                            'city',
                            'city',
                            'text',
                            student.city || '',
                            false
                        )}

                        ${student_field(
                            'state',
                            'state',
                            'text',
                            student.state || '',
                            false
                        )}

                    </div>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="cancel-button"
                            onclick="close_student_modal()"
                        >
                            cancel
                        </button>

                        <button
                            type="submit"
                            class="save-button"
                        >
                            ${
                                editing
                                    ? 'save changes'
                                    : 'register student'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `;
}


/* =====================================================
   student field helper
===================================================== */

function student_field(
    id,
    label,
    type,
    value,
    required = false,
    options = [],
    min = '',
    max = '',
    step = ''
) {
    const val =
        value === false ||
        value === null ||
        value === undefined
            ? ''
            : value;

    let input = '';

    if (type === 'select') {
        input = `
            <select
                id="student-${id}"
                ${required ? 'required' : ''}
            >

                ${options
                    .map(option => `
                        <option
                            value="${placex_escape(
                                option
                            )}"
                            ${
                                String(val) ===
                                String(option)
                                    ? 'selected'
                                    : ''
                            }
                        >
                            ${placex_escape(option)}
                        </option>
                    `)
                    .join('')}

            </select>
        `;
    } else {
        input = `
            <input
                id="student-${id}"
                type="${type}"
                value="${placex_escape(val)}"
                autocomplete="off"
                ${required ? 'required' : ''}
                ${
                    min !== ''
                        ? `min="${min}"`
                        : ''
                }
                ${
                    max !== ''
                        ? `max="${max}"`
                        : ''
                }
                ${
                    step !== ''
                        ? `step="${step}"`
                        : ''
                }
            >
        `;
    }

    return `
        <div class="form-field">

            <label
                for="student-${id}"
            >
                ${placex_escape(label)}
                ${required ? ' *' : ''}
            </label>

            ${input}

        </div>
    `;
}


/* =====================================================
   open student registration
===================================================== */

function open_student_registration() {
    open_student_modal();
}


function open_student_modal(
    student = null
) {
    document.getElementById(
        'placex-modal-root'
    )?.remove();

    const root =
        document.createElement('div');

    root.id =
        'placex-modal-root';

    root.innerHTML =
        student_form_html(
            student || {}
        );

    document.body.appendChild(root);
}


/* =====================================================
   open student by id
===================================================== */

async function open_student_modal_by_id(
    student_id
) {
    const local =
        placex_admin_data.students.find(
            student =>
                Number(student.student_id) ===
                Number(student_id)
        );

    if (local) {
        open_student_modal(local);
        return;
    }

    try {
        const response =
            await fetch(
                `/api/students/${student_id}`
            );

        if (!response.ok) {
            alert(
                'student not found'
            );
            return;
        }

        const student =
            await response.json();

        open_student_modal(student);

    } catch (error) {
        console.error(error);

        alert(
            'unable to connect to server'
        );
    }
}


/* =====================================================
   close student modal
===================================================== */

function close_student_modal() {
    document.getElementById(
        'placex-modal-root'
    )?.remove();
}


/* =====================================================
   save student
===================================================== */

async function save_student(
    event
) {
    event.preventDefault();

    const edit_id =
        document.getElementById(
            'student-edit-id'
        ).value;

    const body = {
        name:
            document.getElementById(
                'student-name'
            ).value.trim(),

        gender:
            document.getElementById(
                'student-gender'
            ).value,

        age:
            Number(
                document.getElementById(
                    'student-age'
                ).value
            ),

        degree:
            document.getElementById(
                'student-degree'
            ).value.trim(),

        branch:
            document.getElementById(
                'student-branch'
            ).value.trim(),

        cgpa:
            Number(
                document.getElementById(
                    'student-cgpa'
                ).value
            ),

        backlogs:
            Number(
                document.getElementById(
                    'student-backlogs'
                ).value
            ),

        internships:
            Number(
                document.getElementById(
                    'student-internships'
                ).value
            ),

        certifications:
            Number(
                document.getElementById(
                    'student-certifications'
                ).value
            ),

        coding_skills:
            Number(
                document.getElementById(
                    'student-coding_skills'
                ).value
            ),

        communication_skills:
            Number(
                document.getElementById(
                    'student-communication_skills'
                ).value
            ),

        aptitude_score:
            Number(
                document.getElementById(
                    'student-aptitude_score'
                ).value
            ),

        projects:
            Number(
                document.getElementById(
                    'student-projects'
                ).value
            ),

        placement_status:
            document.getElementById(
                'student-placement_status'
            ).value,

        company_type:
            document.getElementById(
                'student-company_type'
            ).value.trim() ||
            null,

        package_lpa:
            Number(
                document.getElementById(
                    'student-package_lpa'
                ).value ||
                0
            ),

        email:
            document.getElementById('student-email').value.trim(),

        phone:
            document.getElementById('student-phone').value.trim(),

        city:
            document.getElementById('student-city').value.trim(),

        state:
            document.getElementById('student-state').value.trim()
    };

    const url =
        edit_id
            ? `/api/students/${edit_id}`
            : '/api/students';

    const method =
        edit_id
            ? 'put'
            : 'post';

    try {
        const response =
            await fetch(
                url,
                {
                    method,

                    headers: {
                        'content-type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(body)
                }
            );

        const data =
            await response
                .json()
                .catch(() => ({}));

        if (!response.ok) {
            alert(
                data.message ||
                'unable to save student'
            );
            return;
        }

        close_student_modal();

        alert(
            edit_id
                ? 'student updated successfully'
                : 'student registered successfully'
        );

        await load_admin_students();
        await load_admin_dashboard();

    } catch (error) {
        console.error(error);

        alert(
            'unable to connect to server'
        );
    }
}


/* =====================================================
   delete student
===================================================== */

async function delete_student(
    student_id
) {
    if (
        !confirm(
            'delete this student? this action cannot be undone.'
        )
    ) {
        return;
    }

    try {
        const response =
            await fetch(
                `/api/students/${student_id}`,
                {
                    method: 'delete'
                }
            );

        const data =
            await response
                .json()
                .catch(() => ({}));

        if (!response.ok) {
            alert(
                data.message ||
                'unable to delete student'
            );
            return;
        }

        alert(
            'student deleted successfully'
        );

        await load_admin_students();
        await load_admin_dashboard();

    } catch (error) {
        console.error(error);

        alert(
            'unable to connect to server'
        );
    }
}


/* =====================================================
   student registration button
===================================================== */

function placex_add_registration_button() {
    const student_login =
        document.getElementById(
            'student-login'
        );

    if (
        !student_login ||
        document.getElementById(
            'student-registration-button'
        )
    ) {
        return;
    }

    const button =
        document.createElement(
            'button'
        );

    button.id =
        'student-registration-button';

    button.type =
        'button';

    button.className =
        'registration-link';

    button.textContent =
        'New student? Register here';

    button.onclick =
        open_student_registration;

    const info =
        student_login.querySelector(
            '.login-info'
        );

    if (info) {
        info.insertAdjacentElement(
            'afterend',
            button
        );
    } else {
        student_login.appendChild(
            button
        );
    }
}


/* =====================================================
   initial page load
===================================================== */

window.addEventListener(
    'DOMContentLoaded',
    () => {
        placex_add_registration_button();

        /*
         * Student is the default login role.
         */
        if (
            document.getElementById(
                'student-login'
            ) &&
            document.getElementById(
                'admin-login'
            )
        ) {
            select_role('student');
        }
    }
);