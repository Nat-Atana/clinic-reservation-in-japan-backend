const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = 'password123'; // Use a secure password

// Generate a random initialization vector
function generateIv() {
  return crypto.randomBytes(16);
}

// Generate a key from the password
function generateKey(password) {
  return crypto.scryptSync(password, 'salt', 32);
}

// Encrypt function
function encrypt(text, password) {
  const iv = generateIv();
  const key = generateKey(password);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

exports.GetReservations = async(req, res) => {
    let doctors, rooms, clinics, frames, reservations, roomId;

    try {
        const filter = req.query;
        const filterArray = Object.values(filter);
        let filterClause = ''
        let firstFlag = true;

        if (filterArray.length > 0) {
            filterClause += ' where'
            filterArray.map((item) => {
                if (item.type === 'switch') {
                    filterClause += ` reservations.${item.name} ${item.value === 'false' ? '= 1' : 'in (0, 1)'}`;
                } else if (item.type === 'text') {
                    filterClause += ` and ${item.name} = '%${item.value}%'`;
                } else if (item.type === 'date') {
                    if (item.name === 'fromDate' && item.value !== "0000-00-00")
                        filterClause += ` and frames.date >= '${item.value}'`;
                    if (item.name === 'toDate' && item.value !== "0000-00-00")
                        filterClause += ` and frames.date <= '${item.value}'`;
                } else if (item.type === 'time') {
                    if (item.name === 'fromTime' && item.value !== "00:00")
                        filterClause += ` and frames.fromTime >= '${item.value}'`;
                    if (item.name === 'toTime' && item.value !== "00:00")
                        filterClause += ` and frames.toTime <= '${item.value}'`;
                } else if (item.type === 'number') {
                    filterClause += ` and ${item.name} = ${item.value}`;
                    firstFlag = false;
                }
            })
        } else {
            filterClause = ' where reservations.active = 1';
        }

        if ( firstFlag ) {
            const curDate = new Date().toISOString().slice(0, 10);
            filterClause += ` and frames.date >= '${curDate}'`;

            req.dbConnection.query('SELECT id, name, clinic, active FROM rooms where 1 ORDER BY id', (error, results) => {
                if (error) throw error;
                rooms = results;
    
                if (rooms.length > 0) {
                    rooms.some(room => {
                        if ( room["active"] == 1) {
                            roomId = room["id"];
                            filterClause += ' and room = ' + roomId;
                            return true;
                        }
                        return false;
                    });
                }
                // console.log(filterClause)

                req.dbConnection.query(`SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id ${filterClause}`, (error, results) => {
                    if (error) throw error;
                    reservations = results;    
                            
                    req.dbConnection.query('SELECT id, title, active FROM clinics where 1', (error, results) => {
                        if (error) throw error;
                        clinics = results;
                        
                        req.dbConnection.query('SELECT id, name, clinic, active FROM doctors where 1', (error, results) => {
                            if (error) throw error;
                            doctors = results;

                            return res.status(200).send({
                                doctors: doctors,
                                clinics: clinics,
                                rooms: rooms,
                                reservations: reservations
                            })
                        });
                    });
                });
            });
        } else {
            // console.log(filterClause)
            req.dbConnection.query(`SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id ${filterClause}`, (error, results) => {
                if (error) throw error;
                reservations = results;

                return res.status(200).send({
                    reservations: reservations,
                    frames: frames
                })
            });
        }
    } catch(e) {
        console.log("internal server error in get reservations", e);
    }
}

exports.GetReservationsByFrame = async(req, res) => {
    let doctors, rooms, clinics, reservations, frame;
    const frameId = req.query.id;

    try {
        let filterClause = ' where reservations.active = 1 and frame = ' + frameId;
        
        req.dbConnection.query(`SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id ${filterClause}`, (error, results) => {
            if (error) throw error;
            reservations = results;

            req.dbConnection.query('SELECT id, name, clinic, active FROM rooms where 1 ORDER BY id', (error, results) => {
                if (error) throw error;
                rooms = results;            
                    
                req.dbConnection.query('SELECT id, title, active FROM clinics where 1', (error, results) => {
                    if (error) throw error;
                    clinics = results;
                    
                    req.dbConnection.query('SELECT id, name, clinic, active FROM doctors where 1', (error, results) => {
                        if (error) throw error;
                        doctors = results;

                        req.dbConnection.query('SELECT * FROM frames where id = ?', frameId, (error, results) => {
                            if (error) throw error;
                            frame = results[0];

                            return res.status(200).send({
                                doctors: doctors,
                                clinics: clinics,
                                rooms: rooms,
                                reservations: reservations,
                                frame: frame
                            })
                        });
                    });
                    
                });
            });
        });
    } catch(e) {
        console.log("internal server error in get reservations", e);
    }
}

exports.GetFrames = async(req, res) => {
    const { roomId } = req.query;    

    req.dbConnection.query('SELECT id, room, doctor, clinic, date, fromTime, toTime, availableReserve, remainReserve FROM frames WHERE active = 1 AND room = ? AND date >= CURDATE() AND remainReserve > 0 ORDER BY doctor, date, fromTime, toTime', roomId, (error, results) => {
        if (error) throw error;
        
        return res.status(200).send({
            frames: results
        })
    });
}

exports.CreateReservation = async(req, res) => {
    try {
        const now = new Date();

        const {patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus, clinic} = req.body.data._value;

        let frameInfo, reserveCnt;
        req.dbConnection.query('SELECT id, availableReserve, remainReserve FROM frames WHERE id = ?', [frame], (error, results) => {
            if (error) throw error;

            if ( results.length > 0 ) {
                frameInfo = results[0];

                req.dbConnection.query('SELECT COUNT(id) as reserveCnt FROM reservations WHERE active = 1 AND frame = ?', [frame], (error, results) => {
                    if (error) throw error;

                    if ( results.length > 0 ) {
                        reserveCnt = results[0]['reserveCnt'];

                        if (frameInfo['availableReserve'] > reserveCnt) {
                            req.dbConnection.query('INSERT INTO reservations (patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                            [
                                patientName, 
                                patientFurigana, 
                                patientGender, 
                                patientDOB, 
                                patientPhone, 
                                patientEmail, 
                                patientZipCode, 
                                patientAddress, 
                                patientNote,
                                medicalNum,
                                frame, 
                                "", 
                                "予約", 
                                now
                            ], (error, results) => {
                                if (error) throw error;

                                const reserveId = results.insertId;

                                req.dbConnection.query(`SELECT * FROM settings where field in ('webBaseURL')`, (error, settings) => {
                                    if (error) throw error;

                                    const webBaseUrlSetting = settings[0];
                                    let webBaseURL = webBaseUrlSetting.value;
                                    webBaseURL = (webBaseURL.slice(-1) === "/") ? webBaseURL.slice(0, -1) : webBaseURL;

                                    const encryptedText = encrypt(JSON.stringify({id: frame, name: patientName, gender: patientGender, dob: patientDOB}), password);

                                    req.dbConnection.query(`SELECT id, webURL FROM clinics where id = ?`, [clinic], (error, clinics) => {
                                        if (error) throw error;

                                        const webParam = clinics[0]['webURL'];
                                        const webURL = `${webBaseURL}?${webParam}&pinfo=${encryptedText}&reservationId=${reserveId}`;

                                        req.dbConnection.query('UPDATE reservations SET webURL = ? WHERE id = ?', [webURL, reserveId], (error, results) => {
                                            if (error) throw error;
                                
                                            req.dbConnection.query('UPDATE frames SET remainReserve = ?, updatedAt = ? WHERE id = ?', [frameInfo['remainReserve'] - 1, now, frame], (error, results) => {
                                                if (error) throw error;

                                                req.dbConnection.query('SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id WHERE reservations.id = ?', reserveId, async (error, results) => {
                                                    if (error) throw error;
                                    
                                                    return res.status(200).json(results[0]);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        } else
                            return res.status(200).send({message: "Invalid Frame"});
                    }  else
                        return res.status(200).send({message: "Invalid Frame"});
                });
            } else
                return res.status(200).send({message: "Invalid Frame"});
        });
    } catch(e) {
        console.log("internal server error in create reservation", e);
    }
}

exports.UpdateReservation = async(req, res) => {
    try {
        const { id } = req.params;
        const {patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus} = req.body.data._value;

        const now = new Date();
        req.dbConnection.query('SELECT frame FROM reservations WHERE id = ?', id, async (error, results) => {
            if (error) throw error;

            const prev_frame = results[0]['frame'];

            req.dbConnection.query('UPDATE reservations SET patientName = ?, patientFurigana = ?, patientGender = ?, patientDOB = ?, patientPhone = ?, patientEmail = ?, patientZipCode = ?, patientAddress = ?, patientNote = ?, medicalNum = ?, frame = ?, webURL = ?, webInterviewStatus = ?, updatedAt = ? WHERE id = ?', [patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus, now, id], (error, results) => {
                if (error) throw error;

                if (Number(prev_frame) != Number(frame)) {
                    req.dbConnection.query('UPDATE frames SET remainReserve = remainReserve - 1, updatedAt = ? WHERE id = ?', [now, frame], (error, results) => {
                        // if (error) throw error;
                    });

                    req.dbConnection.query('UPDATE frames SET remainReserve = remainReserve + 1, updatedAt = ? WHERE id = ?', [now, prev_frame], (error, results) => {
                        // if (error) throw error;
                    });
                }
    
                req.dbConnection.query('SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id WHERE reservations.id = ?', id, async (error, results) => {
                    if (error) throw error;
    
                    return res.status(200).json(results[0]);
                });
            });
        });
        
    } catch(e) {
        console.log("internal server error in update reservation", e);
    }
}

exports.DeleteReservation = async(req, res) => {
    try {
        const { id } = req.params;

        // req.dbConnection.query('DELETE FROM reservations WHERE id = ?', [id], (error, results) => {
        //     if (error) throw error;

        //     res.status(200).json({ message: "Delete Success" });
        // });

        req.dbConnection.query('SELECT * FROM reservations WHERE id = ?', id, async (error, results) => {
            if (error) throw error;

            const frameId = results[0]['frame'];
            
            req.dbConnection.query('UPDATE reservations SET active = 0 WHERE id = ?', [id], (error, results) => {
                if (error) throw error;
    
                req.dbConnection.query('SELECT * FROM frames WHERE id = ?', frameId, async (error, results) => {
                    if (error) throw error;

                    const remainReserve = results[0]['remainReserve'];

                    req.dbConnection.query('UPDATE frames SET remainReserve = ? WHERE id = ?', [Number(remainReserve) + 1, frameId], (error, results) => {
                        if (error) throw error;

                        return res.status(200).json({ message: "Delete Success" });
                    });
                });
            });
        });
    } catch(e) {
        console.log("internal server error in delete reservation", e);
    }
}