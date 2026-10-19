const express = require('express');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({
    path: path.join(__dirname, 'demo.env')
});

const app = express();

const port = 3000;


/* =====================================================
   middleware
===================================================== */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================================
   postgres connection
===================================================== */

const db = new Pool({

    host: process.env.db_host,

    port: Number(process.env.db_port),

    database: process.env.db_name,

    user: process.env.db_user,

    password: process.env.db_password

});


db.connect()
    .then(client => {

        console.log(
            'postgresql database connected'
        );

        client.release();

    })
    .catch(error => {

        console.error(
            'postgresql connection failed:',
            error.message
        );

    });


/* =====================================================
   frontend
===================================================== */

app.use(
    express.static(
        path.join(__dirname, '..', 'frontend')
    )
);


app.get('/', (request, response) => {

    response.sendFile(
        path.join(__dirname, '..', 'frontend', 'index.html')
    );

});


/* =====================================================
   students
===================================================== */


/* get all students */

app.get(
    '/api/students',
    async (request, response) => {

        try {

            const result =
                await db.query(
                    'select * from student order by student_id'
                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch students'

            });

        }

    }
);


/* get student by id */

app.get(
    '/api/students/:student_id',
    async (request, response) => {

        try {

            const student_id =
                Number(
                    request.params.student_id
                );


            if (
                !Number.isInteger(
                    student_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid student id'

                    });

            }


            const result =
                await db.query(

                    'select * from student where student_id = $1',

                    [
                        student_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'student not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch student'

            });

        }

    }
);


/*
    students are already stored in the database.

    there is intentionally no:

    post /api/students

    put /api/students/:student_id

    delete /api/students/:student_id

    therefore students cannot be created,
    edited, or deleted from this portal.
*/


/* =====================================================
   companies
===================================================== */

app.get(
    '/api/companies',
    async (request, response) => {

        try {

            const result =
                await db.query(
                    'select * from company order by company_id'
                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch companies'

            });

        }

    }
);


/* get company by id */

app.get(
    '/api/companies/:company_id',
    async (request, response) => {

        try {

            const company_id =
                Number(
                    request.params.company_id
                );


            if (
                !Number.isInteger(
                    company_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid company id'

                    });

            }


            const result =
                await db.query(

                    `
                    select *
                    from company
                    where company_id = $1
                    `,

                    [
                        company_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'company not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch company'

            });

        }

    }
);


/* =====================================================
   placement drives
===================================================== */

app.get(
    '/api/drives',
    async (request, response) => {

        try {

            const result =
                await db.query(

                    `
                    select
                        pd.*,
                        c.company_name

                    from placement_drive pd

                    left join company c
                        on c.company_id =
                           pd.company_id

                    order by pd.drive_id
                    `

                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch placement drives'

            });

        }

    }
);


/* get placement drive by id */

app.get(
    '/api/drives/:drive_id',
    async (request, response) => {

        try {

            const drive_id =
                Number(
                    request.params.drive_id
                );


            if (
                !Number.isInteger(
                    drive_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid drive id'

                    });

            }


            const result =
                await db.query(

                    `
                    select
                        pd.*,
                        c.company_name

                    from placement_drive pd

                    left join company c
                        on c.company_id =
                           pd.company_id

                    where pd.drive_id = $1
                    `,

                    [
                        drive_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'placement drive not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch placement drive'

            });

        }

    }
);


/* =====================================================
   applications
===================================================== */


/* get all applications */

app.get(
    '/api/applications',
    async (request, response) => {

        try {

            const result =
                await db.query(

                    `
                    select

                        a.*,

                        s.name as student_name,

                        c.company_name,

                        pd.job_role

                    from application a

                    left join student s
                        on s.student_id =
                           a.student_id

                    left join placement_drive pd
                        on pd.drive_id =
                           a.drive_id

                    left join company c
                        on c.company_id =
                           pd.company_id

                    order by
                        a.application_id desc
                    `

                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch applications'

            });

        }

    }
);


/* get applications for one student */

app.get(
    '/api/applications/student/:student_id',
    async (request, response) => {

        try {

            const student_id =
                Number(
                    request.params.student_id
                );


            if (
                !Number.isInteger(
                    student_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid student id'

                    });

            }


            const result =
                await db.query(

                    `
                    select

                        a.*,

                        c.company_name,

                        pd.job_role

                    from application a

                    left join placement_drive pd
                        on pd.drive_id =
                           a.drive_id

                    left join company c
                        on c.company_id =
                           pd.company_id

                    where a.student_id = $1

                    order by
                        a.application_id desc
                    `,

                    [
                        student_id
                    ]

                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch student applications'

            });

        }

    }
);


/* create application */

