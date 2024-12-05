import axios from "axios";

function parseWarekiDate(wareki: string): string | null {
  const warekiRegex = /(?:令和|平成|昭和|大正|明治)(元|\d+)年(\d{1,2})月(\d{1,2})日生/;
  const match = wareki.match(warekiRegex);

  if (!match) {
    console.warn("No matching Wareki date found.");
    return null;
  }

  const era = wareki.slice(0, 2) as "令和" | "平成" | "昭和" | "大正" | "明治";
  const year = match[1] === "元" ? 1 : parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JavaScriptのDateは0ベースの月
  const day = parseInt(match[3], 10);

  const eraToGregorian: { [key in "令和" | "平成" | "昭和" | "大正" | "明治"]: number } = {
    令和: 2018, // 令和1年は2019年
    平成: 1988, // 平成1年は1989年
    昭和: 1925, // 昭和1年は1926年
    大正: 1911, // 大正1年は1912年
    明治: 1867, // 明治1年は1868年
  };

  const gregorianYear = eraToGregorian[era] + year;
  return new Date(gregorianYear, month, day).toISOString().split("T")[0];
}

export async function extractBirthDate(imageURL: string): Promise<string | null> {
  const visionAPIKey = process.env.REACT_APP_VISION_API_KEY;
  const visionAPIURL = `https://vision.googleapis.com/v1/images:annotate?key=${visionAPIKey}`;

  const requestData = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageURL,
          },
        },
        features: [
          {
            type: "TEXT_DETECTION",
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(visionAPIURL, requestData);
    const textAnnotations = response.data.responses[0]?.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      console.warn("No text annotations found.");
      return null;
    }

    const text = textAnnotations[0].description;
    console.log("Extracted text:", text);

    // ノイズ除去
    const cleanText = text.replace(/\s+/g, "");

    // 和暦の日付を抽出
    const birthDateMatch = cleanText.match(/(?:令和|平成|昭和|大正|明治)(元|\d+)年\d{1,2}月\d{1,2}日生/);

    if (birthDateMatch) {
      const birthDateText = birthDateMatch[0];
      console.log("Extracted birth date text:", birthDateText);

      // 和暦の日付を変換
      return parseWarekiDate(birthDateText);
    } else {
      console.warn("No valid birth date found in text.");
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}
