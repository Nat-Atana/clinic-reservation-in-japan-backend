const bcrypt = require('bcryptjs');

exports.GetUsers = async(req, res) => {
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
        
        req.dbConnection.query(`SELECT * FROM users${filterClause}`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get users", e);
    }
}

exports.CreateUser = async(req, res) => {
    try {
        const { name, email, password, role, menu } = req.body;
  
        req.dbConnection.query('SELECT * FROM users WHERE email = ?', email, async (error, results) => {
            if (error) throw error;
        
            const user = results[0];

            if (user) {
                return res.status(200).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            req.dbConnection.query('INSERT INTO users (name, email, password, role, menu) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, role, menu], (error, results) => {
                if (error) throw error;

                req.dbConnection.query('SELECT id, email, name, role, menu, createdAt, updatedAt, active FROM users WHERE id = ?', results.insertId, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        });
    } catch(e) {
        console.log("internal server error in create user", e);
    }
}

exports.UpdateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const {email, name, password, role} = req.body.data._value;

        const now = new Date();

        if (password && password.length) {
            const hashedPassword = await bcrypt.hash(password, 10);

            req.dbConnection.query('UPDATE users SET email = ?, name = ?, password = ?, role = ?, updatedAt = ? WHERE id = ?', [email, name, hashedPassword, role, now, id], (error, results) => {
                if (error) throw error;
        
                req.dbConnection.query('SELECT id, email, name, createdAt, updatedAt, role, menu, active FROM users WHERE id = ?', id, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        } else {
            req.dbConnection.query('UPDATE users SET email = ?, name = ?, role = ?, updatedAt = ? WHERE id = ?', [email, name, role, now, id], (error, results) => {
                if (error) throw error;
        
                req.dbConnection.query('SELECT id, email, name, createdAt, updatedAt, role, menu, active FROM users WHERE id = ?', id, async (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).json(results[0]);
                });
            });
        }
    } catch (e) {
        console.log("internal server error in update user", e);
    }
}

exports.DeleteUser = async(req, res) => {
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

exports.UpdateMenu = async(req, res) => {
    try {
        const { id } = req.params;
        
        const menu = JSON.stringify(req.body.data._value);

        const now = new Date();

        req.dbConnection.query('UPDATE users SET menu = ?, updatedAt = ? WHERE id = ?', [menu, now, id], (error, results) => {
            if (error) throw error;
    
            req.dbConnection.query('SELECT id, menu FROM users WHERE id = ?', id, async (error, results) => {
                if (error) throw error;
    
                return res.status(200).json(results[0]);
            });
        });
    } catch (e) {
        console.log("internal server error in update user", e);
    }
}