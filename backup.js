const express = require('express')
const bodyParser = require('body-parser')
// const mysql = require('mysql')
const bcrypt = require('bcrypt');
// const pool = require("./db");

const mysql = require("mysql");

const app = express()
const port = process.env.PORT || 5000

app.use(express.urlencoded({ extended: false }))

app.use(express.json()) 

var pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db'
});



pool.connect(function(error) {
    if (error) {
        console.log("Error");
    } else {
        console.log("Connected");
    }
}); 



app.post("/signup", async(req, res) => {
    
    try {
        // console.log(req.body);
        const {uname} = req.body;
        const {f_name} = req.body;
        const {l_name} = req.body;
        const {password} = req.body;
        const {confirm_pass} = req.body;
        const {email} = req.body;
        const {dob} = req.body;
        const {gender} = req.body;
        const {country} = req.body;
        const {ph_no} = req.body;
        
        if (!uname || !f_name || !l_name || !password || !email || !dob || !country || !ph_no){
            return res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        if(password != confirm_pass){
            return res.json({
                "msg": "Your password do not match", 
                "status" : 301
            });
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const pass_hash = bcrypt.hashSync(password, salt);

        // const query2 = await client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
        pool.query("SELECT * FROM users WHERE uname = ?", [uname], (err, results, fields) => {
            if (err) { 
                throw err; 
            }
            console.log(results);

            if (results.length > 0) {
                return res.json({
                    "msg": "User is already registered", 
                    "status" : 302
                }); 
                // pool.end();
            } 
            else {
                // // check duplicacy of email 
                pool.query(`SELECT * FROM users
                    WHERE email = ?`,
                    [email], (err, result2) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result2.length > 0) {
                        res.json({
                            "msg": "Email is already registered",
                            "status" : 303
                        });
                    }
                    else {
                        // check duplicacy of ph_no
                        pool.query(`SELECT * FROM users
                        WHERE ph_no = ?`,[ph_no], (err, result3) => {
                        if (err) {
                            console.log(err);
                        }
                        if (result3.length > 0) {
                            res.json({
                                "msg": "Phone number is already registered",
                                "status" : 304
                            });
                        }
                        else {

                            // const query = await pool.query("INSERT INTO users (uname, f_name, l_name, password, ph_no, email, dob, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uumame, pass_hash, ph_no, email, dob, gender]);
                            pool.query("INSERT INTO users (uname, f_name, l_name, password, ph_no, email, dob, gender, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [uname, f_name, l_name, pass_hash, ph_no, email, dob, gender, country],
                            (err, results) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                  
                                    res.json({
                                        "msg": "Data inserted succesfull",
                                        "status" : 200
                                    });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                                    
                                }
                            });
                        
                        }
                    });
                }
            });

        }
        });

    } catch (error) {
        console.error(error.message);        
    }
});



//Register.

app.post("/register", async(req, res) => {
    
    try {
        // console.log(req.body);
        const {name} = req.body;
        const {email} = req.body;
        const {company} = req.body;
        const {ph_no} = req.body;
        const {website} = req.body;
        const {role} = req.body;
        const {industry} = req.body;
        const {country} = req.body;
        const {work_before} = req.body;
        const {more_info} = req.body;
        
        if (!name || !email || !company || !ph_no || !website || !role || !industry || !country || !work_before){
            return res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }
               
                // // check duplicacy of email 
                pool.query(`SELECT * FROM register_cb
                    WHERE email = ?`,
                    [email], (err, result2) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result2.length > 0) { 

                        res.json({
                            "msg": "Email is already registered",
                            "status" : 303
                        });
                    }
                    else {
                        // check duplicacy of ph_no
                        pool.query(`SELECT * FROM register_cb
                        WHERE ph_no = ?`,[ph_no], (err, result3) => {
                        if (err) {
                            console.log(err);
                        }
                        if (result3.length > 0) {
                            res.json({
                                "msg": "Phone number is already registered",
                                "status" : 304
                            });
                        }
                        else {

                            // const query = await pool.query("INSERT INTO users (uname, f_name, l_name, password, ph_no, email, dob, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uumame, pass_hash, ph_no, email, dob, gender]);
                            pool.query("INSERT INTO register_cb (name, ph_no, email,company, website, role, industry, country, work_before, more_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, ph_no, email,company, website, role, industry, country, work_before, more_info],
                            (err, results) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                  
                                    res.json({
                                        "msg": "Registeration succesfull",
                                        "status" : 200
                                    });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                                    
                                } //
                            });
                        
                        }
                    });
                }
            });

    } catch (error) {
        console.error(error.message);        
    }
});