app.post(
    '/api/applications',
    async (request, response) => {

        try {

            const {
                student_id,
                drive_id,
                application_date,
                application_status
            } = request.body;


            const numeric_student_id =
                Number(
                    student_id
                );


            const numeric_drive_id =
                Number(
                    drive_id
                );


            if (
                !Number.isInteger(
                    numeric_student_id
                ) ||
                !Number.isInteger(
                    numeric_drive_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid student id or drive id'

                    });

            }


            /* check student */

            const student_result =
                await db.query(

                    `
                    select student_id
                    from student
                    where student_id = $1
                    `,

                    [
                        numeric_student_id
                    ]

                );


            if (
                student_result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'student not found'

                    });

            }


            /* check drive */

            const drive_result =
                await db.query(

                    `
                    select drive_id
                    from placement_drive
                    where drive_id = $1
                    `,

                    [
                        numeric_drive_id
                    ]

                );


            if (
                drive_result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'placement drive not found'

                    });

            }


            /* check duplicate application */

            const existing =
                await db.query(

                    `
                    select application_id
                    from application

                    where student_id = $1
                    and drive_id = $2
                    `,

                    [
                        numeric_student_id,
                        numeric_drive_id
                    ]

                );


            if (
                existing.rows.length > 0
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'student has already applied for this drive'

                    });

            }


            /* generate application id */

            const id_result =
                await db.query(

                    `
                    select coalesce(
                        max(application_id),
                        0
                    ) + 1 as application_id

                    from application
                    `

                );


            const application_id =
                Number(
                    id_result.rows[0]
                        .application_id
                );


            /* insert application */

            const result =
                await db.query(

                    `
                    insert into application (

                        application_id,

                        student_id,

                        drive_id,

                        application_date,

                        application_status

                    )

                    values (

                        $1,

                        $2,

                        $3,

                        $4,

                        $5

                    )

                    returning *
                    `,

                    [

                        application_id,

                        numeric_student_id,

                        numeric_drive_id,

                        application_date ||
                            new Date()
                                .toISOString()
                                .split('t')[0],

                        application_status ||
                            'Applied'

                    ]

                );


            response.status(201).json({

                message:
                    'application submitted successfully',

                application:
                    result.rows[0]

            });


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to submit application',

                error:
                    error.message

            });

        }

    }
);


/* =====================================================
   interviews
===================================================== */

app.get(
    '/api/interviews',
    async (request, response) => {

        try {

            const result = await db.query(`
                select
                    i.interview_id,
                    i.application_id,
                    a.student_id,
                    s.name as student_name,
                    c.company_name,
                    pd.job_role,
                    i.interview_round,
                    i.interview_date,
                    i.result,
                    i.remarks
                from interview i
                join application a
                    on i.application_id = a.application_id
                join student s
                    on a.student_id = s.student_id
                join placement_drive pd
                    on a.drive_id = pd.drive_id
                join company c
                    on pd.company_id = c.company_id
                order by i.interview_id
            `);

            response.json(result.rows);

        } catch (error) {

            console.error(error.message);

            response.status(500).json({
                message: 'failed to fetch interviews',
                error: error.message
            });

        }

    }
);
/* get interview by id */

app.get(
    '/api/interviews/:interview_id',
    async (request, response) => {

        try {

            const interview_id =
                Number(
                    request.params.interview_id
                );


            if (
                !Number.isInteger(
                    interview_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid interview id'

                    });

            }


            const result =
                await db.query(

                    `
                    select

                        i.*,

                        s.name as student_name,

                        c.company_name,

                        pd.job_role

                    from interview i

                    left join student s
                        on s.student_id =
                           i.student_id

                    left join placement_drive pd
                        on pd.drive_id =
                           i.drive_id

                    left join company c
                        on c.company_id =
                           pd.company_id

                    where i.interview_id = $1
                    `,

                    [
                        interview_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'interview not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch interview'

            });

        }

    }
);


/* =====================================================
   offers
===================================================== */

app.get(
    '/api/offers',
    async (request, response) => {

        try {

            const result =
                await db.query(

                    `
                    select

                        o.*,

                        s.name as student_name,

                        c.company_name

                    from offer o

                    left join student s
                        on s.student_id =
                           o.student_id

                    left join company c
                        on c.company_id =
                           o.company_id

                    order by
                        o.offer_id
                    `

                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch offers'

            });

        }

    }
);


/* get offer by id */

app.get(
    '/api/offers/:offer_id',
    async (request, response) => {

        try {

            const offer_id =
                Number(
                    request.params.offer_id
                );


            if (
                !Number.isInteger(
                    offer_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid offer id'

                    });

            }


            const result =
                await db.query(

                    `
                    select

                        o.*,

                        s.name as student_name,

                        c.company_name

                    from offer o

                    left join student s
                        on s.student_id =
                           o.student_id

                    left join company c
                        on c.company_id =
                           o.company_id

                    where o.offer_id = $1
                    `,

                    [
                        offer_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'offer not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch offer'

            });

        }

    }
);


/* =====================================================
   hr
===================================================== */

app.get(
    '/api/hr',
    async (request, response) => {

        try {

            const result =
                await db.query(

                    `
                    select

                        h.*,

                        c.company_name

                    from hr h

                    left join company c
                        on c.company_id =
                           h.company_id

                    order by
                        h.hr_id
                    `

                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch hr'

            });

        }

    }
);


