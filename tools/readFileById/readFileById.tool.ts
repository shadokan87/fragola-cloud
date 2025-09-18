import { tool } from "@fragola-ai/agentic";
import z from "zod";
import { TreeService } from "../../services/treeService";
import { toolFailure } from "../../fragolaCloud";

export const readFileById = tool({
    name: "read_file_by_id",
    description: "return the content of a file, a request token is required",
    schema: z.object({
        id: z.string().describe("the id of the file"),
        tokenType: z.enum(["github repository", "local file"]),
        requestToken: z.string().describe("the id to access this file, can be a repositoryId for example")
    }),
    handler: async (parameters) => {
        if (parameters.tokenType == "github repository") {
            const path = `${process.env["PWD"]}/tmp/${parameters.requestToken}/__SOURCE_CODE__`;
            const tree = new TreeService(path, path);
            return toolFailure({message: JSON.stringify(tree)});
        }
    }
});