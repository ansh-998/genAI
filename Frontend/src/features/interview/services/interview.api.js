import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
})

// response interceptor to extract error messages from backend
// Without this, axios throws generic "Request failed with status code 4xx"
// With this, it throws the actual message from your backend e.g. "Invalid email or password"
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || "Something went wrong."
        return Promise.reject(new Error(message))
    }
)


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)

    // only append resume if it exists (it's optional if selfDescription is provided)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    //  don't manually set Content-Type for FormData
    // axios sets it automatically with the correct boundary value
    const response = await api.post("/api/interview/", formData)

    return response.data
}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}


/**
 * @description Service to generate resume pdf based on interviewReportId.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "arraybuffer"  // use arraybuffer instead of blob
        // arraybuffer works more reliably across browsers for binary data
        // and is correctly handled by new Blob([response]) in useInterview.js
    })
    return response.data
}