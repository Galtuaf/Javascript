const getStudent = (email, password) => {
    return fetch('https://rt-students.com/api/getStudent/'+ email + '&' + password)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(error);
        });
};

const getCourses = (id) => {
    return fetch('https://rt-students.com/api/getCourses/' + id)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(error);
        });
};

const getCalendar = (id) => {
    return fetch('https://rt-students.com/api/getCalendar/' + id)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(error);
        });
};

const updateDetails = (details) => {
    return fetch('https://rt-students.com/api/updateDetails/', {
        method: 'post',
        body: JSON.stringify(details)
    })
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(error);
        });
};

const checkLogin = () => {
    return window.mystudent !== undefined;
};

const login = () => {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    getStudent(email, password)
        .then((response) => {
            if (response.status === 'Error') {
                document.getElementById("error").style.display = 'block';
            } else {
                window.mystudent = response[0];
                document.getElementById("loginModal").close();
                if (window.localStorage.getItem('background_' + window.mystudent.email) !== undefined) {
                    setColor(window.localStorage.getItem('background_' + window.mystudent.email));
                }
                studentDetails();
                changePage('student');
            }
        })
        .catch(() => {
            document.getElementById("error").style.display = 'block';
        });
    return false;
};

const logout = () => {
    window.mystudent = {};
    document.getElementById("loginModal").showModal();
};

const changePage = (page) => {
    if (page === 'student') {
        studentDetails();
    }
    if (page === 'courses') {
        studentCourses();
    }
    if (page === 'calendar') {
        studentCalendar();
    }

    if (window.currentPage) {
        document.getElementById(window.currentPage).style.display = 'none';
    }
    document.getElementById(page).style.display = 'block';
    window.currentPage = page;     //שם המידע יהיה זמין כל עוד לא סוגרים את החלון// 
};

const setColor = (color) => {
    window.localStorage.setItem('background_' + window.mystudent.email, color);
    document.body.style.backgroundColor = color;
};

const studentDetails = () => {
    document.getElementById('id').value = window.mystudent.studentID;
    document.getElementById('firstname').value = window.mystudent.firstName;
    document.getElementById('lastname').value = window.mystudent.familyName;
    document.getElementById('address').value = window.mystudent.address;
    document.getElementById('email').value = window.mystudent.email;
    document.getElementById('mobile').value = window.mystudent.mobileNumber;
    document.getElementById('contact-phone').innerHTML = window.mystudent.mobileNumber;
    document.getElementById('contact-phone').href = 'tel:' + window.mystudent.mobileNumber;
    document.getElementById('contact-whatsapp').innerHTML = window.mystudent.mobileNumber;
    document.getElementById('contact-whatsapp').href = 'https://wa.me/' + window.mystudent.mobileNumber;
    document.getElementById('contact-email').innerHTML = window.mystudent.email;
    document.getElementById('contact-email').href = 'mailto:' + window.mystudent.email;
};

const saveDetails = () => {
    const details = {
        id: document.getElementById('id').value,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        mobileNumber: document.getElementById('mobile').value
    };
    updateDetails(details)
        .then((result) => {
            if(result.status === "401") {
                document.getElementById('save-result').classList.add('error');
                document.getElementById('save-result').innerHTML = "תקלה בשמירה";
            } else {
                document.getElementById('save-result').classList.add('success');
                document.getElementById('save-result').innerHTML = "נשמר בהצלחה";
            }
        })
        .catch((error) => {
            document.getElementById('save-result').classList.add('error');
            document.getElementById('save-result').innerHTML = "תקלה בשמירה";
        });
};

const getScoreColor = (score) => {
    if (score >= 0 && score <= 50) {
        return 'red';
    } else if (score > 50 && score <= 80) {
        return 'yellow';
    } else if (score > 80 && score <= 99) {
        return 'green';
    } else if (score === 100) {
        return 'blue';
    }
};

