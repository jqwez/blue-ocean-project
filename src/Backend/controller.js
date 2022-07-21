const pool = require('./connection.js');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const admin = require("firebase-admin")

const serviceAccount = require("../../ServiceAccountKey.json");

const testRoute = async (_, res) => {
    try {
        console.log('Hello World!')
        res.send('Hello World!')

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

//! ------------USER/ADMIN Table Logic------------
const getAllUsers = async (_, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM users;')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getOneUserByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM users WHERE user_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createNewUser = async (req, res) => {

    const { first, last, email, username, password, rank, branch, duty_station, taps_complete, leave_start_date, ets_date, planning_to_relocate, city, state, has_dependents, highest_education, seeking_further_education, admin, cohort_name, cohort_id, new_user } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('INSERT INTO users (first, last, email, username, password, rank, branch, duty_station, taps_complete, leave_start_date, ets_date, planning_to_relocate, city, state, has_dependents, highest_education, seeking_further_education, admin, cohort_name, cohort_id, new_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *;', [first, last, email, username, password, rank, branch, duty_station, taps_complete, leave_start_date, ets_date, planning_to_relocate, city, state, has_dependents, highest_education, seeking_further_education, admin, cohort_name, cohort_id, new_user])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

// const createNewUser = async (req, res) => {
//     try {
//         const create = await createUserWithEmailAndPassword(
//             auth,
//             req.body.username,
//             req.body.password
//         )
//         res.send(create)
//     } catch (error) {
//         if (error) {
//             res.send(error)
//         }
//     }
// }

const createNewAdmin = async (req, res) => {

    try {
        const { first, last, email, username, password } = req.body
        let client = await pool.connect()
        let data = await client.query('INSERT INTO users (first, last, email, username, password, admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;', [first, last, email, username, password, true])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateOneUserByID = async (req, res) => {

    const { first, last, email, username, password, rank, branch, duty_station, taps_complete, leave_start_date, ets_date, planning_to_relocate, city, state, has_dependents, highest_education, seeking_further_education, admin, cohort_name, cohort_id, new_user } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE users SET first = $1, last = $2, email = $3, username = $4, password = $5, rank = $6, branch = $7, duty_station = $8, taps_complete = $9, leave_start_date = $10, ets_date = $11, planning_to_relocate = $12, city = $13, state = $14, has_dependents = $15, highest_education = $16, seeking_further_education = $17, admin = $18, cohort_name = $19, cohort_id = $20, new_user = $21 WHERE user_id = $22 RETURNING *', [first, last, email, username, password, rank, branch, duty_station, taps_complete, leave_start_date, ets_date, planning_to_relocate, city, state, has_dependents, highest_education, seeking_further_education, admin, cohort_name, cohort_id, new_user, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateAdminByID = async (req, res) => {

    const { first, last, email, username, password } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE users SET first = $1, last = $2, email = $3, username = $4, password = $5 WHERE user_id = $6 RETURNING *', [first, last, email, username, password, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const deleteOneUserByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


//! ------------COHORT Table Logic-----------
const getAllCohorts = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM cohorts;')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getOneCohortByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM cohorts WHERE cohort_id = $1;', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createNewCohort = async (req, res) => {
    const { cohort_name, start_date, end_date, active } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('INSERT INTO cohorts (cohort_name, start_date, end_date, active) VALUES($1, $2, $3, $4) RETURNING *', [cohort_name, start_date, end_date, active])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateOneCohortByID = async (req, res) => {

    const { cohort_name, start_date, end_date, active } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE cohorts SET cohort_name = $1, start_date = $2, end_date = $3, active = $4 WHERE cohort_id = $5 RETURNING *', [cohort_name, start_date, end_date, active, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const archiveOneCohortByID = async (req, res) => {
    const { active } = req.body
    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE cohorts SET active = $1 WHERE cohort_id = $2 RETURNING *', [active, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }

}

const deleteOneCohortByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('DELETE FROM cohorts WHERE cohort_id = $1 RETURNING *', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


//! --------- DEPENDENTS Table logic ----------
const getAllDependents = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM dependents')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getAllDependentsBySponsorID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM dependents WHERE sponsor_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getOneDependentByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM dependents WHERE dependent_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createNewDependent = async (req, res) => {
    const { sponsor_id, age, relation } = req.body
    try {
        let client = await pool.connect()
        let data = await client.query('INSERT INTO dependents (sponsor_id, age, relation) VALUES ($1, $2, $3) RETURNING *', [sponsor_id, age, relation])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateOneDependentByID = async (req, res) => {
    const { age, relation } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE dependents SET age = $1, relation = $2 WHERE dependent_id = $3 RETURNING *', [age, relation, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const deleteOneDependentByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('DELETE FROM dependents WHERE dependent_id = $1 RETURNING *', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


//! --------- TASKS Table logic -------------
const getAllTasks = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM tasks')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getAllTasksByStudentID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM tasks WHERE student_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getOneTaskByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM tasks WHERE task_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createNewTask = async (req, res) => {
    const { student_id, title, date, description, remarks, completed } = req.body
    try {
        let client = await pool.connect()
        let data = await client.query('INSERT INTO tasks (student_id, title, date, description, remarks, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [student_id, title, date, description, remarks, completed])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateOneTaskByID = async (req, res) => {
    const { title, date, description, remarks, completed } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE tasks SET title = $1, date = $ 2, description = $ 3, remarks = $ 4, completed = $5 WHERE task_id = $6 RETURNING *', [title, date, description, remarks, completed, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const deleteOneTaskByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


//! -----------COMMENTS Table logic -------------
const getAllComments = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM comments')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getAllCommentsByStudentID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM comments WHERE student_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getOneCommentByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('SELECT * FROM comments WHERE comment_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const createNewComment = async (req, res) => {
    const { student_id, author_id, content, date_time } = req.body
    try {
        let client = await pool.connect()
        let data = await client.query('INSERT INTO comments (student_id, author_id, content, date_time) VALUES ($1, $2, $3, $4) RETURNING *', [student_id, author_id, content, date_time])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const updateOneCommentByID = async (req, res) => {
    const { author_id, content } = req.body

    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE comments SET author_id = $1, content = $2 WHERE comment_id = $3 RETURNING *', [author_id, content, req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const deleteOneCommentByID = async (req, res) => {
    try {
        let client = await pool.connect()
        let data = await client.query('DELETE FROM comments WHERE comment_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports = {
    testRoute,
    getAllUsers,
    getOneUserByID,
    createNewUser,
    createNewAdmin,
    updateOneUserByID,
    updateAdminByID,
    deleteOneUserByID,
    getAllCohorts,
    getOneCohortByID,
    createNewCohort,
    updateOneCohortByID,
    archiveOneCohortByID,
    deleteOneCohortByID,
    getAllDependents,
    getAllDependentsBySponsorID,
    getOneDependentByID,
    createNewDependent,
    updateOneDependentByID,
    deleteOneDependentByID,
    getAllTasks,
    getAllTasksByStudentID,
    getOneTaskByID,
    createNewTask,
    updateOneTaskByID,
    deleteOneTaskByID,
    getAllComments,
    getAllCommentsByStudentID,
    getOneCommentByID,
    createNewComment,
    updateOneCommentByID,
    deleteOneCommentByID
}