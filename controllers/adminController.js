const bcrypt = require('bcryptjs');

exports.GetHospitals = async(req, res) => {
    try {
        const filter = req.query;
        const filterArray = Object.values(filter);
    
        let filterClause = ''
    
        if (filterArray.length) {
            filterClause += ' where'
            filterArray.map((item) => {
                if (item.type === 'switch') {
                    filterClause += ` ${item.name} ${item.value === 'false' ? '= 1' : 'in (0, 1)'}`;
                } else if (item.type === 'text') {
                    filterClause += ` and ${item.name} = '%${item.value}%'`;
                }
            })
        } else {
            filterClause = ' where active = 1';
        }
        
        req.dbConnection.query(`SELECT * FROM hospitals${filterClause}`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get hospitals", e);
    }    
}

exports.CreateHospital = async(req, res) => {
    try {
        const {title, hospitalId, sort} = req.body.data._value;

        req.dbConnection.query('INSERT INTO hospitals (title, hospitald, sort) VALUES (?, ?, ?)', [title, hospitalId, sort], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM hospitals WHERE id = ?', results.insertId, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch (e) {
        console.log("internal server error in create hospital", e);
    }
}

exports.UpdateHospital = async(req, res) => {
    try {
        const { id } = req.params;
        const {title, hospitalId, sort} = req.body.data._value;

        const now = new Date();

        req.dbConnection.query('UPDATE hospitals SET title = ?, hospitalId = ?, updatedAt = ?, sort = ? WHERE id = ?', [title, hospitalId, now, sort, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM hospitals WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch (e) {
        console.log("internal server error in update hospital", e);
    }
}

exports.DeleteHospital = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM clinics WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE hospitals SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch {
        console.log("internal server error in hospital delete", e);
    }
    
}

exports.GetAdminUsers = async(req, res) => {
    try {
        const filter = req.query;
        const filterArray = Object.values(filter);

        let filterClause = ''

        if (filterArray.length) {
            filterClause += ' where'
            filterArray.map((item) => {
                if (item.type === 'switch') {
                    filterClause += ` ${item.name} ${item.value === 'false' ? '= 1' : 'in (0, 1)'}`;
                } else if (item.type === 'text') {
                    filterClause += ` ${item.name} = '%${item.value}%'`;
                }
            })
        } else {
            filterClause = ' where active = 1';
        }
        
        req.dbConnection.query(`SELECT * FROM users${filterClause}`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get users", e);
    }
}

exports.CreateAdminUser = async(req, res) => {
    try {
        const { name, email, password,  role } = req.body;
  
        req.dbConnection.query('SELECT * FROM users WHERE email = ?', email, async (error, results) => {
            if (error) throw error;
        
            const user = results[0];

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            req.dbConnection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role], (error, results) => {
                if (error) throw error;

                req.dbConnection.query('SELECT email, name, createdAt, updatedAt, active FROM users WHERE id = ?', results.insertId, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        });
    } catch(e) {
        console.log("internal server error in create user", e);
    }
}

exports.UpdateAdminUser = async(req, res) => {
    try {
        const { id } = req.params;
        const {email, name, password, role} = req.body.data._value;

        const now = new Date();

        if (password && password.length) {
            req.dbConnection.query('UPDATE users SET email = ?, name = ?, password = ?, updatedAt = ?, role = ? WHERE id = ?', [email, name, password, now, role, id], (error, results) => {
                if (error) throw error;
        
                req.dbConnection.query('SELECT email, name, createdAt, updatedAt, role, active FROM users WHERE id = ?', id, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        } else {
            req.dbConnection.query('UPDATE users SET email = ?, name = ?, updatedAt = ?, role = ? WHERE id = ?', [email, name, now, role, id], (error, results) => {
                if (error) throw error;
        
                req.dbConnection.query('SELECT email, name, createdAt, updatedAt, role, active FROM users WHERE id = ?', id, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        }
    } catch (e) {
        console.log("internal server error in update user", e);
    }
}

exports.DeleteAdminUser = async(req, res) => {
    try {
        const { id } = req.params;

        req.dbConnection.query('UPDATE users SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch(e) {
        console.log("internal server error in delete user", e);
    }
}

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    req.dbConnection.query('SELECT * FROM users WHERE email = ? AND active = true', email, async (error, results) => {
        if (error) throw error;
    
        const user = results[0];

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
        res.json({ token: token, userId:  user.id });
    });

};