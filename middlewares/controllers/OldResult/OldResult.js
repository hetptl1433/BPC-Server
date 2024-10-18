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

    // First, get the total count of matching records
    const countQuery = `
      SELECT COUNT(*) AS count
      FROM [bpcindia_db].[dbo].[ExamMaster]
      WHERE TestCategoryId = @id;
    `;

    const countRequest = new sql.Request();
    countRequest.input("id", sql.Int, id);
    const countResult = await countRequest.query(countQuery);
    const count = countResult.recordset[0].count;

    // Second, get the paginated result
const dataQuery = `
            SELECT em.[ExamId], 
                   em.[ExamUniqueCode], 
                   em.[ExamDateTime], 
                   em.[UserId], 
                   em.[TestGroupId], 
                   em.[TestCategoryId], 
                   em.[Language], 
                   em.[ATime], 
                   em.[ATimeInt], 
                   em.[ABy], 
                   em.[MTime], 
                   em.[MTimeInt], 
                   em.[MBy], 
                   em.[DTime], 
                   em.[DTimeInt], 
                   em.[DBy], 
                   em.[ActiveFlag], 
                   em.[IsActive], 
                   em.[TotalQuestion], 
                   em.[TotalTime], 
                   em.[TotalPoints],
                   um.[UserRegCode], 
                   um.[Name], 
                   um.[Email], 
                   um.[Mobile], 
                   um.[Address],
                   tcm.[TestCategoryName], 
                   tcm.[Description] 
            FROM [bpcindia_db].[dbo].[ExamMaster] AS em
            LEFT JOIN [bpcindia_db].[dbo].[UserMaster] AS um ON em.UserId = um.UserId
            LEFT JOIN [bpcindia_db].[dbo].[TestCategoryMaster] AS tcm ON em.TestCategoryId = tcm.TestCategoryId
            WHERE em.TestCategoryId = @id
            ORDER BY ${sorton} ${sortdir}
            OFFSET @skip ROWS
            FETCH NEXT @per_page ROWS ONLY;
`;


    const dataRequest = new sql.Request();
    dataRequest.input("id", sql.Int, id);
    dataRequest.input("skip", sql.Int, validSkip);
    dataRequest.input("per_page", sql.Int, validPerPage);

    const dataResult = await dataRequest.query(dataQuery);

    if (dataResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No records found." });
    }

    // Return both the data and the total count
    return res.status(200).json({
      // success: true,
      count: count,
      data: dataResult.recordset,
    });
  } catch (err) {
    console.error("SQL Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};




module.exports = { fetchExamMasterData };
