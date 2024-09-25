const sql = require("mssql");
const ExamMasterModel = require("../../models/OldResultData/OldResultData");
const { use } = require("../../routes/OldResult");

// SQL configuration (reuse your existing credentials)
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

// Controller to fetch ExamMaster data
const fetchExamMasterData = async (req, res) => {
  const { examId, userId } = req.params;

  console.log(examId, userId)
  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);

    // Fetch exam data based on examId and userId
    const result = await sql.query(`
      SELECT * FROM ExamMaster 
      WHERE TestCategoryId= ${examId} AND UserId = ${userId}
    `);

    console.log(result.recordset);
    // Check if data is found
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam found for the provided examId and userId",
      });
    }

    const examData = result.recordset[0];

    // Create the ExamMasterModel object
    // const examMaster = new ExamMasterModel(
    //   examData.examId,
    //   examData.examUniqueCode,
    //   examData.examDateTime,
    //   examData.userId,
    //   examData.testGroupId,
    //   examData.testCategoryId,
    //   examData.language,
    //   examData.aTime,
    //   examData.aTimeInt,
    //   examData.aBy,
    //   examData.mTime,
    //   examData.mTimeInt,
    //   examData.mBy,
    //   examData.dTime,
    //   examData.dTimeInt,
    //   examData.dBy,
    //   examData.activeFlag,
    //   examData.isActive,
    //   examData.totalQuestion,
    //   examData.totalTime,
    //   examData.totalPoints
    // );

    // Return the examMaster model as JSON response
    return res.status(200).json(examData);
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const fetchUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);

    // Create a new request
    const request = new sql.Request();

    // Declare the parameter
    request.input("userId", sql.Int, userId);

    // Fetch user data based on userId
    const result = await request.query(`
      SELECT TOP (1000) [UserId]
          ,[UserGroupId]
          ,[UserRegCode]
          ,[Name]
          ,[Email]
          ,[Mobile]
          ,[Landline]
          ,[Address]
          ,[Username]
          ,[Password]
          ,[IndustryId]
          ,[ATime]
          ,[ATimeInt]
          ,[ABy]
          ,[MTime]
          ,[MTimeInt]
          ,[MBy]
          ,[DTime]
          ,[DTimeInt]
          ,[DBy]
          ,[ActiveFlag]
          ,[IsActive]
      FROM [bpcindia_db].[dbo].[UserMaster]
      WHERE UserId = @userId
    `);

    console.log(result.recordset);
    // Check if data is found
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user found for the provided userId",
      });
    }

    const userData = result.recordset[0];

    // Return the user data as JSON response
    return res.status(200).json(userData);
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const fetchTestCategoryData = async (req, res) => {
  const { testCategoryId } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);

    // Create a new request
    const request = new sql.Request();

    // Declare the parameter
    request.input("testCategoryId", sql.Int, testCategoryId);

    // Fetch test category data based on TestCategoryId
    const result = await request.query(`
      SELECT TOP (1000) [TestCategoryId]
          ,[TestGroupId]
          ,[TestCategoryName]
          ,[TotalQuestion]
          ,[TotalTime]
          
      FROM [bpcindia_db].[dbo].[TestCategoryMaster]
      WHERE TestCategoryId = @testCategoryId
    `);

    console.log(result.recordset);

    // Check if data is found
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No test category found for the provided testCategoryId",
      });
    }

    const testCategoryData = result.recordset[0];

    // Return the test category data as JSON response
    return res.status(200).json(testCategoryData);
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const fetchAllPoint = async (req, res) => {
  const { testCategoryId } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);

    // Create a new request
    const request = new sql.Request();

    // Declare the parameter
    request.input("testCategoryId", sql.Int, testCategoryId);

    // Fetch points data based on TestCategoryId
    const query = `
      SELECT TOP (1000) [PointId]
          ,[PointCategoryId]
          ,[TestGroupId]
          ,[TestCategoryId]
          ,[Title]
          ,[Name]
          ,[Points]
          ,[ATime]
          ,[ATimeInt]
          ,[ABy]
          ,[MTime]
          ,[MTimeInt]
          ,[MBy]
          ,[DTime]
          ,[DTimeInt]
          ,[DBy]
          ,[ActiveFlag]
          ,[IsActive]
      FROM [bpcindia_db].[dbo].[PointsMaster]
      WHERE TestCategoryId = @testCategoryId
    `;
    const result = await request.query(query);

    // Return the points data as JSON response
    return res.status(200).json({
      success: true,
      pointsData: result.recordset,
    });
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const fetchExamDetailData = async (req, res) => {
  const { userId, testCategoryId } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    // Declare the parameters
    request.input("userId", sql.Int, userId);
    request.input("testCategoryId", sql.Int, testCategoryId);

    // SQL query to fetch data by UserId and TestCategoryId, joining PointsMaster
    const query = `
      SELECT 
          EDM.[ExamDetailId],
          EDM.[ExamId],
          EDM.[UserId],
          EDM.[TestGroupId],
          EDM.[TestCategoryId],  -- From ExamDetailMaster
          EDM.[TestQuestionId],
          EDM.[Answer],
          EDM.[PointGain] AS PointGainFromExamDetail,
          PM.[PointId],  -- Matched from PointsMaster
          PM.[Title],
          PM.[Name],
          PM.[Points] AS PointFromMaster,  -- Points from PointsMaster
          EDM.[ATime],
          EDM.[ABy],
          EDM.[IsActive]
      FROM 
          [bpcindia_db].[dbo].[ExamDetailMaster] EDM
      LEFT JOIN 
          [bpcindia_db].[dbo].[PointsMaster] PM
      ON EDM.[PointGain] = PM.[PointId]  -- Join on PointGain and PointId
      WHERE 
          EDM.[UserId] = @userId  -- Filter by UserId
          AND EDM.[TestCategoryId] = @testCategoryId;  -- Filter by TestCategoryId
    `;

    // Execute the query
    const result = await request.query(query);

    // If no data is found, send a 404 response
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No exam details found for the provided UserId and TestCategoryId",
      });
    }

    // Send the fetched data in the response
    return res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    console.error("SQL Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};








module.exports = { fetchExamDetailData, fetchExamMasterData , fetchAllPoint, fetchTestCategoryData, fetchUserData};
