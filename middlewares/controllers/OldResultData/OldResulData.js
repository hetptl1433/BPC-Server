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
      SELECT  [TestCategoryId]
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
    EDM.[TestCategoryId],  
    EDM.[TestQuestionId],
    EDM.[Answer],
    EDM.[PointGain] AS PointGainFromExamDetail,
    PM.[PointId],  
    PM.[Title],
    PM.[Name],
    PM.[Points] AS PointFromMaster,  
    PCM.[PointCategoryId],  
    PCM.[PointCategoryName],  
    PCM.[ATime] AS PointCategoryATime,
    PCM.[ATimeInt] AS PointCategoryATimeInt,
    PCM.[ABy] AS PointCategoryABy,
    PCM.[MTime] AS PointCategoryMTime,
    PCM.[MTimeInt] AS PointCategoryMTimeInt,
    PCM.[MBy] AS PointCategoryMBy,
    PCM.[DTime] AS PointCategoryDTime,
    PCM.[DTimeInt] AS PointCategoryDTimeInt,
    PCM.[DBy] AS PointCategoryDBy,
    PCM.[ActiveFlag] AS PointCategoryActiveFlag,
    PCM.[IsActive] AS PointCategoryIsActive,
    EDM.[ATime],
    EDM.[ABy],
    EDM.[IsActive],
    TQM.[TestQuestionId],
    TQM.[TestGroupId] AS TestQuestionGroupId,
    TQM.[QuestionType],
    TQM.[AnswerType],
    TQM.[EnglishQuestion],
    TQM.[HindiQuestion],
    TQM.[GujaratiQuestion],
    TQM.[EnglishAnsA],
    TQM.[HindiAnsA],
    TQM.[GujaratiAnsA],
    TQM.[PointAnsA],
    TQM.[EnglishAnsB],
    TQM.[HindiAnsB],
    TQM.[GujaratiAnsB],
    TQM.[PointAnsB],
    TQM.[EnglishAnsC],
    TQM.[HindiAnsC],
    TQM.[GujaratiAnsC],
    TQM.[PointAnsC],
    TQM.[EnglishAnsD],
    TQM.[HindiAnsD],
    TQM.[GujaratiAnsD],
    TQM.[PointAnsD],
    TQM.[EnglishAnsE],
    TQM.[HindiAnsE],
    TQM.[GujaratiAnsE],
    TQM.[PointAnsE],
    TQM.[CorrectAns],
    TQM.[SelectedAnswer],
    TQM.[SrNo],
    TQM.[ATime] AS TestQuestionATime,
    TQM.[ABy] AS TestQuestionABy,
    TQM.[MTime] AS TestQuestionMTime,
    TQM.[MBy] AS TestQuestionMBy,
    TQM.[DTime] AS TestQuestionDTime,
    TQM.[DBy] AS TestQuestionDBy,
    TQM.[ActiveFlag] AS TestQuestionActiveFlag,
    TQM.[IsActive] AS TestQuestionIsActive
FROM 
    [bpcindia_db].[dbo].[ExamDetailMaster] EDM
LEFT JOIN 
    [bpcindia_db].[dbo].[PointsMaster] PM
ON 
    EDM.[PointGain] = PM.[PointId]
LEFT JOIN 
    [bpcindia_db].[dbo].[PointCategoryMaster] PCM
ON 
    PM.[PointCategoryId] = PCM.[PointCategoryId]
LEFT JOIN 
    [bpcindia_db].[dbo].[TestQuestionMaster] TQM
ON 
    EDM.[TestQuestionId] = TQM.[TestQuestionId]  -- Matching TestQuestionId
WHERE 
    EDM.[UserId] = @userId
    AND EDM.[TestCategoryId] = @testCategoryId;

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


// exports.excelLegacyResultData = async (req, res) => {
//   try {
//     console.log("API request received");

//     const { industry, testCategory, startDate, endDate } = req.body;
//     console.log("Start Date:", startDate, "End Date:", endDate);

//     // Parse startDate and endDate to JavaScript Date objects
//     const parsedStartDate = new Date(`${startDate}T00:00:00Z`);
//     const parsedEndDate = new Date(`${endDate}T23:59:59Z`); // End of the day

//     console.log(
//       "Parsed Start Date:",
//       parsedStartDate,
//       "Parsed End Date:",
//       parsedEndDate
//     );

//     // Fetch TestData from your database based on industry
//     const TestData = await getResultDataByIndustry(industry);
//     console.log("Test Data:", TestData);

//     // Filter TestData based on the ExamDate being between startDate and endDate
//     const filteredTestData = TestData.filter((item) => {
//       const examDate = new Date(item.ExamDate);
//       return examDate >= parsedStartDate && examDate <= parsedEndDate;
//     });

//     console.log("Filtered Test Data:", filteredTestData);

//     // Create a new workbook and a worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Results");

//     // Create a Map to store unique PointID and the first corresponding title
//     const pointIdToTitleMap = new Map();

