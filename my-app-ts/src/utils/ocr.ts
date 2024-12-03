import axios from "axios";

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
    console.log("Vision API Response:", response.data);

    const textAnnotations = response.data.responses[0]?.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      console.warn("No text annotations found.");
      return null;
    }

    // 抽出された全テキスト
    const text = textAnnotations[0].description;
    console.log("Extracted text:", text);

    // 生年月日を正規表現で抽出
    const birthDateMatch = text.match(/\b(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b/); // YYYY-MM-DD または DD-MM-YYYY
    if (birthDateMatch) {
      const birthDate = birthDateMatch[0];
      console.log("Extracted birth date:", birthDate);
      return birthDate;
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
