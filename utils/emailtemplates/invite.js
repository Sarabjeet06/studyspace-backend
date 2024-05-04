/** @format */

export function sendInviteMail(token, url , new_user = false ,classroomName) {
      var join_url = "";
      if(new_user){
            join_url = `${url}signup?source=mail&&space_id=${token}`
      }else{
            join_url = `${url}login?source=mail&&space_id=${token}`
      }
   return `
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Classroom Invitation</title>
     <style>
       /* Add your custom CSS styles here */
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
       <h2>Classroom Invitation</h2>
       <p>Hello,</p>
       <p>You have been invited to join the <span style="font-weight: bold;">${classroomName}</span> space. To join, please use the following invitation code:</p>
       <p style="font-size: 20px; font-weight: bold;">${token}</p>
       <p>Alternatively, you can click the button below to join directly:</p>
       <p><a href="${join_url}" class="ButtonStyle">Join Space</a></p>
       <p>We look forward to having you in our space!</p>
     </div>
   </body>
   </html>
    `;
}
