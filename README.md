## GitHub Scanner

This project implements a system which allows you to retrieve information about repositories hosted on a user's GitHub account.

### Features

* List all public repositories for a given username.
* Get detailed information about a specific repository, including:
    * Name
    * Size
    * Owner
    * Public/Private status
    * Number of files
    * Content of any single YAML file (if found)
    * Active webhooks (if any)

### Setup

1. **Generate a GitHub Personal Access Token:** Follow the instructions on [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to generate a personal access token with the `repo` scope.
2. **Configure Environment Variables:** Create a `.env` file in the project root directory and add the following lines, replacing the placeholders with your actual values:

```
GITHUB_TOKEN={YOUR_GITHUB_PERSONAL_ACCESS_TOKEN}
GITHUB_API_ENDPOINT='https://api.github.com'
```

**Note:**  **Never commit your `.env` file to version control.**

3. **Install Dependencies:** Run `npm install` in the project directory to install the required dependencies.

### Usage

1. **Start the Server:** Run `npm start` to start the Apollo GraphQL server. The server will print the URL where it's accessible when ready.
2. **Use a GraphQL Client:** Use a GraphQL client like [https://studio.apollographql.com/sandbox/explorer](https://studio.apollographql.com/sandbox/explorer) or any other tool to interact with the server's API.

###  GraphQL Schema

The schema defines the available data types and queries:

* **Repository:** Represents a basic repository with name, size, and owner information.
* **RepositoryDetails:** Extends the Repository type with additional information:
    * isPrivate: Indicates if the repository is private or public.
    * fileCount: The total number of files in the repository.
    * ymlFileContent: The content of any single YAML file found in the repository (optional).
    * activeWebhooks: A list of active webhooks configured for the repository (optional).
* **Query:** Defines the available queries:
    * listRepositories(username: String!): Returns a list of public repositories for a given username.
    * repositoryDetails(username: String!, repoName: String!): Retrieves detailed information about a specific repository.


###  Example Queries

Here are some examples of GraphQL queries you can run:

**List all repositories for a user:**

```graphql
query {
  listRepositories(username: "your_username") {
    name
    size
    owner
  }
}
```

**Get details of a specific repository:**

```graphql
query {
  repositoryDetails(username: "your_username", repoName: "repoA") {
    name
    size
    owner
    isPrivate
    fileCount
    ymlFileContent
    activeWebhooks
  }
}
```

