const Course = require('../models/course');
const Test = require("../models/test");
const Student = require("../models/student");
const Submission = require("../models/submission");

const deleteSubmission = async (submissionId) => {
    const submission = await Submission.findByIdAndDelete(submissionId);
    const testId = submission.test;
    const studentId = submission.student;
    await Test.updateOne({ _id: testId }, {
        $pullAll: {
            submissions: [{_id: submissionId}],
        },
    });
    await Student.updateOne({ _id: studentId }, {
        $pullAll: {
            submissions: [{_id: submissionId}],
        },
    });
}

const deleteTest = async (testId) => {
    const test = await Test.findByIdAndDelete(testId);
    for (let i = 0; i < test.submissions.length; i++) {
        await deleteSubmission(test.submissions[i]);
    }
}

const deleteStudent = async (studentId) => {
    const student = await Student.findByIdAndDelete(studentId);
    for (let i = 0; i < student.submissions.length; i++) {
        await deleteSubmission(student.submissions[i]);
    }
}

const deleteCourse = async (courseId) => {
    const course = await Course.findByIdAndDelete(courseId);
    for (let i = 0; i < course.tests.length; i++) {
        await deleteTest(course.tests[i]);
    }
    for (let i = 0; i < course.students.length; i++) {
        await deleteStudent(course.students[i]);
    }
}

module.exports.deleteSubmission = deleteSubmission;
module.exports.deleteTest = deleteTest;
module.exports.deleteStudent = deleteStudent;
module.exports.deleteCourse = deleteCourse;