# Teagrade

A web application designed to simplify test creation and grading for teachers. Create multiple-choice tests, generate printable bubble sheets, and automatically grade student submissions by scanning completed sheets.

## ✨ Features

- 👨‍🏫 **Teacher Dashboard**: Create and manage courses.
- 🧑‍🎓 **Student Management**: Add students to courses.
- 📝 **Test Builder**: Create multiple-choice tests with defined correct answers.
- 🖨️ **Bubble Sheet**: Download printable bubble sheets and print for your student.
- 📷 **Scan & Grade**: Upload scanned images of completed sheets. Student IDs and answers are auto-detected and graded.
- 📊 **Results Viewer**: View test results per student within the application.

![image](https://github.com/user-attachments/assets/0f22e139-e571-49f9-9da4-dd492e0d947a)

## 📷 How It Works

1. **Create Course & Test**: Teachers define a test with MC questions and answers.
2. **Print Bubble Sheet**: Download the buble sheet, which includes fields for student ID and answer bubbles.
3. **Conduct Test**: Students fill out the bubble sheets on paper.
4. **Upload Scan**: Teachers upload photos or scans of the completed bubble sheets.
5. **Auto-Grading**: The app reads the image, extracts the student ID and answers, compares with the answer key, and grades the test.
6. **View Results**: Teachers can view individual and class-wide results within the app.

## Built With

* [![JavaScript][JavaScript.com]][JavaScript-url]
* [![OpenCV][OpenCV.com]][OpenCV-url]
* [![MongoDB][MongoDB.com]][MongoDB-url]
* [![HTML][HTML.com]][HTML-url]
* [![Node.js][Node.js.com]][Node.js-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Express.js][Express.js.com]][Express.js-url]
* [![EJS][EJS.com]][EJS-url]


## Getting Started

### Installation

### 1. Clone the Repository
```sh
git clone https://github.com/tunauygun/Teagrade.git
cd coplaner
```

### 2. Install Dependencies
Run the following command to install required dependencies:
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables:
```ini
dbURL=mongodb://localhost:27017/teagrade
SECRET=your_secret_here
```

### 4. Set up MongoDB database
Ensure you have a MongoDB database running at the URL specified in the `.env` file specified above

### 5. Start the Server
Run the application in development mode:
```sh
npm run dev
```

### 6. Open in Browser
Once the server is running, open your browser and go to:
```
http://localhost:3000
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
[JavaScript.com]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[HTML.com]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[HTML-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[Node.js.com]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Express.js.com]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express.js-url]: https://expressjs.com/
[EJS.com]: https://img.shields.io/badge/EJS-8A2BE2?style=for-the-badge&logo=ejs&logoColor=white
[EJS-url]: https://ejs.co/
[OpenCV.com]: https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white
[OpenCV-url]: https://opencv.org/
[MongoDB.com]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
