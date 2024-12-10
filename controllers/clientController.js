const { sendEmail } = require('./alertEmail.js');

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

// Decrypt function
function decrypt(encryptedText, password) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = generateKey(password);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function getDateAfterNDays(dateString, n) {
    // Step 1: Parse the given date
    const givenDate = new Date(dateString);
  
    // Step 2: Calculate the previous date
    // Subtract 'n' days from the given date
    givenDate.setDate(givenDate.getDate() + n);
  
    // Step 3: Format the resulting date
    const year = givenDate.getFullYear();
    const month = String(givenDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(givenDate.getDate()).padStart(2, '0');
  
    // Return the formatted date string
    return `${year}-${month}-${day}`;
}

exports.GetSetting = async(req, res) => {
    try {
        req.dbConnection.query(`SELECT * FROM settings where field = 'clinic' OR field = 'privacy' OR field = 'reservationDescription'`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error get client setting", e);
    }
}

exports.GetClinics = async(req, res) => {
    try {
        req.dbConnection.query(`SELECT id, title FROM clinics where active = 1`, (error, results) => {
            if (error) throw error;
            return res.status(200).send(results);
        });
    } catch(e) {
        console.log("internal server error in get clinics", e);
    }    
}

exports.GetReservations = async(req, res) => {
    try {
        const {id} = req.query;

        req.dbConnection.query(`SELECT * FROM frames where active = 1 AND date >= CURDATE() AND clinic = ${id}`, (error, results) => {
            if (error) throw error;
            let frames = results;

            req.dbConnection.query(`SELECT * FROM clinics where active = 1 AND id = ${id}`, (error, results) => {
                if (error) throw error;
                let clinic = results;

                req.dbConnection.query('SELECT id, title, date FROM breakdays where active = 1', (error, results) => {
                    if (error) throw error;
                    let holidays = results;

                    return res.status(200).send({
                        frames: frames,
                        clinic: clinic,
                        holidays: holidays
                    })
                })
            })
        });
    } catch (e) {
        console.log("internal server error in get client reservations", e);
    }
}

exports.GetReservationsByDate = async(req, res) => {
    try {
        const {id, selectedDate} = req.query;

        // req.dbConnection.query(`SELECT * FROM clinics where active = 1 AND id = ${id}`, (err, results) => {
        //     let clinic = results[0];

            // let condition = [];

            // for (let i = 0; i < clinic?.reserveDate; i++) {
            //     condition.push(getDateAfterNDays(selectedDate, i));
            // }

            // const formattedValues = condition.map(value => `'${value}'`).join(', ');
            // const queryCondition = `(${formattedValues})`;

            // req.dbConnection.query(`SELECT frames.id, frames.date, frames.fromTime, frames.toTime, frames.availableReserve, doctors.name FROM frames LEFT JOIN doctors ON frames.doctor = doctors.id where frames.active = 1 AND frames.clinic = ${id} AND frames.date IN ${queryCondition}`, (err, results) => {
            //     if (err) throw err;

            //     return res.status(200).status(200).send(results);
            // })

            req.dbConnection.query(`SELECT frames.id, frames.date, frames.fromTime, frames.toTime, frames.availableReserve, frames.remainReserve, doctors.name FROM frames LEFT JOIN doctors ON frames.doctor = doctors.id where frames.active = 1 AND frames.clinic = ${id} AND frames.date = '${selectedDate}' AND frames.remainReserve > 0`, (err, results) => {
                if (err) throw err;

                return res.status(200).send(results);
            })        
        // })
    } catch(e) {
        console.log("internal server error in get reservations by date for client", e);
    }
}

exports.GetFrame = async (req, res) => {
    try {
        const { id } = req.query;
        
        req.dbConnection.query(`SELECT * FROM settings where field in ('clinic', 'reservationNum', 'phone', 'email', 'zipCode', 'address', 'additionalInfo')`, (error, settings) => {
            req.dbConnection.query(`SELECT * FROM frames where active = 1 AND id = ${id}`, (error, results) => {
                if (error) throw error;
                return res.status(200).send({
                    settings: settings,
                    frames: results[0],
                })
            });
        });
        
    } catch(e) {
        console.log("internal server error in get clinics", e);
    }  
}

exports.Reserve = async (req, res) => {
    try {
        const {reserveData, frameId, clinicId} = req.body;
        const now = new Date();

        let frameInfo, reserveCnt;
        req.dbConnection.query('SELECT id, doctor, date, fromTime, availableReserve, remainReserve FROM frames WHERE id = ?', [frameId], (error, results) => {
            if (error) throw error;

            if ( results.length > 0 ) {
                frameInfo = results[0];

                req.dbConnection.query('SELECT COUNT(id) as reserveCnt FROM reservations WHERE active = 1 AND frame = ?', [frameId], (error, results) => {
                    if (error) throw error;

                    if ( results.length > 0 ) {
                        reserveCnt = results[0]['reserveCnt'];

                        if (frameInfo['availableReserve'] > reserveCnt) {
                            req.dbConnection.query('INSERT INTO reservations (patientName, patientFurigana, patientGender, patientDOB, patientPhone, patientEmail, patientZipCode, patientAddress, patientNote, medicalNum, frame, webURL, webInterviewStatus, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                            [
                                reserveData.clientName, 
                                reserveData.clientFurigana, 
                                reserveData.clientGender, 
                                reserveData.clientDOB, 
                                reserveData.phone, 
                                reserveData.email, 
                                reserveData.zipCode, 
                                reserveData.address, 
                                reserveData.additionalInfo,
                                reserveData.reservationNum,
                                frameId, 
                                "", 
                                "予約", 
                                now
                            ], (error, results) => {
                                if (error) throw error;

                                const reserveId = results.insertId;

                                req.dbConnection.query(`SELECT * FROM settings where field in ('webBaseURL', 'clinic', 'mailContent') ORDER BY id`, (error, settings) => {
                                    if (error) throw error;

                                    // console.log(settings);
                                    const webBaseUrlSetting = settings[1];
                                    let webBaseURL = webBaseUrlSetting.value;
                                    webBaseURL = (webBaseURL.slice(-1) === "/") ? webBaseURL.slice(0, -1) : webBaseURL;

                                    const encryptedText = encrypt(JSON.stringify({id: frameId, name: reserveData.clientName, gender: reserveData.clientGender, dob: reserveData.clientDOB}), password);

                                    req.dbConnection.query(`SELECT id, title, webURL, isNoti FROM clinics where id = ?`, [clinicId], (error, clinics) => {
                                        if (error) throw error;

                                        const clinicTitle = clinics[0]['title'];
                                        const webParam = clinics[0]['webURL'];
                                        const isNoti = clinics[0]['isNoti'];
                                        let webURL = "";
                                        if ( webParam.trim() == "" )
                                            webURL = `${webBaseURL}?pinfo=${encryptedText}&reservationId=${reserveId}`;
                                        else
                                            webURL = `${webBaseURL}?${webParam}&pinfo=${encryptedText}&reservationId=${reserveId}`;

                                        req.dbConnection.query('UPDATE reservations SET webURL = ? WHERE id = ?', [webURL, reserveId], (error, results) => {
                                            if (error) throw error;
                                
                                            req.dbConnection.query('UPDATE frames SET remainReserve = ?, updatedAt = ? WHERE id = ?', [frameInfo['remainReserve'] - 1, now, frameId], (error, results) => {
                                                if (error) throw error;

                                                if ( isNoti == 1 ) {
                                                    req.dbConnection.query(`SELECT id, name FROM doctors WHERE id = ${frameInfo['doctor']}`, (error, results) => {
                                                        if (error) throw error;

                                                        const newDate = new Date(frameInfo['date'] + " " + frameInfo['fromTime']);
                                                        const reserveDate = newDate.toLocaleDateString('ja-JP', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            weekday: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        });

                                                        const doctor = results[0]['name'];
                                                        const senderName = `${settings[0]['value']}予約システム`;
                                                        const webMailTitle = `【${settings[0]['value']}】web問診のご案内`;
                                                        const mailContent = `<html><head></head><body>${settings[2]['value'].replace(/\n/g, '<br>')
                                                            .replace('＠name＠', reserveData.clientName)
                                                            .replace('＠datetime＠', reserveDate)
                                                            .replace('＠depart＠', clinicTitle)
                                                            .replace('＠doctor＠', doctor)
                                                            .replace('＠patientnum＠', reserveData.reservationNum)
                                                            .replace('＠url＠', webURL)}</body></html>`;
                                                            
                                                        console.log(reserveData.email, " - ", senderName);
                                                        sendEmail(reserveData.email, senderName, webMailTitle, mailContent);
                                                    });
                                                }

                                                return res.status(200).send({webURL});
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
    } catch (e) {
        console.log("internal server error in making client reserve", e);
    }
}

exports.ReserveFinish = async (req, res) => {
    try {
        const {reservationId, apiKey} = req.body;

        console.log("Reservation Finish => ", reservationId);
        req.dbConnection.query(`SELECT id from reservations where id = ? AND webURL like ?`, [reservationId, "%" + apiKey + "%"], (error, reservations) => {
            if (error) throw error;

            if ( reservations.length > 0) {
                req.dbConnection.query('UPDATE reservations SET webInterviewStatus = "問診済" WHERE id = ?', [reservationId], (error, results) => {
                    if (error) throw error;
        
                    return res.status(200).send({message: "success"});
                });
            } else {
                return res.status(500).send({message: "failure"});
            }
        });
    } catch (e) {
        console.log("internal server error in making client reserve finish", e);
    }
}