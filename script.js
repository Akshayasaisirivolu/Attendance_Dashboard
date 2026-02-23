// =============================
// Initialize Subjects Array
// =============================

let subjects = [];
let editIndex = -1;
// Load saved data from localStorage
if (localStorage.getItem("subjects")) {
    subjects = JSON.parse(localStorage.getItem("subjects"));
}

// When page loads, display saved subjects
window.onload = function () {
    displaySubjects();
};

// =============================
// Add Subject Function
// =============================

function addSubject() {

    let name = document.getElementById("subjectName").value.trim();
    let total = Number(document.getElementById("totalClasses").value);
    let attended = Number(document.getElementById("attendedClasses").value);

    if (name === "" || total === "" || attended === "") {
        alert("Please fill all fields");
        return;
    }

    if (attended > total) {
        alert("Attended cannot be greater than total");
        return;
    }

    let subject = {
        name: name,
        total: total,
        attended: attended
    };

    // 🔥 IMPORTANT PART
    if (editIndex === -1) {
        subjects.push(subject);  // Add new subject
    } else {
        subjects[editIndex] = subject;  // Update existing subject
        editIndex = -1;
        document.getElementById("mainBtn").innerText = "Add Subject";
    }

    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();

    // Clear inputs
    document.getElementById("subjectName").value = "";
    document.getElementById("totalClasses").value = "";
    document.getElementById("attendedClasses").value = "";
}

// =============================
// Display Subjects Function
// =============================

function displaySubjects() {
    let list = document.getElementById("subjectsList");
    list.innerHTML = "";

    let totalAll = 0;
    let attendedAll = 0;

    subjects.forEach(function (subject, index) {
        let percentage = ((subject.attended / subject.total) * 100).toFixed(2);
        let color = percentage < 75 ? "red" : "green";

        // Classes required to reach 75%
        let requiredClasses = 0;
        if (percentage < 75) {
            requiredClasses = Math.ceil(
                (0.75 * subject.total - subject.attended) / 0.25
            );
        }

        // Classes allowed to bunk while staying >= 75%
        let bunkAllowed = Math.floor(
            (subject.attended - 0.75 * subject.total) / 0.75
        );

        totalAll += subject.total;
        attendedAll += subject.attended;

        list.innerHTML += `
            <div class="subject-card">
                <strong>${subject.name}</strong><br>
                Total Classes: ${subject.total}<br>
                Attended: ${subject.attended}<br>
                Attendance:
                <span style="color:${color}; font-weight:bold;">
                    ${percentage}%
                </span>

                ${
                    percentage < 75
                        ? `<br>Need to attend <strong>${requiredClasses}</strong> more classes to reach 75%`
                        : `<br><strong style="color:green;">You are safe 🎉</strong>`
                }

                ${
                    percentage >= 75
                        ? `<br>You can bunk <strong>${bunkAllowed}</strong> more classes safely`
                        : `<br><span style="color:red;">You cannot bunk any classes 😭</span>`
                }

                <br><br>
                <button onclick="editSubject(${index})" class="edit-btn">
                Edit
                </button>

                <button onclick="deleteSubject(${index})" class="delete-btn">
                Delete
                </button>
            </div>
        `;
    });

    // Overall Attendance
    if (totalAll > 0) {
        let overallPercent = ((attendedAll / totalAll) * 100).toFixed(2);
        document.getElementById("overall").innerText =
            "Overall Attendance: " + overallPercent + "%";
    } else {
        document.getElementById("overall").innerText = "";
    }
}

// =============================
// Delete Subject Function
// =============================

function deleteSubject(index) {
    subjects.splice(index, 1);

    // Update localStorage
    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();
}
function editSubject(index) {
    let subject = subjects[index];

    document.getElementById("subjectName").value = subject.name;
    document.getElementById("totalClasses").value = subject.total;
    document.getElementById("attendedClasses").value = subject.attended;

    editIndex = index;

    document.getElementById("mainBtn").innerText = "Update Subject";
}