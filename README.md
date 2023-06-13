# AutoTranslator with API Google Translate

The application allows translating phrases into a selected language using Google Translator API. The query sent is checked to see, if it already exists in the cache files, and if not, the Google API is used. If there is no base language specified, the application detects it.

### 🚀 Technologies

- Node.js
- Express
- TypeScript
- Zod

### ✅ Requirements

Before starting, you need to have Git and Node installed.

### Run locally - backend

```bash
# Clone the project
$ git clone https://github.com/Kamgre7/autoTranslator.git

# Go to the project directory
$ cd autoTranslate

# Install dependencies
$ npm install

# Start the server
$ npm run start
```

### 🛠 API Reference

#### Translate phrases from object

```http
  POST /translate
```

| Parameter        | Type                    | Description                              |
| :--------------- | :---------------------- | :--------------------------------------- |
| `textObj`        | `Record<string,string>` | Object with text to translate `REQUIRED` |
| `targetLanguage` | `string`                | Target language `REQUIRED`               |
| `fromLanguage`   | `string`                | Language from `OPTIONAL`                 |

### 🛠 Example of API calls

- POST /translate

![image](https://github.com/Kamgre7/autoTranslator/assets/105069884/17ed3bb2-1b68-4fba-9358-3be4e784af80)
