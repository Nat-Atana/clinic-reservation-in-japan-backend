exports.GetBreakdays = async(req, res) => {
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
        
        req.dbConnection.query(`SELECT * FROM breakdays${filterClause}`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in GetBreakday", e);
    }
        
}

exports.CreateBreakday = async(req, res) => {
    try {
        const {title, date} = req.body;

        req.dbConnection.query('INSERT INTO breakdays (title, date) VALUES (?, ?)', [title, date], (error, results) => {
            if (error) throw error;

            const now = new Date();

            const createdBreakday = {
                id: results.insertId, // The ID generated for the new row
                title: title,
                date: date,
                createdAt: now,
                updatedAt: now,
                active: 1
            };
        
            return res.status(201).json(createdBreakday);
        });
    } catch(e) {
        console.log("internal server error in create breakday", e)
    }
}

exports.UpdateBreakday = async(req, res) => {
    try {
        const { id } = req.params;
        const {title, date} = req.body;

        const now = new Date();

        req.dbConnection.query('UPDATE breakdays SET title = ?, date = ?, updatedAt = ? WHERE id = ?', [title, date, now, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM breakdays WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in update breakday", e)
    }
}

exports.DeleteBreakday = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM breakdays WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE breakdays SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch(e) {
        console.log("internal server error in delete breakday", e);
    }
}