// controllers/testCategoryController.js
const sql = require("mssql");
const TestCategoryMasterModel = require("../../models/OldTestCategory.js/OldTestCategory");

// SQL configuration
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

// Fetch top 1000 records from TestCategoryMaster
const fetchTestCategories = async (req, res) => {
  try {
    await sql.connect(sqlConfig);

    const result = await sql.query(`
      SELECT  [TestCategoryId], [TestGroupId], [TestCategoryName], [TotalQuestion], 
      [TotalTime], [IsActive]
      FROM [bpcindia_db].[dbo].[TestCategoryMaster]
    `);

    const testCategories = result.recordset.map(
      (row) => new TestCategoryMasterModel(row)
    );

    res.status(200).json({
      success: true,
      data: testCategories,
    });
  } catch (error) {
    console.error("Error fetching TestCategoryMaster data:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { fetchTestCategories };
