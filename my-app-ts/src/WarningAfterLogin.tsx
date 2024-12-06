import React, { useEffect, useState } from "react";
import { Alert, Slide } from "@mui/material";

const WarningAfterLogin = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // ログイン時刻を取得
    const loginTime = localStorage.getItem("loginTime");
    console.log("loginTime:", loginTime);

    if (loginTime) {
      const loginTimestamp = parseInt(loginTime, 10);
      const currentTime = new Date().getTime();

      // 2分（120秒）のミリ秒を計算
      const oneMinutes = 1 * 60 * 1000;

      // 残り時間を計算
      const remainingTime = oneMinutes - (currentTime - loginTimestamp);
      console.log("remainingTime:", remainingTime);

      if (remainingTime > 0) {
        // 残り時間後に警告を表示
        const timer = setTimeout(() => {
          setShowWarning(true);
        }, remainingTime);

        // クリーンアップ
        return () => clearTimeout(timer);
      } else {
        // すでに2分経過していた場合は即座に警告表示
        setShowWarning(true);
      }
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
            zIndex: 1200,
          }}
        >
          2分が経過しました。少し休憩しましょう
        </Alert>
      </Slide>
    </div>
  );
};

const styles = {
  warningOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  warningBox: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center" as "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  },
};

export default WarningAfterLogin;