/* get hr by id */

app.get(
    '/api/hr/:hr_id',
    async (request, response) => {

        try {

            const hr_id =
                Number(
                    request.params.hr_id
                );


            if (
                !Number.isInteger(
                    hr_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid hr id'

                    });

            }


            const result =
                await db.query(

                    `
                    select

                        h.*,

                        c.company_name

                    from hr h

                    left join company c
                        on c.company_id =
                           h.company_id

                    where h.hr_id = $1
                    `,

                    [
                        hr_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'hr not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch hr'

            });

        }

    }
);


/* =====================================================
   placement officers
===================================================== */


/*
    placement officers are read only.

    no create
    no update
    no delete
*/


app.get(
    '/api/placement-officers',
    async (request, response) => {

        try {

            const result =
                await db.query(
                    'select * from placement_officer'
                );


            response.json(
                result.rows
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch placement officers'

            });

        }

    }
);


/* get placement officer by id */

app.get(
    '/api/placement-officers/:officer_id',
    async (request, response) => {

        try {

            const officer_id =
                Number(
                    request.params.officer_id
                );


            if (
                !Number.isInteger(
                    officer_id
                )
            ) {

                return response
                    .status(400)
                    .json({

                        message:
                            'invalid officer id'

                    });

            }


            const result =
                await db.query(

                    `
                    select *

                    from placement_officer

                    where officer_id = $1
                    `,

                    [
                        officer_id
                    ]

                );


            if (
                result.rows.length === 0
            ) {

                return response
                    .status(404)
                    .json({

                        message:
                            'placement officer not found'

                    });

            }


            response.json(
                result.rows[0]
            );


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to fetch placement officer'

            });

        }

    }
);


/* =====================================================
   dashboard statistics
===================================================== */

app.get(
    '/api/dashboard/statistics',
    async (request, response) => {

        try {

            const students =
                await db.query(
                    'select * from student'
                );


            const companies =
                await db.query(
                    'select * from company'
                );


            const drives =
                await db.query(
                    'select * from placement_drive'
                );


            const applications =
                await db.query(
                    'select * from application'
                );


            const interviews =
                await db.query(
                    'select * from interview'
                );


            const offers =
                await db.query(
                    'select * from offer'
                );


            const total_students =
                students.rows.length;


            const placed_students =
                students.rows.filter(
                    student =>

                        String(
                            student.placement_status
                        ).toLowerCase() ===
                        'placed'

                ).length;


            const packages =
                students.rows

                    .map(
                        student =>
                            Number(
                                student.package_lpa
                            )
                    )

                    .filter(
                        value =>

                            Number.isFinite(
                                value
                            ) &&

                            value > 0

                    );


            const highest_package =
                packages.length

                    ? Math.max(
                        ...packages
                    )

                    : 0;


            const average_package =
                packages.length

                    ? (

                        packages.reduce(
                            (
                                total,
                                value
                            ) =>
                                total + value,

                            0
                        ) /
                        packages.length

                    ).toFixed(2)

                    : 0;


            const placement_percentage =
                total_students

                    ? (

                        placed_students /
                        total_students *
                        100

                    ).toFixed(2)

                    : 0;


            const accepted_offers =
                offers.rows.filter(

                    offer =>

                        String(
                            offer.offer_status
                        ).toLowerCase() ===
                        'accepted'

                ).length;


            response.json({

                total_students,

                placed_students,

                total_companies:
                    companies.rows.length,

                total_drives:
                    drives.rows.length,

                total_applications:
                    applications.rows.length,

                total_interviews:
                    interviews.rows.length,

                total_offers:
                    offers.rows.length,

                highest_package,

                average_package,

                placement_percentage,

                accepted_offers

            });


        } catch (error) {

            console.error(
                error.message
            );


            response.status(500).json({

                message:
                    'failed to load dashboard statistics'

            });

        }

    }
);


/* =====================================================
   health check
===================================================== */

app.get(
    '/api/health',
    async (request, response) => {

        try {

            await db.query(
                'select 1'
            );


            response.json({

                status:
                    'ok',

                database:
                    'connected',

                server:
                    'running'

            });


        } catch (error) {

            response.status(500).json({

                status:
                    'error',

                database:
                    'disconnected',

                message:
                    error.message

            });

        }

    }
);


/* =====================================================
   404 api handler
===================================================== */

app.use(
    '/api',
    (request, response) => {

        response
            .status(404)
            .json({

                message:
                    'api endpoint not found',

                path:
                    request.path

            });

    }
);


/* =====================================================
   error handler
===================================================== */

app.use(
    (error, request, response, next) => {

        console.error(
            'server error:',
            error.message
        );


        if (
            response.headersSent
        ) {

            return next(
                error
            );

        }


        response
            .status(500)
            .json({

                message:
                    'internal server error',

                error:
                    error.message

            });

    }
);


/* =====================================================
   start server
===================================================== */

app.listen(
    port,
    () => {

        console.log(
            `server is running on port ${port}`
        );

    }
);