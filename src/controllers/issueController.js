// controllers/issueController.js
const mongoose = require('mongoose');
const Issue = require('../models/issueModel');
const githubService = require('../services/githubService');

const getAllIssues = async (req, res) => {
  try {
    // Fetch all issues from MongoDB
    const issues = await Issue.find();

    // Log issues to the console
    issues.forEach((issue) => {
      console.log(`Issue ${issue.id} saved/updated.`);
    });

    res.json(issues);
  } catch (error) {
    console.error('Error fetching all issues:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getIssueDetail = async (req, res) => {
  try {
    const issueId = req.params.issue_id;

    // Fetch issue details from MongoDB
    const issue = await Issue.findOne({ id: issueId });

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Error fetching issue details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateIssueDetail = async (req, res) => {
  try {
    const issueId = req.params.issue_id;
    const updatedDetails = req.body;

    // Update issue details in MongoDB
    const updatedIssue = await Issue.findOneAndUpdate({ id: issueId }, updatedDetails, {
      new: true,
    });

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Update issue details in GitHub
    await githubService.patch(`https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/issues/${issueId}`, {
      title: updatedDetails.title,
      body: updatedDetails.body,
    });

    res.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getIssueDetail, updateIssueDetail, getAllIssues };