// Login route
// Login.
app.post("/login", async(req, res) => {
    try {

        const {uname} = req.body;
        const {password} = req.body;

        if (!uname || !password) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        pool.query("SELECT * FROM users WHERE uname=?", [uname], (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results);

                if (results.length > 0) {
                    const user = results[0];
                
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }

                        if (isMatch) {
                            
                            email = user.email;
                            

                            

                            
                             res.json({
                                "msg": "User authenticated", 
                                "status" : 200
                            });
                        }
                        else {
                            res.json({
                                "msg": "Password is not correct", 
                                "status" : 302
                            });
                        }
                    });
                } else {
                    res.json({
                        "msg": "Username is not registered", 
                        "status" : 303
                    });
                }
                
            });

    } catch (error) {
        console.error(error.message);
    }
});

// database connection here //
// async function dbStart() {
//     try { 
//         await pool.connect();
//         console.log("DB connected successfully.");
//         // await pool.query("");

//     }
//     catch (e) {
//         console.error(`The error has occured: ${e}`)
//     }
// }

// Listen on enviroment port or 5000
// app.listen(port, () => console.log(`Listen on port ${port}`))
//



//Forget password

// app.post("/forgetpassword", async(req, res) => {
//     try {

//         const {password} = req.body;
//         const {confrim_pass} = req.body;

//         if(password != confirm_pass){
//             return res.json({
//                 "msg": "Your password do not match", 
//                 "status" : 301
//             });
//         }

//         const saltRounds = 10;
//         const salt = bcrypt.genSaltSync(saltRounds);

//         const pass_hash = bcrypt.hashSync(password, salt);




// send verification code when user forget password
app.post("/sendotpviaemail", async(req, res) => {
    try {

        let {email} = req.body;
        email = email.toLowerCase();

        if (!email) {
            res.json({
                "msg": "Please provide your email", 
                "status" : 301
            });
        }
        
        client.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows);

            if (results.rows.length > 0) {
                const user = results.rows[0];
                db_email = user.email;
                // generate new OTP
                function randomNum(min, max) {
                    return Math.floor(Math.random() * (max - min) + min)
                }

                const verificationCode = randomNum(10000, 99999);
                // verificationCode = user.otp;

                // send Verification Code via email. 
                sendEmail(verificationCode, db_email);

                client.query("UPDATE users SET otp=$1 WHERE email=$2", [verificationCode, db_email], (err, results) => {
                    if (err) {
                        throw err;
                    }

                    res.json({
                        "msg": "verification code for reset password is sent to the email.", 
                        "status" : 200
                    });

                });
            }
            else {
                res.json({
                    "msg": "No such email is registered.", 
                    "status" : 303
                });
            }
            
        });
    } catch (error) {
        console.error(error.message);
    }
})

// verify user OTP for resetting his password. 
app.post("/verifyuserotp", async(req, res) => {
    try {

        let {email} = req.body;
        email = email.toLowerCase();
        const {otp} = req.body;

        if (!email || !otp) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }
        
        client.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows);

            if (results.rows.length > 0) {
                const user = results.rows[0];
                db_otp = user.otp;

                if (otp != db_otp) {
                    res.json({
                        "msg": "OTP didn't match, try again", 
                        "status" : 302
                    });

                }

                res.json({
                    "msg": "OTP matched successfully", 
                    "status" : 200
                });
                
            }
            else {
                res.json({
                    "msg": "No such user is registered.", 
                    "status" : 303
                });
            }
            
        });
    } catch (error) {
        console.error(error.message);
    }
})


// forget password
app.post("/resetpass", async(req, res) => {
    try {

        const {email} = req.body;
        const {new_password} = req.body;
        const {confirm_password} = req.body;       

        if (!email || !new_password || !confirm_password) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        if (new_password != confirm_password) {
            res.json({
                "msg": "new password didn't match confirm password", 
                "status" : 302
            });
        }
        
        client.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows);

            if (results.rows.length > 0) {
                const user = results.rows[0];
                db_otp = user.otp;

                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);

                const pass_hash = bcrypt.hashSync(new_password, salt);

                client.query("UPDATE users SET password=? WHERE email=?", [pass_hash, email], (err, results) => {
                    if (err) {
                        throw err;
                    }

                    res.json({
                        "msg": "User password has been updated", 
                        "status" : 200
                    });

                });
            }
            else {
                res.json({
                    "msg": "Username is not registered", 
                    "status" : 303
                });
            }
            
        });
    } catch (error) {
        console.error(error.message);
    }
});


app.listen(port, () => {
    console.log("Server has started on port 5000");
    // dbStart();
}); 

