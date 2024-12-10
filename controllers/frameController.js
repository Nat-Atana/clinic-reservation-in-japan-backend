exports.GetFrames = async(req, res) => {
    const filter = req.query;
    const filterArray = Object.values(filter);

    let filterClause = '';
    let firstFlag = true;
    // console.log(filterArray)

    if (filterArray.length) {
        filterClause += ' where'
        filterArray.map((item) => {
            // console.log(item)
            if (item.type === 'switch') {
                filterClause += ` ${item.name} ${item.value === 'false' ? '= 1' : 'in (0, 1)'}`;
            } else if (item.type === 'text') {
                filterClause += ` and ${item.name} = '%${item.value}%'`;
            } else if (item.type === 'date') {
                if (item.name === 'fromDate' && item.value !== "0000-00-00")
                    filterClause += ` and date >= '${item.value}'`;
                if (item.name === 'toDate' && item.value !== "0000-00-00")
                    filterClause += ` and date <= '${item.value}'`;
            } else if (item.type === 'time') {
                if (item.name === 'fromTime' && item.value !== "00:00")
                    filterClause += ` and fromTime >= '${item.value}'`;
                if (item.name === 'toTime' && item.value !== "00:00")
                    filterClause += ` and toTime <= '${item.value}'`;
            } else if (item.type === 'number' && item.value > 0) {
                filterClause += ` and ${item.name} = ${item.value}`;
                firstFlag = false;
            }
        })
    } else {
        filterClause = ' where active = 1';
    }

    let doctors, frames, rooms, clinics, holidays;    
    try {
        if ( firstFlag ) {
            const curDate = new Date().toISOString().slice(0, 10);
            filterClause += ` and date >= '${curDate}'`;

            req.dbConnection.query('SELECT id, name, clinic, active FROM rooms where 1 ORDER BY id', (error, results) => {
                if (error) throw error;
                rooms = results;
    
                if (rooms.length > 0) {
                    rooms.some(room => {
                        if ( room["active"] == 1) {
                            filterClause += ' and room = ' + room["id"];
                            return true;
                        }
                        return false;
                    });
                }
                // console.log(filterClause);
    
                req.dbConnection.query(`SELECT * FROM frames${filterClause}`, (error, results) => {
                    if (error) throw error;
                    frames = results;
            
                    req.dbConnection.query('SELECT id, title, active FROM clinics where 1', (error, results) => {
                        if (error) throw error;
                        clinics = results;
                        
                        req.dbConnection.query('SELECT id, name, clinic, active FROM doctors where 1', (error, results) => {
                            if (error) throw error;
                            doctors = results;

                            req.dbConnection.query('SELECT id, title, date FROM breakdays where active = 1', (error, results) => {
                                if (error) throw error;
                                holidays = results;

                                return res.status(200).send({
                                    doctors: doctors,
                                    clinics: clinics,
                                    frames: frames,
                                    rooms: rooms,
                                    holidays: holidays
                                })
                            });
                        });
                    });
                });
            });
        } else {
            req.dbConnection.query(`SELECT * FROM frames${filterClause}`, (error, results) => {
                if (error) throw error;

                return res.status(200).send({
                    frames: results,
                })
            });
        }        
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: "Fetch failed"
        })
    }
}

