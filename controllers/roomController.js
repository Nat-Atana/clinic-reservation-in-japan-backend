exports.GetRooms = async(req, res) => {
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
        
        req.dbConnection.query(`SELECT * FROM rooms${filterClause} ORDER BY sort ASC`, (error, results) => {
            if (error) throw error;
            rooms = results;

            req.dbConnection.query('SELECT id, title, active FROM clinics where 1', (error, results) => {
                if (error) throw error;
                clinics = results;

                return res.status(200).send({
                    rooms: rooms,
                    clinics: clinics
                })
            });
        });
    } catch(e) {
        console.log("internal server error in get rooms", e);
    }
}

exports.GetRoomsByClinic = async(req, res) => {
    try {
        let rooms = [];
        let clinics = [];

        const clinicId = req.query.id;

        req.dbConnection.query('SELECT * FROM rooms WHERE clinic = ? AND active = 1', [clinicId], (error, results) => {
            if (error) throw error;
            rooms = results;

            req.dbConnection.query('SELECT id, title FROM clinics where active = 1', (error, results) => {
                if (error) throw error;
                clinics = results;

                return res.status(200).send({
                    rooms: rooms,
                    clinics: clinics
                })
            });
        });
    } catch(e) {
        console.log("internal server error in get rooms by clinic", e);
    } 
}

exports.CreateRoom = async(req, res) => {
    try {
        const {clinic, name, sort} = req.body.data._value;

        req.dbConnection.query('INSERT INTO rooms (clinic, name, sort) VALUES (?, ?, ?)', [clinic, name, sort], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM rooms WHERE id = ?', results.insertId, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in create room", e);
    }
}

exports.UpdateRoom = async(req, res) => {
    try {
        const { id } = req.params;
        const {clinic, name, sort, reserveLink} = req.body.data._value;

        const now = new Date();

        req.dbConnection.query('UPDATE rooms SET clinic = ?, name = ?, sort = ?, updatedAt = ? WHERE id = ?', [clinic, name, sort, now, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM rooms WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in update room", e);
    }
}

exports.DeleteRoom = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM rooms WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE rooms SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch(e) {
        console.log("internal server error in delete room", e);
    }
}