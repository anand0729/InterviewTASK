# InterviewTASK
InterviewTASK - Node API <br />

## STEPS TO RUN APPLICATION <br />
RUN Command 'npm install' <br />
RENAME .env.dummy to .env and fill all the required details  <br />
RUN Command 'npm start' <br />

## API's
POST - /api/auth/register  - {"name":"","mobile":"","email":"","password":""}<br />
POST - /api/auth/login - {"username":"","password":""} <br />
POST - /api/auth/tokenRegenerate - ADD AUTHORIZATION 'Bearer token' <br />

###NOTE *
* I have allowed only 'POST METHOD' in CORS
* Max 5000 Req will be allowed every 15 mins (you can change in index.js inside Middleware Folder based on SERVER Analytics)




