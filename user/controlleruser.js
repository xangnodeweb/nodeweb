const app = require("express").Router();
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const buffer = require("buffer").Buffer
const { genaratepasswordhash, showpassword, configpg, getuserbyusername } = require("../user/usermodule");
const auth = require("../user/auth")
const pool = new Pool({
    user: "postgres",
    password: "12345678",
    host: "172.28.17.243",
    port: "5432",
    database: "smsuser"
});


app.post("/createuser", async (req, res) => {
    try {
        const body = req.body;
        const password = req.body.password;
        body.password = bcrypt.hashSync(req.body.password, 9);
        const passgenarate = genaratepasswordhash(password);
        // console.log(passgenarate)
        const usercheck = await getuserbyusername(req.body.username);
        // console.log(usercheck)
        if (usercheck.length > 0) {
            return res.status(400).json({ status: false, code: 1, message: "username aleardy." });
        }
        const date = new Intl.DateTimeFormat("US-en", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: '2-digit', timeZone: "Asia/Bangkok" }).format(new Date());
        const databody = [req.body.username, req.body.password, passgenarate, req.body.firstname, req.body.lastname, date, req.body.userid, req.body.role];
        const userquery = await pool.query('insert into smsuser (username , password , passwordhash , firstname , lastname , createtime, userid , role) values($1 , $2, $3 ,$4 , $5 , $6, $7 , $8)', databody)

        if (userquery.rowCount > 0) {
            const data = {
                "username": req.body.username,
                "password": req.body.password,
                "passwordhash": passgenarate,
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "createtime": date,
                "userid": req.body.userid
            }
            return res.status(200).json({ status: true, code: 0, message: "create_user_success", result: data })
        }

        return res.status(400).json({ status: false, code: 0, message: "create_user_failed", result: {} })
    } catch (error) {
        console.log(error);
    }
})

app.post("/login", async (req, res) => {
    try {

        const body = req.body;
        const username = req.body.username;
        let password = req.body.password;
        const user = await pool.query('select * from smsuser where username=$1', [username]);
        if (user.rowCount > 0) {
            const ismaths = bcrypt.compareSync(password, user.rows[0].password);
            if (!ismaths) {
                return res.status(400).json({ status: false, code: 2, message: "username and password incorrent." });
            }
        } else {
            return res.status(400).json({ status: false, code: 1, message: "username not found. " });
        }
        const token = jwt.sign({
            useranme: user.rows[0].username,
            firstname: user.rows[0].firstname,
            lastname: user.rows[0].lastname,
            role: user.rows[0].role,
            createtime: user.rows[0].createtime,
            id: user.rows[0].id
        }, "SECRET_KEY_TEXT", {
            expiresIn: "1d"
        })
        return res.status(200).json({ status: true, code: 0, message: "login_success", result: token })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 3, message: "login_failed", result: null });
    }
});

app.post("/getuser", [auth], async (req, res) => {
    try {
        const user = await pool.query("select * from smsuser");
        if (user.rowCount > 0) {
            return res.status(200).json({ status: true, code: 0, message: "get_user_success", result: user.rows });
        }
        return res.status(400).json({ status: false, code: 0, message: "get_user_failed", result: [] });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "get_user_failed", result: [] });
    }
});

app.post("/updateuser/:userid", async (req, res) => {
    try {

        const body = req.body;
        const userid = req.params.userid;
        const user = await pool.query("select * from smsuser where userid=$1", [userid]);
        const password = req.body.password;
        body.password = bcrypt.hashSync(password, 9);
        if (user.rowCount == 0) {
            return res.status(400).json({ status: false, code: 1, message: "user not found.", result: null });
        }
        let passwordcon = showpassword(user.rows[0].passwordhash);
        // console.log(passwordcon)
        let data = {
            "password": "",
            "passwordhash": "",
            "firstname": "",
            "lastname": ""
        }

        if (passwordcon != password) {
            const passgenarate = genaratepasswordhash(password);
            data.password = body.password;
            data.passwordhash = passgenarate;
            data.firstname = user.rows[0].firstname == req.body.firstname ? user.rows[0].firstname : req.body.firstname;
            data.lastname = user.rows[0].lastname == req.body.lastname ? user.rows[0].lastname : req.body.lastname;
        } else {
            data.password = user.rows[0].password;
            data.passwordhash = user.rows[0].passwordhash;
            data.firstname = user.rows[0].firstname == req.body.firstname ? user.rows[0].firstname : req.body.firstname;
            data.lastname = user.rows[0].lastname == req.body.lastname ? user.rows[0].lastname : req.body.lastname;
        }
        const modelbody = [userid, data.password, data.passwordhash, data.firstname, data.lastname]
        const useredit = await pool.query('update smsuser set password=$2 , passwordhash=$3 , firstname=$4, lastname=$5 where userid=$1', modelbody)
        // console.log(useredit)
        if (useredit.rowCount > 0) {
            return res.status(200).json({ status: true, code: 0, message: "update_success", result: data })
        }
        return res.status(400).json({ status: false, code: 1, message: "update_failed", result: null })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "update_failed", result: null })
    }
})

app.delete("/deleteuser/:userid", async (req, res) => {
    try {

        const userid = req.params.userid; // userid is username
        const pool = await configpg();
        const usercheck = await getuserbyusername(userid);
        if (usercheck.length == 0) {
            return res.status(400).json({ status: false, code: 0, message: "username not found.", result: null });

        }
        const user = await pool.query(`delete from smsuser where username='${userid}'`);
        if (user.rowCount > 0) {
            return res.status(200).json({ status: true, code: 0, message: "delete_user_success", result: user.rows })
        }
        return res.status(400).json({ status: false, code: 1, message: "delete_user_failed", result: userid });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot_delete_user", result: null });
    }

})


// const genaratepasswordhash = (value) => {

//     try {
//         const password = buffer.from(value).toString("base64");
//         return password;
//     } catch (error) {
//         console.log(error);
//     }
// }
// const showpassword = (value) => {
//     try {
//         const password = buffer.from(value, "base64").toString("ascii")

//         return password;

//     } catch (error) {
//         console.log(error);
//     }

// }



module.exports = app;
