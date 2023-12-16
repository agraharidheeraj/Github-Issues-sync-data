// controllers/syncController.js
const mongoose = require('mongoose');
const Issue = require('../models/issueModel');
const githubService = require('../services/githubService');

const syncIssues = async () => {
  try {
    const repoOwner = process.env.OWNER;
    const repoName = process.env.REPO;

    // Fetch all issues from the GitHub repo
    const response = await githubService.get(`/repos/${repoOwner}/${repoName}/issues`);
    const issues = response.data;

    const batchSize = 3;

    for (let i = 0; i < issues.length; i += batchSize) {
      const batchIssues = issues.slice(i, i + batchSize);

      // Fetch issues concurrently
      const fetchPromises = batchIssues.map(async (issue) => {
        try {
          const existingIssue = await Issue.findOneAndUpdate(
            { id: issue.id },
            { $set: { title: issue.title, body: issue.body } },
            { upsert: true, new: true }
          );

          if (existingIssue) {
            console.log(`Issue ${issue.id} updated.`);
          } else {
            console.log(`Issue ${issue.id} created.`);
          }
        } catch (error) {
          console.error(`Error processing issue ${issue.id}: ${error.message}`);
        }
      });

      await Promise.all(fetchPromises);

      // Wait for 1 second before fetching the next batch
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Error syncing issues:', error.message);
  }
};

module.exports = { syncIssues };
