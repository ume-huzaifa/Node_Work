const express = require('express')
const bodyParser = require('body-parser')
// const mysql = require('mysql')
const bcrypt = require('bcrypt');
const pool = require("./db"); 
const sendEmail = require("./email");
const multer = require("multer");
// const mysql = require("mysql");

const app = express()
const port = process.env.PORT || 5000

app.use(express.urlencoded({ extended: false }))

app.use(express.json()) 


//for professionals

const storage9 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'uploads/professionals/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload9 = multer({
    storage : storage9
});


//Signup
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



//Register

app.post("/register", async(req, res) => {
    
    try {
        // console.log(req.body);
        const {name} = req.body;
        const {email} = req.body;
        const {company} = req.body;
        const {ph_no} = req.body;
        const {website} = req.body;
        const {role} = req.body;
        const {category} = req.body;
        const {country} = req.body;
        const {work_before} = req.body;
        const {bio} = req.body;
        
        if (!name || !email || !company || !ph_no || !website || !role || !category || !country || !bio){
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
                            pool.query("INSERT INTO register_cb (name, ph_no, email,company, website, role, category, country, work_before, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, ph_no, email,company, website, role, category, country, work_before, bio],
                            (err, results) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                  
                                    res.json({
                                        "msg": "Registeration succesfull",
                                        "status" : 200
                                    });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                                    
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




// send verification code when user forget password
app.post("/sendlinkviaemail", async(req, res) => {
    try {

        let {email} = req.body;
        email = email.toLowerCase();

        if (!email) {
            res.json({
                "msg": "Please provide your email", 
                "status" : 301
            });
        }
        
        pool.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
            if (err) {
                throw err;                
            }
    
            console.log(results);

            if (results.length > 0) {
                const user = results[0];
                console.log(user);
                db_email = user.email;
                console.log(db_email);
                db_id = user.id
            
                var link = `http://www.ezmec.com/resetpass/${db_id}`;
                
                // send Verification Code via email. 
                sendEmail(link, db_email);
                res.json({
                            "msg": "link for reset password is sent to the email.", 
                            "status" : 200
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
});




// forget password
app.post("/resetpass/:uid", async(req, res) => {
    try {

        const {uid} = req.params;
        const {new_password} = req.body;
        const {confirm_password} = req.body;       

        if (!uid || !new_password || !confirm_password) {
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
        pool.query("SELECT * FROM users WHERE u_id=?", [uid], (err, results) => {
            if (err) {
                throw err;
            }
// 
            console.log(results);

            if (results.length > 0) {
                const user = results[0];
                // db_otp = user.otp;

                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);

                const pass_hash = bcrypt.hashSync(new_password, salt);

                pool.query("UPDATE users SET password=? WHERE u_id=?", [pass_hash, uid], (err, results) => {
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




//professionals    
app.post("/add_professionals", upload9.single("dp9"), async(req, res) => {
    
    try {
        console.log(req.file);
        // const {name} = req.body;
        const {email} = req.body;
        //const {p_pic} = req.body;
        const {genre} = req.body;
        const {price} = req.body;
        const {role} = req.body;
        // const {reviews} = req.body;
        const {bio} = req.body;
        // const {rating} = req.body;
        const {fans} = req.body;
        
        if (!email || !genre || !price || !role || !bio){
            return res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }
               
                //  check duplicacy of email 
                pool.query(`SELECT * FROM professionals
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
                      
                        // const query = await pool.query("INSERT INTO musicians (uname, f_name, l_name, password, ph_no, email, dob, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uumame, pass_hash, ph_no, email, dob, gender]);
                        pool.query("INSERT INTO professionals (email, genre, price, role, bio, fans, p_pic) VALUES (?, ?, ?, ?, ?, ?, ?)", [email,  genre, price, role, bio, fans, req.file.path],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            else {
                                
                                res.json({
                                    "msg": "Data uploaded succesfull",
                                    "status" : 200
                                });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                                
                            } 
                        });
                    
                }
            });

    } catch (error) {
        console.error(error.message);        
    }
});

// Reviews posting

//professionals    
app.post("/add_reviews", async(req, res) => {
    
    try {
        console.log(req.file);
        const pro_id = req.body;
        const rev_name = req.body;
        const long_ago = req.body;
        const time  = req.body;
        const rating = req.body;
        const comment = req.body;
        
        if (!pro_id || !rev_name || !comment){
            return res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }
                          
        // const query = await pool.query("INSERT INTO musicians (uname, f_name, l_name, password, ph_no, email, dob, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uumame, pass_hash, ph_no, email, dob, gender]);
        pool.query("INSERT INTO review (pro_id, rev_name, long_ago, time, rating, comment) VALUES (?, ?, ?, ?, ?, ?)", [pro_id, rev_name, long_ago, time, rating, comment],
        (err, results) => {
            if (err) {
                throw err;
            }
            else {
                
                res.json({
                    "msg": "review uploaded succesfull",
                    "status" : 200
                });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                
            } 
        });
            
    } catch (error) {
        console.error(error.message);        
    }
});



// get all the partners data from professionals
app.get("/getprofessionals", async(req, res) => {
    try {
        pool.query("SELECT * FROM professionals", (err, results)=> {
            if (err) throw err;

            res.json(results);          
        });
        
    } catch (error) {
        console.error(error.message);
    }
})

// get the partners data by giving pro_id
app.get("/getprofessionals/:pro_id", async(req, res) => {
    try {
        const pro_id = req.params.pro_id
        console.log(pro_id);
        pool.query("SELECT * FROM `professionals` WHERE `pro_id`=?",[pro_id],  (err, results)=> {
            if (err) throw err;

            res.json(results);          
        });

    } catch (error) {
        console.error(error.message);
    }
})


app.listen(port, () => {
    console.log("Server has started on port 5000");
    // dbStart();
}); 




