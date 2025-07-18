import { fromPath, fromBuffer } from "pdf2pic";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig, GeminiConfig } from "../config/env.js";
import path from "path";
import * as fs from "fs";
import pdfPoppler from "pdf-poppler";
import { ImageType, PdfDocument } from "@ironsoftware/ironpdf";
import { jsonrepair } from "jsonrepair";
const google = new GoogleGenerativeAI(GeminiConfig.API_KEY);
const geminiModal = google.getGenerativeModel({
  model: "gemini-2.5-flash",
  ...GeminiConfig.geminiConfig,
});

const getPdf = async (data) => {
  try {
    if (!data?.url) throw new Error("PDF URL is required");
    // console.log(data);
    const response = await fetch(data.url);
    if (!response.ok) throw new Error("Failed to fetch PDF");
    // console.log("PDF fetched successfully from URL:", response);
    const arrayBuffer = await response.arrayBuffer();

    const pdfBuffer = Buffer.from(arrayBuffer);
    return pdfBuffer;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get PDF");
  }
};
const converPdfToImage = async (urll) => {
  try {
    if (!urll) throw new Error("PDF URL is required");

    const url = urll.split("/");
    const fileName =
      "E:/sikayat sewa/sikayat-sewa-backend/uploads/" + url[url.length - 1];

    const pdfDoc = await PdfDocument.fromFile(fileName);
    const imageBuffers = await pdfDoc.rasterizeToImageBuffers({
      type: ImageType.PNG,
    }); // Specify the image type (e.g., PNG)
    return imageBuffers;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to convert PDF to image");
  }
};
const getDataFromGeminiAi = async (data) => {
  try {
    const images = await converPdfToImage(data.url);
    if (!images || images.length === 0) {
      throw new Error("No images found to process");
    }
    // console.log(GeminiConfig.PROMPT_FOR_SUMMARY, "prompt for summary");
    const parts = [
      { text: GeminiConfig.PROMPT_FOR_SUMMARY },
      ...images.map((img) => ({
        inlineData: {
          mime_type: "image/png",
          data: img.toString("base64"),
        },
      })),
    ];

    const response = await geminiModal.generateContent({
      contents: [{ role: "user", parts }],
    });

    // console.log("Gemini AI response:", response);
    // return response.text();
    const AiData = response?.response;
    // console.log(AiData, " response from gemini");
    const text = AiData?.text();
    if (!AiData || !text) {
      throw new Error("No response data found from Gemini AI");
    }
    // console.log(text, " response text from gemini");
    const cleanedData = text
      .replace(/```/g, "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    console.log(cleanedData, " cleaned data from gemini");
    if(cleanedData=='404 no data found in pdf'){
      throw new Error("No data found in PDF");
    }
    const repairedJSON = jsonrepair(cleanedData);
    let parsedData;
    try {
      parsedData = JSON.parse(repairedJSON);

      // console.log(parsedData, " parsed data from gemini");
    } catch (error) {
      // console.log("Error parsing JSON:", error);
      throw new Error("Failed to parse JSON from Gemini AI response");
    }
    return parsedData[1] || parsedData; // Return the first item or the entire object if it's not an array
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get data from Gemini AI");
  }
};

const getReportFromGeminiAi = async (data) => {
  try {
    const RawData = data;
    const Gemini_Prompt_ForReport =
      GeminiConfig.Second_PROMPT_FOR_SUMMARY +
      `Use the following complaint documents for your analysis:
      ${JSON.stringify(data, null, 2)}
      Return only the result in valid JSON format. Do not include explanations, notes, or markdown formatting.`;

    // console.log(Gemini_Prompt_ForReport, "prompt for report");
    const response = await geminiModal.generateContent({
      contents: [{ role: "user", parts: [{ text: Gemini_Prompt_ForReport }] }],
    });
    // console.log("Gemini AI response:", response);
    // return response.text();
    const AiData = response?.response;
    // console.log(AiData, " response from gemini");
    const text = AiData?.text();
    if (!AiData || !text) {
      throw new Error("No response data found from Gemini AI");
    }
    // console.log(text, " response text from gemini");
    const cleanedData = text
      .replace(/```/g, "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    // console.log(cleanedData, " cleaned data from gemini");
    const repairedJSON = jsonrepair(cleanedData);
    let parsedData;
    try {
      parsedData = JSON.parse(repairedJSON);

      // c`onsole.log(parsedData, " parsed data from gemini");
    } catch (error) {
      console.log("Error parsing JSON:", error);
      throw new Error("Failed to parse JSON from Gemini AI response");
    }
    return parsedData[1] || parsedData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get report from Gemini AI");
  }
};

export { getDataFromGeminiAi, getReportFromGeminiAi };
