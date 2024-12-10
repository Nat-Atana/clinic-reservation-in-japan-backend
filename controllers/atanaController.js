exports.GetAtanas = async(req, res) => {
    try {
        const filter = req.query;
        const filterArray = Object.values(filter);
        console.log('here');
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
        
        req.dbConnection.query(`SELECT * FROM atanas${filterClause} ORDER BY sort ASC`, (error, results) => {
            if (error) throw error;
            atanas = results;

            req.dbConnection.query('SELECT id, name, session, content, created_at FROM atanas where 1', (error, results) => {
                if (error) throw error;
                clinics = results;

                return res.status(200).send({
                    atanas: atanas
                })
            });
        });
    } catch(e) {
        console.log("internal server error in get atanas", e);
    }
}