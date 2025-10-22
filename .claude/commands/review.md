# Review

Follow the `Instructions` below to **review work done against a specification file** (specs/*.md) to ensure implemented features match requirements. Use the spec file to understand the requirements and then use the git diff if available to understand the changes made. Capture screenshots of critical functionality paths as documented in the `Instructions` section. If there are issues, report them if not then report success.

## Variables

adw_id: $ARGUMENT
spec_file: $ARGUMENT
agent_name: $ARGUMENT if provided, otherwise use 'review_agent'
review_image_dir: `<absolute path to codebase>/agents/<adw_id>/<agent_name>/review_img/`

## Instructions

- Check current git branch using `git branch` to understand context
- Run `git diff origin/main` to see all changes made in current branch
- Find the spec file by looking for specs/*.md files in the repository that match the current branch or feature
- Read the identified spec file to understand requirements
- Review the implementation:
  - Compare the code changes with the spec requirements
  - Verify that all acceptance criteria are met
  - Check for code quality and best practices
  - Identify any issues or deviations from the spec
  - For UI changes, note what should be manually tested
- IMPORTANT: Issue Severity Guidelines
  - Think hard about the impact of the issue on the feature and the user
  - Guidelines:
    - `skippable` - the issue is non-blocker for the work to be released but is still a problem
    - `tech_debt` - the issue is non-blocker for the work to be released but will create technical debt that should be addressed in the future
    - `blocker` - the issue is a blocker for the work to be released and should be addressed immediately. It will harm the user experience or will not function as expected.
- IMPORTANT: Return ONLY the JSON array with test results
  - IMPORTANT: Output your result in JSON format based on the `Report` section below.
  - IMPORTANT: Do not include any additional text, explanations, or markdown formatting
  - We'll immediately run JSON.parse() on the output, so make sure it's valid JSON
- Ultra think as you work through the review process. Focus on the critical functionality paths and the user experience. Don't report issues if they are not critical to the feature.

## Setup

No special setup needed. Review is done by analyzing git diff and spec file.

## Report

- IMPORTANT: Return results exclusively as a JSON object based on the `Output Structure` section below.
- `success` should be `true` if there are NO BLOCKING issues (implementation matches spec)
- `success` should be `false` ONLY if there are BLOCKING issues that prevent the work from being released
- `review_issues` can contain issues of any severity (skippable, tech_debt, or blocker)
- `manual_testing_notes` should describe what should be tested manually (especially for UI changes)
- This allows subsequent agents to quickly identify and resolve blocking errors while documenting all issues

### Output Structure

\`\`\`json
{
    success: "boolean - true if there are NO BLOCKING issues (can have skippable/tech_debt issues), false if there are BLOCKING issues",
    review_summary: "string - 2-4 sentences describing what was built and whether it matches the spec. Written as if reporting during a standup meeting. Example: 'The recipe display feature has been implemented with responsive card layout and search functionality. The implementation matches the spec requirements and follows Next.js best practices. Minor styling improvements could be made but all core functionality is working as specified.'",
    review_issues: [
        {
            "review_issue_number": "number - the issue number based on the index of this issue",
            "issue_description": "string - description of the issue",
            "issue_resolution": "string - description of the resolution",
            "issue_severity": "string - severity of the issue between 'skippable', 'tech_debt', 'blocker'"
        },
        ...
    ],
    manual_testing_notes: "string - describe what should be tested manually, especially for UI changes. Example: 'Test the recipe search functionality by entering various search terms. Verify that the responsive layout works on mobile, tablet, and desktop. Check that images load correctly.'"
}
