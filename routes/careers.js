const express = require("express");
const CareerApplication = require("../models/JobApplication");

const router = express.Router();

// JSON 데이터 저장 API (파일 업로드 X)
router.post("/", async (req, res) => {
  console.log("🔍 [STEP 1] Received request at /api/careers:", req.body);

  if (!req.body.firstName || !req.body.lastName || !req.body.email) {
    console.log("❌ [STEP 2] 필수 입력 필드 누락:", req.body);
    return res
      .status(400)
      .json({ success: false, message: "필수 입력 필드 누락" });
  }

  try {
    const newApplication = new CareerApplication({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      positionName: req.body.positionName || "Not specified",
      resumePath: req.body.resumePath || "pending_upload",
    });

    console.log("🛠 [STEP 3] MongoDB에 저장 시도... 🚀", newApplication); // ✅ 여기에 추가!

    const savedApplication = await newApplication.save();
    console.log("✅ [STEP 4] MongoDB 저장 성공! 🎉", savedApplication); // ✅ 저장 성공 로그 추가

    res.status(201).json({
      success: true,
      applicationId: savedApplication._id,
    });
  } catch (error) {
    console.error("❌ [STEP 5] 지원서 저장 오류:", error);
    res.status(500).json({ success: false, message: "데이터베이스 오류" });
  }
});

module.exports = router;
