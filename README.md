
# Audio Medical Assistant

The Audio Medical Assistant is a React application designed to capture audio input from a user, transcribe it, detect questions, and provide suggested answers based on a knowledge file. It leverages OpenAI for question extrapolation and answer suggestion.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js and npm](https://nodejs.org/en/download/)
- [VS Code](https://code.visualstudio.com/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Luckyleck/med-assistant-app.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd med-assistant-app
   ```

3. **Open the Project in VS Code**:
   ```bash
   code .
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

### Set Up OpenAI API Key

To use OpenAI's API, you will need an API key.

1. Go to [OpenAI API keys](https://platform.openai.com/api-keys) and sign up or log in to get your API key.
2. In the project directory, locate the `.env.example` file.
3. Open `.env.example` and paste your API key where indicated:
   ```env
   REACT_APP_OPENAI_API_KEY=PASTE_YOUR_KEY_HERE
   ```
4. Rename the file `.env.example` to `.env`:  

### Running the Project

Once the setup is complete, start the development server:

```bash
npm run start
```

The application will open in your default browser, and you can begin using the Audio Medical Assistant.

## Usage

With the app running, you can record audio, transcribe, detect questions, and view suggested answers based on a knowledge file.

---

Happy coding!
