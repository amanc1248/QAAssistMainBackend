const { fetchJiraData } = require('../services/jiraService.js');
const { fetchGithubData } = require('../services/githubService.js');
const { analyzeImpact } = require('../services/analysisService.js');
const Analysis = require('../models/Analysis.js');
const { analyzeReleaseService } = require('../services/qa.service.js');

const analyzeRelease = async (req, res) => {
    const { releaseVersion } = req.body;

    try {
        const jiraData = await analyzeReleaseService(releaseVersion)
        return res.json(jiraData)
    } catch (error) {
        console.error('Error in release analysis:', error);
        res.status(500).json({ error: 'Failed to analyze release' });
    }
};

module.exports = {
    analyzeRelease
}; 