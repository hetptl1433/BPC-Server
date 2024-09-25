class ExamMasterModel {
  constructor(
    examId,
    examUniqueCode,
    examDateTime,
    userId,
    testGroupId,
    testCategoryId,
    language,
    aTime,
    aTimeInt,
    aBy,
    mTime,
    mTimeInt,
    mBy,
    dTime,
    dTimeInt,
    dBy,
    activeFlag,
    isActive,
    totalQuestion,
    totalTime,
    totalPoints
  ) {
    this.examId = examId;
    this.examUniqueCode = examUniqueCode;
    this.examDateTime = examDateTime;
    this.userId = userId;
    this.testGroupId = testGroupId;
    this.testCategoryId = testCategoryId;
    this.language = language;
    this.aTime = aTime;
    this.aTimeInt = aTimeInt;
    this.aBy = aBy;
    this.mTime = mTime;
    this.mTimeInt = mTimeInt;
    this.mBy = mBy;
    this.dTime = dTime;
    this.dTimeInt = dTimeInt;
    this.dBy = dBy;
    this.activeFlag = activeFlag;
    this.isActive = isActive;
    this.totalQuestion = totalQuestion;
    this.totalTime = totalTime;
    this.totalPoints = totalPoints;
  }
}

module.exports = ExamMasterModel;
