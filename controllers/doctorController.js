exports.GetDoctors = async(req, res) => {

    try {
        const filter = req.query;
        const filterArray = Object.values(filter);

        let doctors = [];
        let clinics = [];

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

        req.dbConnection.query(`SELECT * FROM doctors${filterClause}`, (error, results) => {
            if (error) throw error;
            doctors = results;

            req.dbConnection.query('SELECT id, title, active FROM clinics where 1 ORDER BY sort ASC', (error, results) => {
                if (error) throw error;
                clinics = results;

                return res.status(200).send({
                    doctors: doctors,
                    clinics: clinics
                })
            });
        });
    } catch (e) {
        console.log("internal server error in get doctors", e);
    }
}

exports.CreateDoctor = async(req, res) => {
    try {
        const {clinic, name, furigana, sex, sort} = req.body.data._value;

        req.dbConnection.query('INSERT INTO doctors (clinic, name, furigana, sex, sort) VALUES (?, ?, ?, ?, ?)', [clinic, name, furigana, sex, sort], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM doctors WHERE id = ?', results.insertId, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch {
        console.log("internal server error in create doctor", e);
    }
}

exports.UpdateDoctor = async(req, res) => {
    try {
        const { id } = req.params;
        const {clinic, name, furigana, sex, sort} = req.body.data._value;

        const now = new Date();

        req.dbConnection.query('UPDATE doctors SET clinic = ?, name = ?, furigana = ?, sex = ?, sort = ?, updatedAt = ? WHERE id = ?', [clinic, name, furigana, sex, sort, now, id], (error, results) => {
            if (error) throw error;

            req.dbConnection.query('SELECT * FROM doctors WHERE id = ?', id, async (error, results) => {
                if (error) throw error;

                return res.status(200).json(results[0]);
            });
        });
    } catch(e) {
        console.log("internal server error in update doctor", e);
    }
}

exports.DeleteDoctor = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM doctors WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('UPDATE doctors SET active = 0 WHERE id = ?', [id], (error, results) => {
            if (error) throw error;

            return res.status(200).json({ message: "Delete Success" });
        });
    } catch {
        console.log("internal server error in delete doctor", e);
    }
}