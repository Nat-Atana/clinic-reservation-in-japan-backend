exports.GetSettings = async(req, res) => {
    try {
        req.dbConnection.query('SELECT * FROM settings', (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        }); 
    } catch(e) {
        console.log("internal server error in get settings", e);
    }
}

exports.UpdateSetting = async(req, res) => {
    try {
        const data = req.body;
        const datArray = Object.entries(data);

        datArray.map(item => {
            req.dbConnection.query('UPDATE settings SET value = ? WHERE field = ?', [item[1], item[0]], (error, results) => {
                if (error) throw error;
            });
        })

        return res.status(200).json({ message: "Update Success" });
    } catch(e) {
        console.log("internal server error in update setting", e);
    }   
}