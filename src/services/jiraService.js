const { Octokit } = require("@octokit/rest");
const JiraClient = require('jira-client');
const { getAIResponse } = require("./aiservice");
require('dotenv').config();


const jira = new JiraClient({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '3',
  strictSSL: true
});
const fetchReleaseData = async(releaseVersion)=>{
  try {
    const data = await jira.findIssue("AO-2");
    return data;
  } catch (error) {
    console.error(error);
    return; 
  }
}
const fetchJiraData = async (releaseVersion) => {
  try {
    const data = await jira.findIssue("AO-2");
    // return data
    console.log(data)

    const { data: commits } = await octokit.rest.repos.listCommits({
      owner: 'amanc1248',
      repo: 'QA-Feature-Test',
      per_page: 100,
      // Look for commits that mention the JIRA ticket key
      sha: 'main', // or any other branch name
      q: "A0-2", // Searching for the ticket key in commit messages
    });

    commits.forEach(commit => {
      console.log(`Commit SHA: ${commit.sha}`);
      console.log(`Message: ${commit.commit.message}`);
      console.log(`Author: ${commit.commit.author.name}`);
    });

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: 'amanc1248',
      repo: 'QA-Feature-Test',
      per_page: 100,
      state: 'all', // or 'open' for open PRs only
      q: "A0-2", // Searching for the ticket key in PR titles
    });

    pullRequests.forEach(pr => {
      console.log(`PR Title: ${pr.title}`);
      console.log(`PR URL: ${pr.html_url}`);
      console.log(`State: ${pr.state}`);
    });


    const documentationOfSystem = `Documentation: User and UserDetails Management API
Overview
This API allows managing users and their associated details using MongoDB and Express.js. It provides endpoints to perform CRUD operations, ensuring that User and UserDetails collections in MongoDB remain synchronized.

Models
User: Represents a user with basic information.

Fields:
name (String, Required): The name of the user.
email (String, Required, Unique): The user's email address.
phoneNumber (String, Required): The user's phone number.
createdAt (Date, Default: Date.now): Timestamp of when the user was created.
UserDetails: Contains additional details about a user.

Fields:
email (String, Required, Unique, Ref: User): The user's email, linked to the User model.
address (String): The user's address.
age (Number): The user's age.
occupation (String): The user's occupation.
createdAt (Date, Default: Date.now): Timestamp of when the details were created.
Endpoints
1. Get All Users with Details
Method: GET /
Description: Fetches all users and their associated details.
Process:
Retrieve all users from the User collection.
For each user, fetch their details from the UserDetails collection using the email.
Combine user data with their details.
Response:
Success: Returns an array of users with details.
Error: Returns a 500 status with the error message.
2. Create a New User with Details
Method: POST /
Description: Creates a new user along with their details in a transactional manner to ensure data consistency.
Process:
Start a database session and transaction.
Create a new user in the User collection.
Create corresponding details in the UserDetails collection.
Commit the transaction if successful or abort if an error occurs.
Response:
Success: Returns the created user and details.
Error: Returns a 400 status with the error message.`
    const context = {
      documentationOfSystem,
      fileChange: pullRequests[0].diff_url,
      jiraData: data
    }
    const response = await getAIResponse(JSON.stringify(context), "Analyze the changes in the file and the JIRA ticket and provide the impact on the system. Is there any risk of breaking the system? If so, provide a detailed explanation and a plan to mitigate the risk. Give where QA should focus on testing.");
    console.log(response)
  } catch (error) {
    console.error('Error fetching JIRA data:', error);
    throw error;
  }
};
const fetchReleasesService = async () => {
  try {
      const releases = await jira.getVersions(process.env.JIRA_PROJECT_KEY);

      // Sort releases by releaseDate in descending order
      const sortedReleases = releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

      return sortedReleases;
  } catch (error) {
      console.error('Error fetching releases from JIRA:', error);
      throw new Error('Failed to fetch releases');
  }
};
module.exports = {
  fetchJiraData,
  fetchReleasesService,
  fetchReleaseData,
}; 