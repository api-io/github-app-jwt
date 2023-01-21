
# GitHub App JWT Token

Based on https://github.com/tibdex/github-app-token but returning the APP key in a jwt format instead of installation token




## Example Workflow

```yml
jobs:
  scheduled:
    runs-on: ubuntu-latest
    environment: my-app
    steps: 
    # Genarates github app token 
      - name: Generate token
        id: generate_token
        uses: api-io/github-app-jwt@v1
        with:
          app_id: ${{ secrets.APP_ID }}
          private_key: ${{ secrets.PRIVATE_KEY }}
          
      # print the token
      - name: Use token
        env:
          TOKEN: ${{ steps.generate_token.outputs.token }}
        run: |
          echo "The generated token is masked: ${TOKEN}"
```

## Real-Life Workflow

```yml
jobs:
  scheduled:
    runs-on: ubuntu-latest
    environment: flat-api-app
    steps:  
      # The first step is to check out the repository so it can read the files inside of it and do other operations
      - name: Check out repo
        uses: actions/checkout@v2
  
    # Genarates GitHub application jwt from the private key 
      - name: Generate token
        id: generate_token
        uses: api-io/github-app-jwt@v1
        with:
          app_id: ${{ secrets.APP_ID }}
          private_key: ${{ secrets.PRIVATE_KEY }}
          
      # This step is a Flat Action step. We fetch the repositories on which the app is installed and save them as repositories.json
      - name: Fetch data 
        uses: githubocto/flat@v3
        with:
          http_url: https://api.github.com/installation/repositories
          downloaded_filename: store/repositories.json
          authorization: ${{ steps.generate_token.outputs.token }} # an API key/secret for the GitHub API being used in the grahpQL query
```
