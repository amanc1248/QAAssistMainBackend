const { fetchReleasesService } = require("../services/jiraService");

const getProjectReleases = async (req, res) => {
    try {
        const jiraData = await fetchReleasesService();
        return res.json(jiraData)
    } catch (error) {
        console.error('Error in release analysis:', error);
        res.status(500).json({ error: 'Failed to fetch release' });
    }
};

module.exports = {
    getProjectReleases,
}; 