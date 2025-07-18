import { configDotenv } from "dotenv";
import { env } from "process";
configDotenv();

const FRONT_URL = env.FRONT_URL;

const PROMPT_FOR_SUMMARY = `You are analyzing handwritten complaint forms in image format. Each image may contain complaints from one or more individuals. The text can be in Hindi, English, or a mixture of languages.

Your goal is to extract the complaint information for each individual in a structured JSON array format.

For each complainant, extract these fields:

{
"complaintId": "

Important instructions and error handling:
If any field (name, mobile, ward, problems, request ID) cannot be read or understood due to poor handwriting or unclear image quality, fill with the appropriate default (empty string or 'Not Provided' or 'Unknown') as described above.

Crucial Addition for Problem Extraction: If general "Common Problems" are listed on the page and no specific problems are attributed to a named complainant, assume these common problems are the complaints of the first (and likely only) complainant identified on that page. Extract them as their individual problems. If a complainant explicitly lists their problems, prioritize those.

If problems are present but unclear, extract what you can. For any problem that is unreadable or incompletely understood, include it with empty strings for texts and tag 'Unknown'.

If no problems are listed for a complainant and no general common problems are present on the page, set "ProblemCount" to 0 and "Problems" to an empty array.

If multiple complainants appear on the image, extract each separately as an object in the JSON array.

The name must be extracted in both Hindi and English. If only one language version is available, provide the available version and put an empty string for the other. Use external tools if necessary for translation to Hindi or English based on the extracted name.

Problems may be written in any language. For each problem:

Provide Hindi and English versions.

Translate if originally in one language only.

If translation is impossible, duplicate the original text.

Tagging Improvement: Assign specific, relevant tags such as 'Garbage', 'Public Transport', 'Crime', 'Animal Control' based on the problem description. If a problem doesn't fit a clear category, use 'Unknown'.

you can give multiple tags for each problem. example water issue in agriculture, so you can give two tags water and agriculture.

If a problem is not clearly defined, use 'Unknown' as the tag.


Always generate a unique complaintId per complainant (like CMP001, CMP002…).

The JSON output must be valid, clean, and parsable, containing only the JSON array with no extra text or explanation.

If the image is completely illegible or no information can be extracted, then you have to give "404 no data found in pdf" in the response.
 if there is no name than write Uknown in both NameInEnglish and NameInHindi.

Example output for two complainants with error handling:
[
{
"complaintId": "CMP001",
"NameInEnglish": "Rajesh Kumar",
"NameInHindi": "राजेश कुमार",
"MobileNo": "9876543210",
"WardNo": "12",
"ComplaintTag": ["Water", "Sanitation"],
"ProblemCount": 2,
"Problems": [
{
"text": {
"hindi": "पिछले 3 दिन से पानी की सप्लाई बंद है।",
"english": "Water supply has been stopped for 3 days."
},
"tag": "Water"
},
{
"text": {
"hindi": "नाली जाम है जिससे पानी बाहर नहीं निकल रहा।",
"english": "Drainage is blocked and water is not draining."
},
"tag": "Sanitation"
}
],
"isDeleted": false
},
{
"complaintId": "CMP002",
"NameInEnglish": "",
"NameInHindi": "सीता देवी",
"MobileNo": "",
"WardNo": "Not Provided",
"ComplaintTag": ["Road"],
"ProblemCount": 1,
"Problems": [
{
"text": {
"hindi": "",
"english": ""
},
"tag": "Unknown"
}
],
"isDeleted": false
}
]

If the entire image or parts are illegible, still output the JSON with default values — do not omit fields or complainants.

Your output will be stored in a database, so ensure JSON validity and completeness.

Do not output anything other than the JSON array.`;

const Second_PROMPT_FOR_SUMMARY = `You are an expert in data analytics. Analyze the following complaint documents and return a structured JSON object that strictly follows this Mongoose schema:

{
requestId: String,
ReportId: String,
summary: {
totalProblems: Number,
totalReporters: Number,
mostCommonCategory: String
},
commonProblems: [
{
problem: String, // English only
categories: [String], // English only
count: Number,
reporters: [
{
name: {
english: String,
hindi: String
},
ReporterId: String,
phoneNumber: String,
wardNumber: String,
problemsReported: [
{
category: [String], // English only
description: {
english: String,
hindi: String
}
}
]
}
]
}
],
wardWiseProblems: [
{
ward: String,
problems: [
{
problem: String, // English only
categories: [String], // English only
count: Number,
reporters: [ReporterSchema] // Same as above
}
]
}
],
analytics: [
{
ward: String,
totalProblems: Number,
categories: [
{
category: String, // English only
count: Number
}
]
}
]
}

Grouping & Filtering Instructions:

commonProblems:

Group semantically similar problems (e.g., "no water", "water not coming") and collect their tags related with means if two problems is same related water issue example no water supply(tag:water issue) 2nd problem water supply in agriculture is stoper (tags:agriculture) than collect tags, water or agriculture means collect their original tag also same or add main tag related with issue.

Return one short problem in English for the group.

Include all reporters who reported that or similar problem.

wardWiseProblems:

For each ward, group or list all reported problems.

All problem titles must be in English.

Include full reporter info for each problem (name, ID, problemsReported, etc.).

analytics:

For each ward, calculate total grouped problems.

Count how many times each category (English only) appears in that ward.

summary:

totalProblems: Total number of unique grouped problems across all wards.

totalReporters: Unique count of ReporterIds.

mostCommonCategory: Most repeated category across all complaints (English only).

IMPORTANT RULES:

problem and categories must always be in English only.

Reporter info (like name and description) can have both English and Hindi.
on based Same problem don't store the individual problem if there is not matched problem with others than don't store their individual problem.

Their only that problem should be store in reported schema which similir or exact don't store their other problem for example if someone have 5 problem while other one have 4 problem and 2 problem is matched so their that two problems should be store don't store their other problem same do with ward wise if same problem togther them if not than individual store in ward wise

Return pure JSON only. Do not include markdown, comments, explanation, or any extra keys.

Please extract the field complaintId from the provided data and use it as reporterId in the final output.
 if you find mobilenumber and ward is empty tha write 'Not provided' in both field.
If you cannot extract any data, return an empty JSON object: {}.`;


export const envConfig = {
  FRONT_URL: FRONT_URL,
  DB_URL: env.MONGODB_URL || "mongodb://localhost:27017/sikayat-sewa",
  SECRET_KEY: env.SECRET_KEY,
};
export const GeminiConfig = {
  API_KEY: env.GEMINI_API_KEY,
  geminiConfig: {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
  },
  PROMPT_FOR_SUMMARY: PROMPT_FOR_SUMMARY,
  Second_PROMPT_FOR_SUMMARY: Second_PROMPT_FOR_SUMMARY,
};

export const mailConfig = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: false,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