exports.GetFramesByRoom = async(req, res) => {
    let doctors, frames, rooms, clinics, holidays;
    const roomId = req.query.id;

    try {
        const curDate = new Date().toISOString().slice(0, 10);
        let filterClause = ' where active = 1 and room = ' + roomId + ` and date >= '${curDate}'`;

        req.dbConnection.query('SELECT id, name, clinic, active FROM rooms where 1 ORDER BY id', (error, results) => {
            if (error) throw error;
            rooms = results;

            req.dbConnection.query(`SELECT * FROM frames${filterClause}`, (error, results) => {
                if (error) throw error;
                frames = results;
        
                req.dbConnection.query('SELECT id, title, active FROM clinics where 1', (error, results) => {
                    if (error) throw error;
                    clinics = results;
                    
                    req.dbConnection.query('SELECT id, name, clinic, active FROM doctors where 1', (error, results) => {
                        if (error) throw error;
                        doctors = results;

                        req.dbConnection.query('SELECT id, title, date FROM breakdays where active = 1', (error, results) => {
                            if (error) throw error;
                            holidays = results;

                            return res.status(200).send({
                                doctors: doctors,
                                clinics: clinics,
                                frames: frames,
                                rooms: rooms,
                                holidays: holidays
                            })
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: "Fetch failed"
        })
    }
}

exports.CreateFrame = async(req, res) => {
    try {
        const {room, doctor, clinic, date, fromTime, toTime, availableReserve} = req.body.data._value;
        req.dbConnection.query('SELECT id FROM frames WHERE active = 1 AND room = ? AND date = ? AND ((fromTime <= ? AND toTime > ?) OR (fromTime < ? AND toTime >= ?) OR (fromTime >= ? AND toTime <= ?)) ORDER BY id', [room, date, fromTime, fromTime, toTime, toTime, fromTime, toTime], (error, results) => {
            if (error) throw error;

            if (results.length > 0)
                return res.status(200).json({ message: "Already Exist" });
            else {
                req.dbConnection.query('INSERT INTO frames (room, doctor, clinic, date, fromTime, toTime, availableReserve, remainReserve) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [room, doctor, clinic, date, fromTime, toTime, availableReserve, availableReserve], (error, results) => {
                    if (error) throw error;
        
                    req.dbConnection.query('SELECT * FROM frames WHERE id = ?', results.insertId, async (error, results) => {
                        if (error) throw error;
        
                        return res.status(200).json(results[0]);
                    });
                });
            }
        });
    } catch(e) {
        console.log("internal server error in create frame", e)
    }
}

exports.UpdateFrame = async(req, res) => {
    try {
        const { id } = req.params;
        const {room, doctor, clinic, date, fromTime, toTime, availableReserve} = req.body.data._value;
        
        const now = new Date();

        req.dbConnection.query('SELECT id FROM frames WHERE id != ? AND active = 1 AND room = ? AND date = ? AND ((fromTime <= ? AND toTime > ?) OR (fromTime < ? AND toTime >= ?) OR (fromTime >= ? AND toTime <= ?)) ORDER BY id', [id, room, date, fromTime, fromTime, toTime, toTime, fromTime, toTime], (error, results) => {
            if (error) throw error;

            if (results.length > 0)
                return res.status(200).json({ message: "Already Exist" });
            else {
                req.dbConnection.query('SELECT * FROM frames WHERE id = ?', id, async (error, results) => {
                    if (error) throw error;

                    let frameInfo = results[0];
                    const oldRemainReserve = frameInfo['remainReserve'];
                    const oldAvailReserve = frameInfo['availableReserve'];
                    const reserveCnt = oldAvailReserve - oldRemainReserve;

                    if (oldAvailReserve != oldRemainReserve && reserveCnt > availableReserve) {
                        return res.status(200).json({ message: "Can't Update" });
                    } else {
                        const remainReserve = Number(availableReserve) - Number(reserveCnt);
                        req.dbConnection.query('UPDATE frames SET room = ?, doctor = ?, clinic = ?, date = ?, fromTime = ?, toTime = ?, availableReserve = ?, remainReserve = ?, updatedAt = ? WHERE id = ?', [room, doctor, clinic, date, fromTime, toTime, availableReserve, remainReserve, now, id], (error, results) => {
                            if (error) throw error;
                
                            frameInfo['room'] = room;
                            frameInfo['doctor'] = doctor;
                            frameInfo['clinic'] = clinic;
                            frameInfo['date'] = date;
                            frameInfo['fromTime'] = fromTime;
                            frameInfo['toTime'] = toTime;
                            frameInfo['availableReserve'] = availableReserve;
                            frameInfo['remainReserve'] = remainReserve;
                            return res.status(200).json(frameInfo);
                        });
                    }
                });
            }
        });
    } catch(e) {
        console.log("internal server error in update frame", e);
    }
}

exports.DeleteFrame = async(req, res) => {
    try {
        const { id } = req.params;

        req.dbConnection.query('SELECT id FROM reservations where frame = ? and active = 1', [id], (error, results) => {
            if (error) throw error;

            if (results.length > 0)
                return res.status(200).json({ message: "Reservation Exist" });

            req.dbConnection.query('UPDATE frames SET active = 0 WHERE id = ?', [id], (error, results) => {
                if (error) throw error;

                return res.status(200).json({ message: "Delete Success" });
            });
        });
    } catch(e) {
        console.log("internal server error in delete frame", e);
    }
}

exports.CopyFrame = async(req, res) => {
    try {
        const {from, to, toggle, frames} = req.body;
        
        function addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        let weekToggle, holidays = [];
        if ( !toggle.includes('8') ) {
            holidays = await new Promise((resolve, reject) => {
                req.dbConnection.query(`SELECT date FROM breakdays WHERE date >= ? AND date <= ? AND active = 1`, [from, to], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (results.length > 0)
                            resolve(results.map(row => row.date));
                        else
                            resolve([]);
                    }
                });
            });
        }
        weekToggle = toggle.filter(num => num !== '8');

        const promises = [];
        for (let date = new Date(from); date <= new Date(to); date = addDays(date, 1)) {
            const copyDate = date.toISOString().slice(0, 10);
            // console.log("Copy Date => ", copyDate);
            // console.log("Real Date => ", date);
            // console.log("Week day => ", (date.getDay()).toString());
            if (!holidays.includes(copyDate) && weekToggle.includes(date.getDay().toString())) {
                if (frames.length > 0) {
                    for (let frame of frames) {
                        const promise = new Promise((resolve, reject) => {
                            req.dbConnection.query('SELECT id FROM frames WHERE active = 1 AND room = ? AND date = ? AND ((fromTime <= ? AND toTime > ?) OR (fromTime < ? AND toTime >= ?) OR (fromTime >= ? AND toTime <= ?)) ORDER BY id', [frame.room, copyDate, frame.fromTime, frame.fromTime, frame.toTime, frame.toTime, frame.fromTime, frame.toTime], (error, results) => {
                                if (error) throw reject(error);
        
                                if (results.length > 0)
                                    resolve(0);
                                else {
                                    // console.log("Insert Copy Date => ", copyDate);
                                    req.dbConnection.query('INSERT INTO frames (room, doctor, clinic, date, fromTime, toTime, availableReserve, remainReserve) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [frame.room, frame.doctor, frame.clinic, copyDate, frame.fromTime, frame.toTime, frame.availableReserve, frame.availableReserve], (error, results) => {
                                        if (error) throw reject(error);
                                        else resolve(results.insertId);
                                    });
                                }
                            });
                        });
                        promises.push(promise);
                    }
                }
            }
        }

        const insertIds = await Promise.all(promises);
        const filteredIds = insertIds.filter(num => num !== 0);
        if ( filteredIds.length > 0 ) {
            req.dbConnection.query('SELECT * FROM frames WHERE id IN (?) ORDER BY id', [filteredIds], (error, results) => {
                if (error)
                    throw error;
                else {
                    results = results.sort((a, b) => {
                        const aStartTime = new Date(a.date + " " + a.fromTime).getTime();
                        const bStartTime = new Date(b.date + " " + b.fromTime).getTime();
                        return aStartTime - bStartTime;
                    });
                    return res.status(200).json(results);
                }
            });
        } else {
            return res.status(200).json([]);
        }
    } catch(e) {
        console.log("internal server error in copy frame", e);
    }
}