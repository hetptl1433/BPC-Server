// controllers/resultSearchController.js
const sql = require("mssql");
const ResultSearchModel = require("../../models/OldResultSearch/OldResultSearch");

// SQL configuration (from your server.js credentials)
const sqlConfig = {
  user: "bpcindia_unn",
  password: "d^Je22s1^%$",
  database: "bpcindia_db",
  server: "173.212.206.37",
  port: 1533,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Controller function to fetch data
const fetchResultSearchModel = async (req, res) => {
  const { testCategoryId, industryId } = req.query;

  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);

    // Query for TestCategoryMasterModelList
    const testCategoryResult = await sql.query(`
      SELECT * FROM TestCategoryMaster WHERE TestCategoryId = 2
    `);
    console.log("dawdaw", testCategoryResult);

    // Query for IndustryList
    // const industryResult = await sql.query(`
    //   SELECT * FROM Industry WHERE IndustryId = ${industryId}
    // `);

    // Create the model with the fetched data
    const resultSearchModel = new ResultSearchModel(
      testCategoryId,
    //   industryId,
      testCategoryResult.recordset, // TestCategoryMasterModelList
    //   industryResult.recordset // IndustryList
    );

    // Return the model as JSON
    return res.status(200).json(resultSearchModel);
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { fetchResultSearchModel };
