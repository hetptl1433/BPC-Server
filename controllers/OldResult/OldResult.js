const sql = require("mssql");
const ExamMasterModel = require("../../models/OldResult/OldResult");

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

// Controller function to fetch ExamMaster data by TestCategoryId
const fetchExamMasterData = async (req, res) => {
  const { id } = req.params;
  const {
    skip = 0,
    per_page = 10,
    sorton = "ExamDateTime",
    sortdir = "asc",
  } = req.body;

  const validSkip = Math.max(parseInt(skip, 10), 0);
  const validPerPage = parseInt(per_page, 10) || 10;

  try {
    await sql.connect(sqlConfig);

    const query = `
      SELECT [ExamId], [ExamUniqueCode], [ExamDateTime], [UserId], 
      [TestGroupId], [TestCategoryId], [Language], [ATime], [ATimeInt], [ABy], 
      [MTime], [MTimeInt], [MBy], [DTime], [DTimeInt], [DBy], [ActiveFlag], 
      [IsActive], [TotalQuestion], [TotalTime], [TotalPoints]
      FROM [bpcindia_db].[dbo].[ExamMaster]
      WHERE TestCategoryId = @id
      ORDER BY ${sorton} ${sortdir}
      OFFSET @skip ROWS
      FETCH NEXT @per_page ROWS ONLY;
    `;

    const request = new sql.Request();
    request.input("id", sql.Int, id);
    request.input("skip", sql.Int, validSkip);
    request.input("per_page", sql.Int, validPerPage);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No records found." });
    }

    return res.status(200).json(result.recordset);
  } catch (err) {
    console.error("SQL Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};




module.exports = { fetchExamMasterData };
