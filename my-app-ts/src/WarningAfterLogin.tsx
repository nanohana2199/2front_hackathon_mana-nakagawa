import React, { useEffect, useState } from "react";
import { Alert, Slide,Box } from "@mui/material";

const WarningAfterLogin = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    console.log("loginTime:", loginTime);

    if (loginTime) {
      const loginTimestamp = parseInt(loginTime, 10);
      const currentTime = new Date().getTime();
      const thirtySeconds = 30 * 1000; // 30秒のミリ秒
      const initialDelay = thirtySeconds - ((currentTime - loginTimestamp) % thirtySeconds);

      console.log("initialDelay:", initialDelay);

      // 初回の警告タイマーを設定
      const initialTimer = setTimeout(() => {
        setShowWarning(true);

        // 以降は30秒ごとに警告を表示
        const interval = setInterval(() => {
          setShowWarning(true);
        }, thirtySeconds);

        // クリーンアップ処理
        return () => clearInterval(interval);
      }, initialDelay);

      // クリーンアップ処理
      return () => clearTimeout(initialTimer);
    }
  }, []);

  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <div>
      <Slide direction="down" in={showWarning} mountOnEnter unmountOnExit>
        <Alert
          severity="warning"
          onClose={closeWarning}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            fontSize: "2rem",
            padding: "20px",
            textAlign: "center",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)",
            border: "2px solid #fff",
            justifyContent: "center",
            lineHeight: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            30秒が経過しました。少し休憩しましょう
         </Box>
        </Alert>
      </Slide>
    </div>
  );
};

export default WarningAfterLogin;
