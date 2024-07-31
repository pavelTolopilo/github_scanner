import {
    getRepoDetails,
    getRepositoriesList,
    getFilesDetails,
    getActiveWebhooks,
} from './githubService.js';

const resolvers = {
    Query: {
        listRepositories: async (_, { username }) => {
            return await getRepositoriesList(username);
        },
        repositoryDetails: async (_, { username, repoName }) => {
            const repo = await getRepoDetails(username, repoName);
            const { fileCount, ymlFileContent } = await getFilesDetails(username, repoName);

            return {
                name: repo.data.name,
                size: repo.data.size,
                owner: repo.data.owner.login,
                isPrivate: repo.data.private,
                fileCount,
                ymlFileContent,
                activeWebhooks: await getActiveWebhooks(username, repoName)
            };
        }
    }
};

export default resolvers;