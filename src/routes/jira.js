const express = require('express');
const router = express.Router();
const { getProjectReleases } = require('../controllers/jira.controller.js');

router.get("/get-releases", getProjectReleases)

module.exports = router; 