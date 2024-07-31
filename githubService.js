import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

export const getRepositoriesList = async (username) => {
    try {
        const response = await octokit.repos.listForUser({ username });
        return response.data.map(repo => ({
            name: repo.name,
            size: repo.size,
            owner: repo.owner.login
        }));
    } catch (e) {
        throw new Error(`Unable to fetch repositories list: ${e.message}`);
    }
};

export const getRepoDetails = async (owner, repo) => {
    try {
        return await octokit.repos.get({
            owner,
            repo
        });
    } catch (e) {
        throw new Error(`Unable to fetch repository: ${e.message}`);
    }
}

export const getFilesDetails = async (owner, repo, path = '') => {
    try {
        let fileCount = 0;
        let ymlFileContent = null;

        const contents = await octokit.repos.getContent({
            owner,
            repo,
            path
        });

        const promises = contents.data.map(async (item) => {
            if (item.type === 'file') {
                fileCount++;

                if (!ymlFileContent) {
                    const ymlFile = item.name.endsWith('.yml');

                    if (ymlFile) {
                        const ymlResponse = await octokit.repos.getContent({
                            owner,
                            repo,
                            path: item.path
                        });

                        if (ymlResponse) {
                            ymlFileContent = Buffer.from(ymlResponse.data.content, 'base64').toString('utf-8');
                        }
                    }
                }
            } else if (item.type === 'dir') {
                const {
                    fileCount: nestedFileCount,
                    ymlFileContent: nestedYmlContent
                } = await getFilesDetails(owner, repo, item.path);
                fileCount += nestedFileCount;

                if (!ymlFileContent && nestedYmlContent) {
                    ymlFileContent = nestedYmlContent;
                }
            }
        });

        await Promise.all(promises);

        return { fileCount, ymlFileContent };
    } catch (e) {
        throw new Error(`Unable to fetch files details: ${e.message}`);
    }
}

export const getActiveWebhooks = async (owner, repo) => {
    let activeWebhooks = null;

    try {
        const hooks = await octokit.repos.listWebhooks({
            owner,
            repo,
        });

        activeWebhooks = hooks?.filter(hook => hook.active)?.map(wh => wh.config.url);
    } catch (error) {
        if (error.status !== 404) {
            throw error;
        }
    }

    return activeWebhooks;
}