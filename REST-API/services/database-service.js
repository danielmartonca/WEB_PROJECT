const sql = require("mssql");
const config = {
    user: 'sa',
    password: 'LCy!@e^jr#G{<9<B',
    server: 'localhost',
    database: 'PetManager',
    trustServerCertificate: true
};

function registerUser(jsonAccount, response) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        const request = new sql.Request();
        request.query(`INSERT INTO Accounts values('${jsonAccount.name}','${jsonAccount.familyname}','${jsonAccount.email}','${jsonAccount.password}','${jsonAccount.gender}')`, function (err, recordset) {
            if (err) {
                console.log(err);
                response.end("not ok");
            } else {
                response.end("ok");
            }
        });
    });
}

module.exports.registerUser = registerUser;