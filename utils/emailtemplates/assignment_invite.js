export function sendAssignmentNotificationMail(assignment, classroom_id, url , classroomName) {
      const { assignment_id, heading, description, deadline, total_points } = assignment;
      const assignment_url = `${url}/space/room?id=${classroom_id}`;
    
      return `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>New Assignment Notification</title>
         <style>
           body {
             font-family: Arial, sans-serif;
             margin: 0;
             padding: 0;
           }
           .container {
             max-width: 600px;
             margin: 0 auto;
             padding: 20px;
             box-sizing: border-box;
           }
           .logo {
             text-align: center;
             margin-bottom: 20px;
           }
           .logo img {
             max-width: 100%;
             height: auto;
           }
           .ButtonStyle {
             display: inline-block;
             padding: 10px 20px;
             text-align: center;
             background: #4CAF50;
             border-radius: 5px;
             text-decoration: none;
             color: #fff !important;
           }
           .ButtonStyle:hover {
             background: #45a049;
           }
           a {
             text-decoration: none;
             color: #45a049;
           }
         </style>
       </head>
       <body>
         <div class="container">
           <div class="logo">
             <img src="https://res.cloudinary.com/dqpirrbuh/image/upload/v1714824055/7218_fpzrit.jpg" alt="Your Logo">
           </div>
           <h2>New Assignment Assigned</h2>
           <p>Hello,</p>
           <p>A new assignment has been assigned to you in the <span style="font-weight: bold;">${classroomName}</span> classroom.</p>
           <p><strong>Assignment Details:</strong></p>
           <ul>
             <li><strong>Heading:</strong> ${heading}</li>
             <li><strong>Description:</strong> ${description}</li>
             <li><strong>Deadline:</strong> ${new Date(deadline).toLocaleString()}</li>
             <li><strong>Total Points:</strong> ${total_points}</li>
           </ul>
           <p>To view and complete the assignment, click the button below:</p>
           <p><a href="${assignment_url}" class="ButtonStyle">View Assignment</a></p>
           <p>Best regards,</p>
           <p>Your Classroom Team</p>
         </div>
       </body>
       </html>
        `;
    }
    