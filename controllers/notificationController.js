exports.GetNotifications = async(req, res) => {
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

        req.dbConnection.query(`SELECT * FROM notifications${filterClause}`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get notifications", e);
    }
}

exports.CreateNotification = async(req, res) => {
    try {
        const {patientEmail, isNoti, webInterview1, webInterview2, exam1, exam2} = req.body.data._value;

        req.dbConnection.query('INSERT INTO notifications (patientEmail, isNoti, webInterview1, webInterview2, exam1, exam2) VALUES (?, ?, ?, ?, ?, ?)', [patientEmail, isNoti, webInterview1, webInterview2, exam1, exam2], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM notifications WHERE id = ?', results.insertId, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in create notification", e);
    }   
}

exports.UpdateNotification = async(req, res) => {
    try {
        const { id } = req.params;
        const {patientEmail, isNoti, webInterview1, webInterview2, exam1, exam2} = req.body.data._value;

        const now = new Date();

        req.dbConnection.query('UPDATE notifications SET patientEmail = ?, isNoti = ?, webInterview1 = ?, webInterview2 = ?, exam1 = ?, exam2 = ?, updatedAt = ? WHERE id = ?', [patientEmail, isNoti, webInterview1, webInterview2, exam1, exam2, now, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM notifications WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in update notification", e);
    }
}

exports.DeleteNotification = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM notifications WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE notifications SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch {
        console.log("internal server error in delete notification", e);
    }
}