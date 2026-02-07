

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>image-generator-nano-banana-pro</name>
<description>Skill for image generation.</description>
<location>project</location>
</skill>

<skill>
<name>kling-video-generator</name>
<description>Generates AI videos using Kling Video API with first-frame and last-frame control.</description>
<location>project</location>
</skill>

<skill>
<name>meta-skill</name>
<description>Creates new Agent Skills for AI Agents following best practices and documentation. Use when the user wants prompts 'create a new skill ...' or 'use your meta skill to ...'.</description>
<location>project</location>
</skill>

<skill>
<name>start-orchestrator</name>
<description>Starts the Orchestrator 3 Stream application (backend + frontend) in background mode. Use when the user asks to start orchestrator, launch orchestrator, run orchestrator, or open the orchestrator UI. Supports --session and --cwd flags for backend.</description>
<location>project</location>
</skill>

<skill>
<name>telegram</name>
<description>This skill should be used when fetching, searching, downloading, or sending messages on Telegram. Use for queries like "show my Telegram messages", "search Telegram for...", "get unread messages", "send a message to...", or "add Telegram messages to my notes".</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
