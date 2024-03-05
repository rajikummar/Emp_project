import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DisplayContactUsService } from '../display-contact-us.service';
import { FormsModule } from '@angular/forms'; 
import { getLocaleFirstDayOfWeek } from '@angular/common';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';



@Component({
  selector: 'app-jobdemplyoee',
  templateUrl: './jobdemplyoee.component.html',
  styleUrls: ['./jobdemplyoee.component.css']
})
export class JobdemplyoeeComponent implements OnInit {
  studentArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  formData: any = {};
  Sno: any;
  Recruiter_Name: any;
  Interview_schedule: any;
  Completed: any;
  No_Selection: any;
  No_of_client_submissions: any;
  No_Onborading: any;
  Date: any;
  currentStudentSno = '';
  No_Of_Schedules: any;
  Offer_Drops: any;
  submittedData: any;
  Status='';
studentItem: any;
originalData: any;
modal: any;
deletedSno: number | null = null;
record: any;
search:string='';

  constructor(private http: HttpClient,private contact_us_servive:DisplayContactUsService) {
  }
      ngOnInit(): void {
    this.getAllStudent();

  }
  


  getAllStudent() {
    console.log('raji')
    this.http.get("http://localhost:3000/api/records").subscribe(
      (resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData);
        this.studentArray = resultData;

        this.studentArray.forEach(record => {
          record.Date = new Date(record.Date).toLocaleDateString('en-CA'); 
        });
        
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  searchData(){
    if(this.search===''){
      this.getAllStudent()
      return
    }
    this.studentArray=[...this.studentArray]?.filter((student)=> student.Recruiter_Name.toLowerCase().includes(this.search.toLowerCase()))
  }

//download
downloadData(studentItem: any): void {
  console.log(studentItem);

  this.http.get(`http://localhost:3000/api/download/${studentItem}`, { responseType: 'blob' })
    .subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const pdfWidth = 210; 
      const pdfHeight =297; 
      const doc = new jsPDF.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
     
       const logoImg = new Image();
      logoImg.src = '/assets/download.jpeg'; 
      doc.addImage(logoImg, 'PNG', 30, 10, 20, 25); 

      
      
     // Add content text
      doc.setFontSize(15);
      doc.text(`Recruiter Name: ${studentItem.Recruiter_Name}`, 30, 50);

      doc.text(`Date: ${studentItem.Date}`, 30, 60);

        const tableData = [

      
          ['Recruiter_Name', 'No_of_client_submissions','Interview_schedule','Completed','No_Selection','No_Onborading','Offer_Drops','Date'], 
        [studentItem.Recruiter_Name, studentItem.No_of_client_submissions,studentItem.Interview_schedule,studentItem.Completed,studentItem.No_Selection,studentItem.No_Onborading,studentItem.Offer_Drops,studentItem.Date], 
      ];
      const tableWidth =400; // Adjust table width as needed
      const tableHeight = 20; // Adjust table height as needed
      const tableX = (pdfWidth - tableWidth) / 2; // Center the table horizontally
      const tableY = 110; 

      (doc as any).autoTable({
        startX: tableX,
        startY: tableY,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        margin: { top: 0 },
        styles: {
          headStyles: {
            
            fontSize: 30, // Adjust header font size
            fillColor: [252, 103, 1], // Change header background color (RGB format)
            textColor: [255, 255, 255], // Change header text color (RGB format)
            fontStyle: 'bold',
             // Set header text to bold
          },
          cellPadding: 2// Adjust cell padding if needed
        
        }
      });

      doc.save('student_data.pdf');

      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error fetching data:', error);
    });
}

  submitForm() {
   
    this.http.post<any>('http://localhost:3000/api/create', this.formData).subscribe(
    (response) => {
      console.log('Data submitted successfully:', response);
      this.getAllStudent()
      // if (response && response.message === "Record added successfully") {
      //   alert("Data is successfully created");
      // }
      // this.studentArray.push(response);
      this.formData = {}; 
    },
    (error) => {
      this.getAllStudent()
      console.error('Error submitting data:', error);
    }
  );
}

//set the update id
updateId!:number
updateGetID(selectedData:any){
this.updateId = selectedData.Sno;
this.formData.Recruiter_Name=selectedData.Recruiter_Name
this.formData.No_of_client_submissions=selectedData.No_of_client_submissions
this.formData.Interview_schedule=selectedData.Interview_schedule
this.formData.Completed=selectedData.Completed
this.formData.No_Selection=selectedData.No_Selection
this.formData.No_Of_Schedules=selectedData.No_Of_Schedules
this.formData.No_Onborading=selectedData.No_Onborading
this.formData.Offer_Drops=selectedData.Offer_Drops
this.formData.Date=selectedData.Date
console.log(selectedData)
}

updateData(): void {

  
  // console.log(id);
  if (this.updateId !== null) {
    console.log(this.updateId);
   this.contact_us_servive.updateData(this.updateId, this.formData).subscribe(
    (response) => {
      console.log('Data updated successfully:', response);
   this.getAllStudent()
   this.formData={}
    },
    (error) => {
      console.error('Error updating data:', error);
    }
  );
  }
  else {
    console.error('No id to update.');
  }

}
setdelete(id:number){
  this.deletedSno=id;
}
deleteData():void{
  console.log('Deleted Sno:', this.deletedSno);
    if (this.deletedSno === null || this.deletedSno === undefined) {
    console.error('Sno is null or undefined');
    return;
  }
  this.http.delete(`http://localhost:3000/api/delete/${this.deletedSno}`).subscribe(
    (response) => {
      console.log('Data deleted successfully:', response);
      this.getAllStudent();
    },
    (error) => {
      console.error('Error deleting data:', error);
    }
  );
 }



 
//  downloadData(studentItem: any): void {
//   console.log(studentItem);
  
//   // Assuming studentItem is the student ID or a relevant identifier for fetching data from the API
//   this.http.get(`http://localhost:3000/api/download/${studentItem}`, { responseType: 'blob' })
//     .subscribe((data: Blob) => {
//       const blob = new Blob([data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);

//       // Fetch additional data or manipulate studentItem as needed to display in the table
//       // For demonstration, let's assume studentItem already contains relevant data to display

//       const doc = new jsPDF();
//       const tableData = [
//         ['Column 1', 'Column 2'], // Header
//         [studentItem.data1, studentItem.data2], // Data rows
//         // Add more rows if needed
//         ['Result:', studentItem.result] // Result
//       ];

//       // Build the table
//       doc.autoTable({
//         head: tableData.splice(0, 1), // Extract header from tableData
//         body: tableData
//       });

//       // Save the PDF
//       doc.save('student_data.pdf');

//       // Cleanup
//       window.URL.revokeObjectURL(url);
//     }, error => {
//       console.error('Error fetching data:', error);
//     });
// }




//orginal////

// downloadData(studentItem: any): void {
//   console.log(studentItem)
//   this.http.get(`http://localhost:3000/api/download/${studentItem}`, { responseType: 'blob' })
//     .subscribe((data: Blob) => {
//       const blob = new Blob([data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
      
//       window.open(url);
//     }, error => {
//       console.error('Error fetching data:', error);
//     });
// }

// }

}