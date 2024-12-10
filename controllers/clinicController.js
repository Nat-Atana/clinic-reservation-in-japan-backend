exports.GetClinics = async(req, res) => {
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
        
        req.dbConnection.query(`SELECT * FROM clinics${filterClause} ORDER BY sort ASC`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get clinics", e);
    }    
}

exports.CreateClinic = async(req, res) => {
    try {
        const {title, webURL, reserveDate, questionDate, isNoti, webInterview1, webInterview2, exam1, exam2, sort} = req.body.data._value;

        req.dbConnection.query('INSERT INTO clinics (title, webURL, reserveDate, questionDate, isNoti, webInterview1, webInterview2, exam1, exam2, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, webURL, reserveDate, questionDate, isNoti, webInterview1, webInterview2, exam1, exam2, sort], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM clinics WHERE id = ?', results.insertId, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch (e) {
        console.log("internal server error in create clinic", e);
    }
}

exports.UpdateClinic = async(req, res) => {
    try {
        const { id } = req.params;
        const {title, webURL, reserveDate, questionDate, isNoti, webInterview1, webInterview2, exam1, exam2, sort} = req.body.data._value;

        const now = new Date();

        req.dbConnection.query('UPDATE clinics SET title = ?, webURL = ?, reserveDate = ?, questionDate = ?, isNoti = ?, webInterview1 = ?, webInterview2 = ?, exam1 = ?, exam2 = ?, updatedAt = ?, sort = ? WHERE id = ?', [title, webURL, reserveDate, questionDate, isNoti, webInterview1, webInterview2, exam1, exam2, now, sort, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM clinics WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch (e) {
        console.log("internal server error in update clinic", e);
    }
}

exports.DeleteClinic = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM clinics WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE clinics SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch {
        console.log("internal server error in clinic delete", e);
    }
    
}