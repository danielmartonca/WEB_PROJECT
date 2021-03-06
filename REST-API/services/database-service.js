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

async function getAccountByEmailAndPassword(email, password) {
    const result = await executeQuery(`SELECT * FROM Accounts WHERE EmailAddress='${email}' AND Password='${password}'`);
    if (result.recordset.length !== 0) return result.recordset[0];
    return null;
}


async function createPetDetails(jsonAccount) {
    const result = await executeQuery(`DECLARE @account_id int=(SELECT id from [Accounts] where [EmailAddress]='${jsonAccount.email}' and [Password]='${jsonAccount.password}');
    INSERT INTO [Details] VALUES(null,null,null,null,null,@account_id,null)`);
    return result !== null;
}

async function accountExistsByCredentials(email, password) {
    const result = await executeQuery(`SELECT * FROM Accounts WHERE EmailAddress='${email}' AND Password='${password}'`);
    return result.recordset.length !== 0;
}

async function getPetDetails(email, password) {
    const result = await executeQuery(`SELECT * FROM Details WHERE AccountId=(SELECT ID FROM Accounts WHERE EmailAddress='${email}' AND Password='${password}')`);
    if (result.recordset.length > 0) return result.recordset[0];
    return null;
}

async function updatePetDetails(email, password, petDetails) {
    const result = await executeQuery(`DECLARE @account_id int=(SELECT id from [Accounts] where [EmailAddress]='${email}' and [Password]='${password}');
    UPDATE [Details] SET Size='${petDetails.Size}',HealthStatus='${petDetails.HealthStatus}',PrefferedFood='${petDetails.PrefferedFood}',Age='${petDetails.Age}',Breed='${petDetails.Breed}',DateOfBirth='${petDetails.DateOfBirth}'
    WHERE [AccountId]=@account_id;`);
    return result.rowsAffected[1] !== 0;
}

async function getMealPlan(email, password, dayOfWeek) {
    const result = await executeQuery(`DECLARE @account_id int=(SELECT id from [Accounts] where [EmailAddress]='${email}' and [Password]='${password}');
    SELECT [Meal],[Food],[HasEaten] FROM [MealPlanner] WHERE [AccountId]=@account_id AND [DayOfWeek]='${dayOfWeek}';`);
    let obj = {};
    for (let i = 0; i < result.recordset.length; i++) {
        let record = result.recordset[i];
        obj[record.Meal] = {
            'food': record.Food,
            'hasEaten': record.HasEaten
        }
    }
    return result.recordset;
}

async function updateMealPlan(email, password, dayOfWeek, meal, food, hasEaten) {
    if (food === "") return;
    const result = await executeQuery(`DECLARE @account_id int=(SELECT id from [Accounts] where [EmailAddress]='${email}' and [Password]='${password}');
    DELETE FROM [MealPlanner] WHERE [AccountId]=@account_id AND [DayOfWeek]='${dayOfWeek}';
    Insert INTO [MealPlanner] Values (@account_id,'${dayOfWeek}','${meal}','${food}','${hasEaten}}');`);
    if (result === null) {
        console.error("Failed to update meal plan");
        return null;
    }
    console.log(`Meal plan updated successfully for ${dayOfWeek} ${meal}`)
    return true;
}

module.exports.accountExistsByEmail = accountExistsByEmail;
module.exports.registerAccount = registerAccount;
module.exports.getAccountByEmailAndPassword = getAccountByEmailAndPassword;
module.exports.createPetDetails = createPetDetails;
module.exports.accountExistsByCredentials = accountExistsByCredentials;
module.exports.getPetDetails = getPetDetails;
module.exports.updatePetDetails = updatePetDetails;
module.exports.getMealPlan = getMealPlan;
module.exports.updateMealPlan = updateMealPlan;
