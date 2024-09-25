// models/TestCategoryMasterModel.js
class OldTestCategoryMasterModel {
  constructor({
    TestCategoryId,
    TestGroupId,
    TestCategoryName,
    TotalQuestion,
    TotalTime,
    IsHabitType,
    Description,
    TestCategoryImage,
    EnglishTerms,
    HindiTerms,
    GujaratiTerms,
    ATime,
    ATimeInt,
    ABy,
    MTime,
    MTimeInt,
    MBy,
    DTime,
    DTimeInt,
    DBy,
    ActiveFlag,
    IsActive,
  }) {
    this.TestCategoryId = TestCategoryId;
    this.TestGroupId = TestGroupId;
    this.TestCategoryName = TestCategoryName;
    this.TotalQuestion = TotalQuestion;
    this.TotalTime = TotalTime;
    this.IsHabitType = IsHabitType;
    this.Description = Description;
    this.TestCategoryImage = TestCategoryImage;
    this.EnglishTerms = EnglishTerms;
    this.HindiTerms = HindiTerms;
    this.GujaratiTerms = GujaratiTerms;
    this.ATime = ATime;
    this.ATimeInt = ATimeInt;
    this.ABy = ABy;
    this.MTime = MTime;
    this.MTimeInt = MTimeInt;
    this.MBy = MBy;
    this.DTime = DTime;
    this.DTimeInt = DTimeInt;
    this.DBy = DBy;
    this.ActiveFlag = ActiveFlag;
    this.IsActive = IsActive;
  }
}

module.exports = OldTestCategoryMasterModel;
