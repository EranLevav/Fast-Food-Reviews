# Fast Food Reviews
### submitters:
Eran Levav
<br>Yaniv Fleischer
#
### <i>Design of the Project:</i> <br><br>
## FrontEnd
The front-end is divided into 2 parts, the Login Page and the Main Page.
### Login Page:
Has a SignIn feature for regular users or users that want to log-in via facebook. <br>
Has a Register feature for new users, location is integrated with google maps.
Forms are created via Redux-form.

### Main Page:
With React-router, different components are rendered to the screen, depending on the users request.
The different pages that are displayed on the main page are:
1. Settings page - a user can change his settings.
2. My reviews page - a user can see his own reviews and edit/delete them.
3. Reviews page - a user can see reviews from restaurant/other users.
4. Users page - a user can search for other users and see their information and reviews. (search by name and location)
5. Restaurant page - a user can search for restaurants and see their information and reviews. (search by name and location)
6. Review page - a user can submit or edit a review.

<b>
All components are stateless, use saga to communicate with Back-end and Redux to communicate with Front-end. 
<br>
All files are resized so they can be rendered with ease.
</b>

## BackEnd: 
Contains the following functionality:
1. Models - model for review, restaurant, user.
2. Apis - get and post requests.
3. Additional function - utils.
4. Uses Multer to store files. (pictures)

### <i>An Example For website Flow:</i> <br><br>

Register: <br>
1. Users submits Redux-form (form has validation)
2. Form sends an action, Saga catches the action and sends a post request to the BackEnd. the request is FormData. (might contain a file)
3. The backEnd validates, is success then it responds with new user information and a token.
4. The token is stored in the local storage and the user information is saved in Redux state.
5. The main page is loaded with relevant user information.


## Bonus Features:
We integrated with google maps and facebook.

## Additional Libraries
1. Multer
2. React-dropZone
3. Material-ui
4. React-facebook
5. Redux-form

## Running Locally
### Google Maps API Key: <br>
Create a new API key from the Google developer console, making sure that Maps JavaScript API has been enabled. <br> 
Copy that key into your .env file creating an ENV var with the name REACT_APP_KEY

### To start the server:
    1. start mongodb using mongod
    2. node src\server\server.js # backend
    3. npm run dev # frontend

#### <b>or</b>

    click on "load" bash file.

 
This project is based on [this](https://github.com/wix-incubator/flickr-gallery-exam) code.