import { tool } from "@fragola-ai/agentic";
import z from "zod";
import { toolSuccess } from "../../fragolaCloud/FragolaCloud";
import { nanoid } from "nanoid";
import { cloneRepo } from "./cloneRepoInternal";
export const cloneRepoTool = tool({
    name: "clone_github_repository",
    description: "will clone a github repository in the file system and return a repositoryId in case of success, on an error",
    schema: z.object({
        repoUrl: z.string()
    }),
    handler: async ({ repoUrl }) => {
        const repositoryId = nanoid();
        const cloneResult = await cloneRepo(repoUrl, repositoryId);
        return toolSuccess({
            result: {
                repositoryId
            }
        });
    }
});
