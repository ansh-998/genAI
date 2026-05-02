const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

// ✅ Initialize Google Gemini AI client using API key from .env
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// ✅ Zod schema — defines the exact JSON structure Gemini must return for interview report
const interviewReportSchema = z.object({

    matchScore: z.number()
        .describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("A technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question — what points to cover, what approach to take, etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and model answers"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question — what points to cover, what approach to take, etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and model answers"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("A skill the candidate is lacking based on the job description"),
        severity: z.enum(["low", "medium", "high"])
            .describe("How critical this skill gap is — how important the skill is for the role and how much it impacts the candidate's chances")
    })).describe("List of skill gaps identified in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus area for this day, e.g. data structures, system design, mock interviews, etc."),
        tasks: z.array(z.string())
            .describe("List of specific tasks to complete on this day, e.g. read a book chapter, solve LeetCode problems, watch a tutorial, etc.")
    })).describe("A structured day-wise preparation plan for the candidate to follow before the interview"),

    title: z.string()
        .describe("The job title for which this interview report is being generated"),
})


/**
 * @name generateInterviewReport
 * @description Sends resume, self description and job description to Gemini AI
 *              and returns a structured interview report matching interviewReportSchema
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a detailed interview report for a candidate applying for a job.
    
Candidate Details:
- Resume: ${resume}
- Self Description: ${selfDescription}
- Job Description: ${jobDescription}

Analyze the candidate's profile against the job description and generate:
1. A match score (0-100)
2. Relevant technical interview questions with intentions and model answers
3. Behavioral interview questions with intentions and model answers
4. Skill gaps with severity levels
5. A day-wise preparation plan
6. The job title`

    // ✅ Call Gemini API with structured JSON output enforced via responseSchema
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",                              // ✅ Fixed: correct model ID
        contents: prompt,
        config: {
            responseMimeType: "application/json",               // Force JSON response
            responseSchema: zodToJsonSchema(interviewReportSchema), // Enforce exact structure
        }
    })

    return JSON.parse(response.text)
}


/**
 * @name generatePdfFromHtml
 * @description Launches a headless Chromium browser using Puppeteer,
 *              loads the given HTML and exports it as an A4 PDF buffer
 */
async function generatePdfFromHtml(htmlContent) {

    // ✅ Fixed: headless mode + no-sandbox flags required for Windows/Linux servers
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })

    const page = await browser.newPage()

    // Load HTML and wait until all network requests are done
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Export page as A4 PDF with standard margins
    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


/**
 * @name generateResumePdf
 * @description Sends resume, self description and job description to Gemini AI
 *              which returns an HTML resume, then converts it to a PDF buffer
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    // Schema for resume — Gemini just needs to return HTML string
    const resumePdfSchema = z.object({
        html: z.string().describe("Complete, self-contained HTML content of the resume ready to be converted to PDF")
    })

    const prompt = `Generate a professional resume in HTML format for a candidate with the following details:

- Resume/Experience: ${resume}
- Self Description: ${selfDescription}  
- Job Description (tailor the resume for this role): ${jobDescription}

Requirements for the resume:
1. Return a single JSON object with one field: "html" containing the full HTML
2. The HTML must be complete and self-contained (include all CSS inline or in a <style> tag)
3. Tailor the resume specifically for the given job description
4. Highlight relevant skills and experience that match the job requirements
5. Write in a natural, human tone — avoid AI-sounding language
6. Keep design simple, clean and professional — subtle colors and good typography are fine
7. Must be ATS-friendly — use standard section headings, avoid tables/columns for main content
8. Target length: 1-2 pages when rendered as A4 PDF
9. Focus on quality and relevance over quantity`

    // ✅ Call Gemini to generate the HTML resume
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",          // ✅ Fixed: correct model ID
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    // Convert the returned HTML into a PDF buffer using Puppeteer
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}


module.exports = { generateInterviewReport, generateResumePdf }