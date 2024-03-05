
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');
const pdfkit = require('pdfkit');

app.use(cors());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Raji@123',
  database: 'uniquehire'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to my squl data base')
});

app.use(bodyParser.json());

app.post('/api/create', (req, res) => {
  let { Recruiter_Name, No_of_client_submissions, Interview_schedule, Completed, No_Of_Schedules, No_Selection, No_Onborading, Offer_Drops, Date } = req.body;
  
  // Execute the SQL insert query
  const query = `INSERT INTO emp_dashboard 
                 (Recruiter_Name, No_of_client_submissions, Interview_schedule, Completed, No_Of_Schedules, No_Selection, No_Onborading, Offer_Drops, Date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, [Recruiter_Name, No_of_client_submissions, Interview_schedule, Completed, No_Of_Schedules, No_Selection, No_Onborading, Offer_Drops, Date], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err.stack);
      res.status(500).send('Error adding record to the database');
      return;
    }
    console.log('Record added:', result);
    res.status(200).send('Record added successfully');
  });
});


app.get('/api/records', (req, res) => {
  const query = 'SELECT * FROM emp_dashboard';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Error fetching records from the database');
      return;
    }
    // console.log('Fetched records:', rows);
    res.json(rows);
  });
});




app.put('/api/update/:id', (req, res) => {
  const Sno = req.params.id;
  let body = req.body
  console.log(body, 'here update body');
  const recordData = {
    Sno,
    Recruiter_Name: body.Recruiter_Name,
    No_of_client_submissions: body.No_of_client_submissions,
    Interview_schedule: body.Interview_schedule,
    Completed: body.Completed,
    No_Of_Schedules: body.No_Of_Schedules,
    No_Selection: body.No_Selection,
    No_Onborading: body.No_Onborading,
    Offer_Drops: body.Offer_Drops,
    Date: body.Date
  };

  const updateQuery = `UPDATE emp_dashboard SET 
                      Recruiter_Name = '${recordData.Recruiter_Name}', 
                      No_of_client_submissions = ${recordData.No_of_client_submissions}, 
                      Interview_schedule = ${recordData.Interview_schedule}, 
                      Completed = ${recordData.Completed}, 
                      No_Of_Schedules = ${recordData.No_Of_Schedules}, 
                      No_Selection = ${recordData.No_Selection}, 
                      No_Onborading = ${recordData.No_Onborading}, 
                      Offer_Drops = ${recordData.Offer_Drops}, 
                      Date = '${recordData.Date}' 
                      WHERE Sno = ${Sno}`;


  connection.query(updateQuery, (error, results) => {
    if (error) {
      console.error('Error updating data in database:', error);
      res.status(500).json({ message: 'Error updating data' });
    } else {
      console.log('Data updated successfully');
      res.json({ message: 'Data updated successfully' });
    }
  });

});


app.delete('/api/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log(id, 'here id ')

  // Perform deletion operation in MySQL databasne using the ID
  const sql = `DELETE FROM emp_dashboard WHERE Sno= ${id}`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error deleting data from database:', error);
      res.status(500).json({ message: 'Error deleting data' });
    } else {
      console.log('Data deleted successfully');
      res.json({ message: 'Data deleted successfully' });
    }
  });
});



// app.get('/api/download/:Sno', (req, res) => {
//   const Sno= req.params.Sno;

//   // Query to fetch data based on recruiter's name
//   const query = `SELECT * FROM emp_dashboard WHERE Sno= ?`;

//   connection.query(query, [Sno], (err, rows) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).send('Error fetching data from the database');
//       return;
//     }

//     const headers = ['Sno', 'Recruiter Name', 'No of Client Submissions', 'Interview Schedule', 'Completed', 'No_Of_Schedules', 'No Selection', 'No Onboarding', 'Date'];
//     let csvData = '';

//     // Append table headers to CSV data
//     csvData += headers.join(',') + '\n';

//     // Append data rows to CSV data
//     rows.forEach(row => {
//       const rowData = headers.map(header => row[header.replace(' ', '_')]);
//       csvData += rowData.join(',') + '\n';
//     });

//     // Create PDF document
//     const doc = new pdfkit();
//     doc.text(csvData);

//     // Set response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${recruiterName}_data.pdf`);

//     // Pipe PDF document to response
//     doc.pipe(res);
//     doc.end();
//   });
// });


app.get('/api/download/:Sno', (req, res) => {
  const Sno = req.params.Sno;

  // Query to fetch data based on Sno
  const query = `SELECT * FROM emp_dashboard WHERE Sno = ?`;

  connection.query(query, [Sno], (err, rows) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).send('Error fetching data from the database');
    }

    const headers = ['Sno', 'Recruiter_Name', 'No_of_Client_Submissions', 'Interview_Schedule', 'Completed', 'No_Of_Schedules', 'No_Selection', 'No_Onboarding', 'Date'];

    const doc = new pdfkit();
    doc.text('Recruiter Data:\n\n');

    //Appen d table headers to PDF
    doc.text(headers.join('\t'));

    // Append data rows to PDF
    rows.forEach(row => {
      const rowData = headers.map(header => row[header]);
      doc.text(rowData.join('\t'));
    });

    // Pipe PDF document to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=recruiter_data.pdf`);
    doc.pipe(res);
    doc.end();
  });
});



// //download//
// app.get('/api/download/:recruiterName', (req, res) => {
//   const recruiterName = req.params.recruiterName;

//   // Query to fetch data based on recruiter's name
//   const query = `SELECT * FROM emp_dashboard WHERE Recruiter_Name = ?`;

//   connection.query(query, [recruiterName], (err, rows) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).send('Error fetching data from the database');
//       return;
//     }

//     const headers = ['Sno', 'Recruiter Name', 'No of Client Submissions', 'Interview Schedule', 'Completed', 'No_Of_Schedules', 'No Selection', 'No Onboarding', 'Date'];
//     let csvData = '';

//     // Append table headers to CSV data
//     csvData += headers.join(',') + '\n';

//     // Append data rows to CSV data
//     rows.forEach(row => {
//       const rowData = headers.map(header => row[header.replace(' ', '_')]);
//       csvData += rowData.join(',') + '\n';
//     });

//     // Set response headers for CSV download
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename=${recruiterName}_data.pdf`);

//     // Send CSV data as response
//     res.send(csvData);
//   });
// });



app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});




