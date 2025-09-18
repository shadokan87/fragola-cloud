import { tool } from "@fragola-ai/agentic";
import z from "zod";
import { toolFailure, toolSuccess } from "../../fragolaCloud/FragolaCloud";
import { nanoid } from "nanoid";
import { cloneRepo } from "./cloneRepoInternal";
import { TreeService } from "../../services/treeService";

export const cloneRepoTool = tool({
    name: "clone_github_repository",
    description: "will clone a github repository in the file system and return a repositoryId in case of success, on an error",
    schema: z.object({
        repoUrl: z.string()
    }),
    handler: async ({ repoUrl }) => {
        const repositoryId = nanoid();
        const cloneResult = await cloneRepo(repoUrl, repositoryId);
        if (!cloneResult.success)
            return toolFailure({ message: cloneResult.data });
        const tree = new TreeService(cloneResult.sourceCodePath, cloneResult.sourceCodePath!);
        return toolSuccess({
            result: {
                instructions: "you can now read files by calling `read_file_by_id` by passing 'repositoryId' in the 'requestToken' field together with the tokenType 'github repository' and any file id present in the 'custom' field of the project sturcture",
                repositoryId,
                repositoryUrl: repoUrl,
                projectSturcutre: await tree.list()
            }
        })
    }
});