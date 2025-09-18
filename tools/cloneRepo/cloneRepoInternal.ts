import { $ } from "bun";
export const cloneRepo = async (url: string, requestId: string) => {
    console.log("cloning: ", url, requestId);
    const path = `./tmp/${requestId}`;
    // Convert GitHub repo URL to tarball URL
    const tarballUrl = url.replace(/\.git$/, "") + "/archive/refs/heads/main.tar.gz";
    const response = await fetch(tarballUrl);
    if (!response.ok) throw new Error(`Failed to fetch repo: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();

    // Ensure the target directory exists
    await $`mkdir -p ${path}`;

    const tarballPath = `${path}/repo.tar.gz`;
    await Bun.write(tarballPath, new Uint8Array(arrayBuffer));

    // Extract the tarball to a temporary location first
    const extract = Bun.spawn({
        cmd: ["tar", "-xzf", tarballPath, "-C", path],
        stdout: "inherit",
        stderr: "inherit"
    });
    await extract.exited;
    if (extract.exitCode !== 0)
        return { success: false, data: "extract_fail" };

    // Find the extracted folder (usually repo-name-main) and rename to __SOURCE_CODE__
    const files = await $`ls ${path}`.text();
    const extractedFolder = files.trim().split('\n').find(f => f !== 'repo.tar.gz');
    if (extractedFolder) {
        await $`mv ${path}/${extractedFolder} ${path}/__SOURCE_CODE__`;
    }
    return { success: true, path: path, sourceCodePath: `${path}/__SOURCE_CODE__` }
};