//     // First pass: collect all unique PointIDs and their corresponding title from the first occurrence
//     for (const item of filteredTestData) {
//       const resultanswer = await getResultAnsData(item.userId._id, item.id);
//       resultanswer.forEach((answer) => {
//         // Check if PointID is defined before proceeding
//         if (answer.pointMasterId && answer.pointMasterId.PointID) {
//           const pointId = answer.pointMasterId.PointID.toString();
//           if (!pointIdToTitleMap.has(pointId)) {
//             pointIdToTitleMap.set(
//               pointId,
//               answer.pointMasterId.PointMasterTitle
//             );
//           }
//         }
//       });
//     }

//     // Convert the Map keys (PointIDs) into an array for easier processing
//     const pointIdsArray = Array.from(pointIdToTitleMap.keys());

//     // Define base columns
//     const baseColumns = [
//       { header: "Name", key: "name", width: 30 },
//       { header: "Username", key: "username", width: 20 },
//       { header: "Email", key: "email", width: 20 },
//       { header: "Exam Date(Seconds)", key: "examDate", width: 20 },
//       { header: "Time Taken", key: "timeTaken", width: 20 },
//     ];

//     // Dynamically create columns for each PointID, using the title from the first matching data as the header
//     const pointIdColumns = pointIdsArray.map((pointId) => ({
//       header: pointIdToTitleMap.get(pointId), // Use the title as the column header
//       key: pointId, // Use the PointID as the key for identifying columns
//       width: 20,
//     }));

//     // Add a Total column at the end
//     const totalColumn = { header: "Total", key: "total", width: 10 };

//     // Set columns for the worksheet
//     worksheet.columns = [...baseColumns, ...pointIdColumns, totalColumn];

//     console.log("Header row added with dynamic PointID titles");

//     // Second pass: process each user's data and populate the rows
//     for (const item of filteredTestData) {
//       console.log(`Processing user: ${item.userId.Name}`);

//       const resultanswer = await getResultAnsData(item.userId._id, item.id);

//       // Create an object to store totals for each PointID
//       const pointIdTotals = {};

//       // Initialize totals for each PointID with 0
//       pointIdsArray.forEach((pointId) => {
//         pointIdTotals[pointId] = 0;
//       });

//       // Accumulate points in the appropriate category based on PointID
//       resultanswer.forEach((answer) => {
//         // Only process answers where PointID is defined
//         if (answer.pointMasterId && answer.pointMasterId.PointID) {
//           const pointId = answer.pointMasterId.PointID.toString();
//           if (pointIdTotals[pointId] !== undefined) {
//             pointIdTotals[pointId] +=
//               parseFloat(answer.pointMasterId.PointMasterPoints) || 0;
//           }
//         }
//       });

//       // Calculate total points for the user
//       const totalPoints = Object.values(pointIdTotals).reduce(
//         (acc, val) => acc + val,
//         0
//       );

//       // Add a row with the aggregated results
//       worksheet.addRow({
//         name: item.userId.Name,
//         username: item.userId.UserName,
//         email: item.userId.Email,
//         examDate: item.ExamDate,
//         timeTaken: item.TotalTime,
//         ...pointIdTotals, // Spread point totals into the row
//         total: totalPoints, // Add the total points
//       });
//     }

//     console.log("User data rows added");

//     // Write the workbook to a buffer
//     const buffer = await workbook.xlsx.writeBuffer();
//     console.log("Excel file created and buffer obtained");

//     // Set headers for file download
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", 'attachment; filename="result.xlsx"');
//     res.setHeader("Content-Length", buffer.length);

//     console.log("Response headers set");

//     // Send the buffer as the response
//     res.end(buffer);
//     console.log("Response sent");
//   } catch (err) {
//     console.error("Error generating Excel:", err);
//     return res.status(500).send("Internal Server Error");
//   }
// };


const getOldTestCategoryData = async (req, res) => {
  
  try {
    console.log("aya");
    const result = await sql.query(`
            SELECT TOP (1000) 
                [TestCategoryId], [TestGroupId], [TestCategoryName], [TotalQuestion], 
                [TotalTime], [IsHabitType], [Description], [TestCategoryImage], 
                [EnglishTerms], [HindiTerms], [GujaratiTerms], [ATime], [ATimeInt], 
                [ABy], [MTime], [MTimeInt], [MBy], [DTime], [DTimeInt], [DBy], 
                [ActiveFlag], [IsActive]
            FROM [bpcindia_db].[dbo].[TestCategoryMaster]
        `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500).json({ error: "Failed to retrieve test categories" });
  }
};

const getOldIndustryData = async (req, res) => {
  try {
    console.log("Fetching Industry Data");
    const result = await sql.query(`
            SELECT 
                [IndustryId], [Name], [Email], [Address], 
                [ATime], [ATimeInt], [ABy], 
                [MTime], [MTimeInt], [MBy], 
                [DTime], [DTimeInt], [DBy], 
                [ActiveFlag], [IsActive]
            FROM [bpcindia_db].[dbo].[IndustryMaster]
        `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500).json({ error: "Failed to retrieve industry data" });
  }
};








module.exports = { fetchExamDetailData, fetchExamMasterData , fetchAllPoint, fetchTestCategoryData, fetchUserData, getOldTestCategoryData, getOldIndustryData};
