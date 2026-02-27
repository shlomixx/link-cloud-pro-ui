# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0cf4e6c0-3ca3-418d-96e9-d8c003d92296

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0cf4e6c0-3ca3-418d-96e9-d8c003d92296) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Google Programmable Search Engine (CSE)

This project can show Google search results inside the app using **Google Programmable Search Engine (CSE)**.

### 1) Create a CSE and get your ID (cx)

- Go to `https://programmablesearchengine.google.com/`
- Create a new search engine
- Copy the **Search engine ID** (also called **cx**)

### 2) Configure environment variables

Create a file named `.env.local` in the project root:

```sh
VITE_GOOGLE_CSE_ID="<YOUR_CSE_ID>"
# Optional: "resultsOnly" or "standard"
VITE_GOOGLE_CSE_MODE="resultsOnly"
```

Then restart the dev server.

### 3) Use it in the app

- Type a query in the header search box and press Enter.
- The app navigates to: `/search?q=...` and renders Google results via the official embed script:
  - Script: `https://cse.google.com/cse.js?cx=<CSE_ID>`
  - Container: `<div class="gcse-searchresults-only"></div>`

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0cf4e6c0-3ca3-418d-96e9-d8c003d92296) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
