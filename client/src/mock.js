const mockData = {
	account: [
		{
			id: 0, username: "admin",
			email: "admin@mail.utoronto.ca", password: "admin",
			role: "Admin", profilePicture: "icons8-user-64.png", // icon from icon8
			description: null, campus: null, programOfStudy: null,
		},
		// >>>>>>>>>>>>> Tutor <<<<<<<<<<<<<<<<<
		{
			id: 1, username: "tutor1",
			email: "tutor1@mail.utoronto.ca", password: "tutor1",
			role: "Tutor", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a tutor!", campus: null, programOfStudy: null,
		},
		{
			id: 2, username: "tutor2",
			email: "tutor2@mail.utoronto.ca", password: "tutor2",
			role: "Tutor", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a tutor!", campus: null, programOfStudy: null,
		},
		{
			id: 3, username: "tutor3",
			email: "tutor3@mail.utoronto.ca", password: "tutor3",
			role: "Tutor", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a tutor!", campus: null, programOfStudy: null,
		},
		// >>>>>>>>>>>>> Student <<<<<<<<<<<<<<<
		{
			id: 4, username: "user1",
			email: "student1@mail.utoronto.ca", password: "user1",
			role: "Student", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a student!", campus: "St George", programOfStudy: "CS SPEC",
		},
		{
			id: 5, username: "user2",
			email: "student2@mail.utoronto.ca", password: "user2",
			role: "Student", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a student!", campus: "St George", programOfStudy: "CS SPEC",
		},
		{
			id: 6, username: "user3",
			email: "student3@mail.utoronto.ca", password: "user3",
			role: "Student", profilePicture: "icons8-user-64.png", // icon from icon8
			description: "I am a student!", campus: "St George", programOfStudy: "CS SPEC",
		},
	],
	course: [
		{
			id: 0, courseNum: "CSC309", department : "CSC", courseName: "Programming on the Web", coursePicture: "https://cdn.britannica.com/30/199930-131-B3D1D347/computer.jpg",
			courseInfo: "An introduction to software development on the web. Concepts underlying the development of programs that operate on the web; survey of technological alternatives; greater depth on some technologies. Operational concepts of the internet and the web, static client content, dynamic client content, dynamically served content, n-tiered architectures, web development processes, and security on the web. Assignments involve increasingly more complex web-based programs. Guest lecturers from leading e-commerce firms will describe the architecture and operation of their web sites."
		},
		{
			id: 1, courseNum: "CSC343", depertment :"CSC", courseName: "Introduction to Databases", coursePicture: "https://www.fikrabd.com/sites/default/files/computer-database-programming-algorithm.jpg",
			courseInfo:"Introduction to database management systems. The relational data model. Relational algebra. Querying and updating databases: the query language SQL. Application programming with SQL. Integrity constraints, normal forms, and database design. Elements of database system technology: query processing, transaction management."
		},
		{
			id: 2, courseNum: "MAT344",department : "MAT",  courseName: "Introduction to Combinatorics", coursePicture: "https://42796r1ctbz645bo223zkcdl-wpengine.netdna-ssl.com/wp-content/uploads/2016/05/puzzles-647700_1920.jpg", 
			courseInfo: "Basic counting principles, generating functions, permutations with restrictions. Fundamentals of graph theory with algorithms; applications (including network flows). Combinatorial structures including block designs and finite geometries."
		},
		{
			id: 3, courseNum: "STA247", department : "STA", courseName: "Probability with Computer Applications", coursePicture: "https://unctad.org/sites/default/files/2020-10/2020-10-20_World-stats-day-blog_1200x675.jpg",
			courseInfo: "An introduction to probability using simulation and mathematical frameworks, with emphasis on the probability needed for computer science applications and more advanced study in statistical practice. Topics covered include probability spaces, random variables, discrete and continuous probability distributions, probability mass, density, and distribution functions, expectation and variance, independence, conditional probability, the law of large numbers, the central limit theorem, sampling distributions. Computer simulation will be taught and used extensively for calculations and to guide the theoretical development."
		}
	],
	tutorAccountCourse: [
		{ // admin - tutor 1 (course 0)
			id: 0,
			accountID: 0, tutorID: 1, courseID: 0,
			status: true
		},
		{ // student 1 - tutor 2
			id: 1,
			accountID: 4, tutorID: 2, courseID: 1,
			status: true
		},
		{ // student 2 - tutor 3
			id: 2,
			accountID: 5, tutorID: 3, courseID: 3,
			status: false
		},
		{ // student 1 - tutor 1
			id: 3,
			accountID: 4, tutorID: 1, courseID: 0,
			status: true
		},
		{ // student 2 - tutor 1
			id: 4,
			accountID: 5, tutorID: 1, courseID: 2,
			status: true
		},
		{ // admin - tutor 2
			id: 5,
			accountID: 0, tutorID: 2, courseID: 1,
			status: true
		},
		{ // admin - tutor 3
			id: 6,
			accountID: 0, tutorID: 3, courseID: 2,
			status: true
		},
		{ // admin - tutor 1 (course 2)
			id: 7,
			accountID: 0, tutorID: 1, courseID: 2,
			status: true
		},
		{ // admin - tutor 1 (course 1)
			id: 8,
			accountID: 0, tutorID: 1, courseID: 1,
			status: true
		},
		{ // admin - tutor 3 (course 1)
			id: 9,
			accountID: 0, tutorID: 3, courseID: 1,
			status: false
		},
		{ // admin - tutor 3 (course 3)
			id: 10,
			accountID: 0, tutorID: 3, courseID: 3,
			status: false
		},
		{ // admin - tutor 1 (course 3)
			id: 11,
			accountID: 0, tutorID: 1, courseID: 3,
			status: true
		},
		{ // admin - tutor 2 (course 2)
			id: 12,
			accountID: 0, tutorID: 2, courseID: 2,
			status: true
		}
	],
	message: [
		{id: 0, tutorAccountCourseID: 0, sender: 1, content: "2333333333", datetime: new Date(2022, 1, 25)},
		{id: 1, tutorAccountCourseID: 0, sender: 1, content: "2333333333", datetime: new Date(2022, 1, 25)},
		{id: 2, tutorAccountCourseID: 2, sender: 5, content: "2333333333", datetime: new Date(2022, 1, 25)},
		{id: 3, tutorAccountCourseID: 1, sender: 4, content: "2333333333", datetime: new Date(2022, 1, 25)},
		{id: 4, tutorAccountCourseID: 1, sender: 2, content: "2333333333", datetime: new Date(2022, 1, 25)},
	],
	schedule: [
		{id: 0, tutorAccountCourseID: 0, title: "CSC309 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-7"), url: "https://google.com"},
		{id: 1, tutorAccountCourseID: 1, title: "Lecture 1", description: "CSC343 Lecture", datetime: new Date("2022-3-11"), url: "https://google.com"},
		{id: 2, tutorAccountCourseID: 1, title: "Lecture 2", description: "CSC343 Lecture", datetime: new Date("2022-3-18"), url: "https://google.com"},
		{id: 3, tutorAccountCourseID: 1, title: "Lecture 3", description: "CSC343 Lecture", datetime: new Date("2022-3-25"), url: "https://google.com"},
		{id: 4, tutorAccountCourseID: 1, title: "Lecture 4", description: "CSC343 Lecture", datetime: new Date("2022-4-1"), url: "https://google.com"},
		{id: 5, tutorAccountCourseID: 2, title: "Lecture 1", description: "STA247 Lecture", datetime: new Date("2022-3-28"), url: "https://google.com"},
		{id: 6, tutorAccountCourseID: 2, title: "Lecture 2", description: "STA247 Lecture", datetime: new Date("2022-4-4"), url: "https://google.com"},
		{id: 7, tutorAccountCourseID: 3, title: "Class 1", description: "CSC309 Class", datetime: new Date("2022-3-9"), url: "https://google.com"},
		{id: 8, tutorAccountCourseID: 3, title: "Class 2", description: "CSC309 Class", datetime: new Date("2022-3-16"), url: "https://google.com"},
		{id: 9, tutorAccountCourseID: 3, title: "Class 3", description: "CSC309 Class", datetime: new Date("2022-3-23"), url: "https://google.com"},
		{id: 10, tutorAccountCourseID: 3, title: "Class 4", description: "CSC309 Class", datetime: new Date("2022-3-30"), url: "https://google.com"},
		{id: 11, tutorAccountCourseID: 4, title: "Class 1", description: "Class", datetime: new Date("2022-3-14"), url: "https://google.com"},
		{id: 12, tutorAccountCourseID: 4, title: "Class 2", description: "Class", datetime: new Date("2022-3-21"), url: "https://google.com"},
		{id: 13, tutorAccountCourseID: 4, title: "Class 3", description: "Class", datetime: new Date("2022-3-28"), url: "https://google.com"},
		{id: 14, tutorAccountCourseID: 4, title: "Class 4", description: "Class", datetime: new Date("2022-4-4"), url: "https://google.com"},
		{id: 15, tutorAccountCourseID: 5, title: "CSC343 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-8"), url: "https://google.com"},
		{id: 16, tutorAccountCourseID: 6, title: "MAT344 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-9"), url: "https://google.com"},
		{id: 17, tutorAccountCourseID: 7, title: "MAT344 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-10"), url: "https://google.com"},
		{id: 18, tutorAccountCourseID: 8, title: "CSC343 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-11"), url: "https://google.com"},
		{id: 19, tutorAccountCourseID: 9, title: "CSC343 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-2-28"), url: "https://google.com"},
		{id: 20, tutorAccountCourseID: 10, title: "STA247 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-1"), url: "https://google.com"},
		{id: 21, tutorAccountCourseID: 11, title: "STA247 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-2"), url: "https://google.com"},
		{id: 22, tutorAccountCourseID: 12, title: "MAT344 Interview", description: "Interview on Tutor Application", datetime: new Date("2022-3-3"), url: "https://google.com"},
	],
}

export default mockData;