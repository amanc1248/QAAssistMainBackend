const { Octokit } = require("@octokit/rest");
const JiraClient = require('jira-client');
const { getAIResponse } = require("./aiservice");
const { fetchReleaseData } = require("./jiraService");
const { DOCUMENTATION_OF_SYSTEM } = require("../constants/documentatoin.constant");
const { getPullRequestFileChanges } = require("./githubService");
require('dotenv').config();

const analyzeReleaseService = async ({releaseVersion}) => {
    try {
        // 1. get jira data
        const releaseData =await fetchReleaseData(releaseVersion);

        // 2. get github data
        const fileChangesFetchFromPullRequests = await getPullRequestFileChanges();

        // 3. call gemini
        const context = {
            documentationOfSystem: DOCUMENTATION_OF_SYSTEM,
            fileChange: fileChangesFetchFromPullRequests[0].diff_url,
            jiraData: releaseData
          }
        const response = await getAIResponse(JSON.stringify(context), "Analyze the changes in the file and the JIRA ticket and provide the impact on the system. Is there any risk of breaking the system? If so, provide a detailed explanation and a plan to mitigate the risk. Give where QA should focus on testing.");
        return response;
    } catch (error) {
        console.error('Error fetching releases from JIRA:', error);
        throw new Error('Failed to fetch releases');
    }
};
module.exports = {
    analyzeReleaseService,
}; 