const studentCourses = () => {
    getCourses(window.mystudent.studentID)
        .then((courses) => {
            if (courses === window.myCourses) {        //bonus//           
                return window.myCourses;
            } else {
                window.myCourses = courses;      //שם המידע יהיה זמין כל עוד לא סוגרים את החלון// 
            }

            let chartdata = {
                labels: [],
                datasets: [{
                    label: 'Exam Score',
                    data: [],
                    backgroundColor: []
                }]
            };                                                        // build the table //
            window.myCourses.forEach((course, index) => {     //  i check if the ID that we gut from "myCourses" is the same of our ID on "window.mystudent.studentID"                    
                if (course.student === window.mystudent.studentID) {
                    const table = document.getElementById('list');          // Grab The table By Id "getElementById('list')"
                    const row = table.insertRow(index + 1);  // Insert New row in our table with function that on the element "insertRow" - "https://www.w3schools.com/jsref/met_table_insertrow.asp"//

                    row.insertCell(0).innerHTML = course.courseName;  // i enter to the inner HTML the text and tags- "https://www.w3schools.com/jsref/met_tablerow_insertcell.asp"//
                    row.insertCell(1).innerHTML = course.code;
                    row.insertCell(2).innerHTML = '<div class="' + getScoreColor(course.examMark) + '">' + course.examMark + '</div>';
                    row.insertCell(3).innerHTML = '<div class="' + getScoreColor(course.projectMark) + '">' + course.projectMark + '</div>';

                    chartdata.labels.push(course.courseName);   // i enter new label to the chart OBJ "chartdata"//
                    chartdata.datasets[0].data.push(course.examMark); // i enter new data set to the chart OBJ "chartdata"//
                    chartdata.datasets[0].backgroundColor.push(getScoreColor(course.examMark));  // i enter color with the function "getScoreColor" to the chart OBJ "chartdata"//
                }
            });                                                   // i grab the element 'myChart' by the function "getElementById" from the HTML//
            const ctx = document.getElementById('myChart');       // <canvas class="col" id="myChart" width="400" height="200"></canvas>//
            const barChart = new Chart(ctx, {    // now i build new chart with the "new Chart(Element, Option)"
                type: 'horizontalBar',
                data: chartdata,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });
        });
};

const studentCalendar = () => {
    getCalendar(window.mystudent.studentID)
        .then((calendar) => {
            if (calendar === window.myCalendar) {     //bonus//
                return window.myCalendar;
            } else {
                window.myCalendar = calendar;        //שם המידע יהיה זמין כל עוד לא סוגרים את החלון// 
            }
            showCalendar(currentMonth, currentYear);
        });
};

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const showCalendar = (month, year) => {
    const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    const monthAndYear = document.getElementById("monthAndYear");

    let firstDay = (new Date(year, month)).getDay();
    let table = document.getElementById("calendar-body");
    table.innerHTML = "";
    monthAndYear.innerHTML = year + " " + months[month];

    let date = 1;
    for (let i = 0; i < 5; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("div");
                let cellText = document.createTextNode("");
                cell.classList.add("col");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else {
                let cell = document.createElement("div");
                cell.classList.add("col");
                let cellText = document.createTextNode("");
                if (date <= daysInMonth(month, year)) {
                    cellText = document.createTextNode(date);
                    const session = getSession(new Date(year, month, date, 18, 0, 0));
                    if (session !== undefined) {
                        cellText = document.createTextNode(date + " " + session.teacher);
                        cell.classList.add("session");
                    }
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add("today");
                    }
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        table.appendChild(row);
    }
};
const getSession = (date) => {
    const result = window.myCalendar.find((session) => {
        return date.valueOf() === new Date(session.sessionDate).valueOf();
    });
    return result;
};
const daysInMonth = (iMonth, iYear) => {
    return 32 - new Date(iYear, iMonth, 32).getDate();
};
const nextMonth = () => {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
};
const previousMonth = () => {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
};