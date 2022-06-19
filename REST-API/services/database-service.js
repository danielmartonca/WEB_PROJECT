const sql = require("mssql");
const config = {
    user: 'sa', password: 'LCy!@e^jr#G{<9<B', server: 'localhost', database: 'PetManager', trustServerCertificate: true
};

async function executeQuery(sqlQuery) {
    try {
        const connectionPool = await sql.connect(config);
        console.log(`Executing query ${sqlQuery}.`)
        let result = await connectionPool.request().query(sqlQuery)
        console.log(`Got result:${'\n' + JSON.stringify(result)}\n`)
        return result;
    } catch (e) {
        console.log(`Error while executing query ${sqlQuery}.Errors is:\n${e}\n`);
        return null;
    }
}

async function accountExistsByEmail(email) {
    const result = await executeQuery(`SELECT * FROM Accounts WHERE EmailAddress='${email}'`);
    return result.recordset.length !== 0;
}

async function registerAccount(jsonAccount) {
    const result = await executeQuery(`INSERT INTO Accounts values('${jsonAccount.name}','${jsonAccount.familyname}','${jsonAccount.email}','${jsonAccount.password}','${jsonAccount.gender}')`);
    return result !== null;
}

module.exports.accountExistsByEmail = accountExistsByEmail;
module.exports.registerAccount = registerAccount;