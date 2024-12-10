const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = 'password123';

function generateIv() {
    return crypto.randomBytes(16);
}
  
function generateKey(password) {
    return crypto.scryptSync(password, 'salt', 32);
}
  
function encrypt(text, password) {
    const iv = generateIv();
    const key = generateKey(password);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

const convertDateString = (dateString) => {
    const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
    const match = dateString.match(regex);

    if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0');
        const day = match[3].padStart(2, '0');

        return `${year}-${month}-${day}`;
    } else {
        throw new Error('Invalid date format');
    }
};

const convertTimeString = (timeString) => {
    const regex = /(\d{1,2}):(\d{1,2})/;
    const match = timeString.match(regex);

    if (match) {
        const hour = match[1].padStart(2, '0');
        const minute = match[2].padStart(2, '0');

        return `${hour}:${minute}`;
    } else {
        throw new Error('Invalid time format');
    }
};

const getDayOfWeek = (dateString) => {
    const daysInJapanese = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(dateString);
    return daysInJapanese[date.getDay()];
};

exports.Process = async(req, res) => {
    const {apiKey, apiType, apiAction, apiParam} = req.body;
    
    try {
        let response = {};
        if ( apiKey === "hogehoge" && apiType === "appointmentBookingSystem" ) {
            if ( apiAction === "fetch" ) {
                response = { department: {} };
                req.dbConnection.query(`SELECT clinics.id, clinics.title, doctors.id as doctor_id, doctors.name, doctors.sex FROM clinics LEFT JOIN doctors ON doctors.clinic = clinics.id WHERE clinics.active = 1 and doctors.active = 1 ORDER BY clinics.sort ASC, doctors.sort ASC`, (error, results) => {
                    if (error) throw error;
                    if ( results.length > 0 ) {
                        results.forEach(record => {
                            const departmentName = record.title;
                            if (!response.department[departmentName]) {
                                response.department[departmentName] = { doctors: [] };
                            }
                            
                            const doctorData = {
                                name: record.name,
                                id: record?.doctor_id || 0,
                                sex: record?.sex || ""
                            };
                        
                            response.department[departmentName].doctors.push(doctorData);
                        });
                    }

                    return res.status(200).send(response);
                });
            } else if ( apiAction === "search" ) {
                const {department, doctor_id, search_start_date, search_end_date, search_start_time, search_end_time} = apiParam;
                // let search_sdate = convertDateString(search_start_date);
                // let search_edate = convertDateString(search_end_date);
                let search_sdate = search_start_date;
                let search_edate = search_end_date;
                let search_stime = convertTimeString(search_start_time);
                let search_etime = convertTimeString(search_end_time);

                response = { err: null, result: [] };
                req.dbConnection.query(`SELECT id FROM clinics WHERE active = 1 and title = '${department}'`, (error, results) => {
                    if (error) throw error;
                    if ( results.length > 0 ) {
                        const depart_id = results[0]['id'];
                        let query = `SELECT * FROM frames WHERE active = 1 and clinic = ${depart_id} and date between '${search_sdate}' and '${search_edate}' and fromTime >= '${search_stime}' and toTime <= '${search_etime}'`;
                        if ( doctor_id > 0 )
                            query += ` and doctor = ${doctor_id}`;
                        query += ` order by date`;
                        
                        req.dbConnection.query(query, (error, results) => {
                            if (error) throw error;
                            if ( results.length > 0 ) {
                                const groupedByDate = results.reduce((acc, record) => {
                                    const { id, doctor, date, fromTime, toTime } = record;
                                    if (!acc[date]) {
                                        acc[date] = {
                                            date,
                                            day_of_week: getDayOfWeek(date),
                                            slots: [],
                                        };
                                    }
                                    acc[date].slots.push({
                                        id,
                                        start: fromTime.slice(0, 5),
                                        end: toTime.slice(0, 5),
                                        doctor,
                                    });
                                    return acc;
                                }, {});

                                response.result = Object.values(groupedByDate);
                                return res.status(200).send(response);
                            } else {
                                response.err = "no frame";
                                return res.status(200).send(response);
                            }
                        });
                    } else {
                        response.err = "no department";
                        return res.status(200).send(response);
                    }
                });
            } else if ( apiAction === "confirm" ) {
                const {id, patient} = apiParam;
                const {kana, gender, birthday, code} = patient;

                response = { err: null, reservation: {} };
                req.dbConnection.query(`SELECT id, clinic, availableReserve, remainReserve FROM frames WHERE active = 1 and id = '${id}'`, (error, results) => {
                    if (error) throw error;
                    if ( results.length > 0 ) {
                        frameInfo = results[0];
                        
                        req.dbConnection.query('SELECT COUNT(id) as reserveCnt FROM reservations WHERE active = 1 AND frame = ?', [id], (error, results) => {
                            if (error) throw error;
        
                            let reserveCnt = 0;
                            if ( results.length > 0 )
                                reserveCnt = results[0]['reserveCnt'];

                            if (frameInfo['availableReserve'] > reserveCnt) {
                                const now = new Date();
                                req.dbConnection.query('INSERT INTO reservations (patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                [
                                    kana, 
                                    kana, 
                                    gender, 
                                    birthday, 
                                    "", 
                                    "", 
                                    code, 
                                    "", 
                                    "",
                                    "",
                                    id, 
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
    
                                        const encryptedText = encrypt(JSON.stringify({id: id, name: kana, gender: gender, dob: birthday}), password);
    
                                        req.dbConnection.query(`SELECT id, webURL FROM clinics where id = ?`, [frameInfo['clinic']], (error, clinics) => {
                                            if (error) throw error;
    
                                            const webParam = clinics[0]['webURL'];
                                            const webURL = `${webBaseURL}?${webParam}&pinfo=${encryptedText}&reservationId=${reserveId}`;
    
                                            req.dbConnection.query('UPDATE reservations SET webURL = ? WHERE id = ?', [webURL, reserveId], (error, results) => {
                                                if (error) throw error;
                                    
                                                req.dbConnection.query('UPDATE frames SET remainReserve = ?, updatedAt = ? WHERE id = ?', [frameInfo['remainReserve'] - 1, now, id], (error, results) => {
                                                    if (error) throw error;
    
                                                    req.dbConnection.query('SELECT reservations.*, frames.room, frames.doctor, frames.clinic, frames.date, frames.fromTime, frames.toTime FROM reservations LEFT JOIN frames ON reservations.frame = frames.id WHERE reservations.id = ?', reserveId, async (error, results) => {
                                                        if (error) throw error;
                                                        response.reservation = results[0];
                                                        return res.status(200).send(response);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                response.err = "no empty";
                                return res.status(200).send(response);
                            }
                        });
                    } else {
                        response.err = "no frame";
                        return res.status(200).send(response);
                    }
                });
            } else {
                return res.status(200).send({err: "no api"});
            }
        }
    } catch (e) {
        console.log("internal server error in get phone api", e);
    }
}