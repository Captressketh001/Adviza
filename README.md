# Adviza

An Inspirational app for techies. Developer's get access to inspiring qoutes from Top Tech Leaders and Creator on LinkedIn. Firebase is used to store and retrieve advices. React and TailwindCSS is used for the interface design. I built this side project for the purpose of mastering React after doing Vue.JS for 2 years. The app is fully responsive and can adapt to user's devices. 

## 📦 Technologies

- `Vite`
- `React.js`
- `CSS`
- `Tailwind CSS`
- `Firebase`
- `Formik`
- `Yup`

## 🦄 Features

Here is a detail of what you see when you use Adviza:

- **Landing Page**: This page gives details of what the application does. Click on Get Started button to access the advice page and Become an admin to register/login as an admin.

- **Advice Page**: This is the main page of the application. The advices and qoutes is displayed here. Click on the dice button at the bottom of the advice card to see the next advice.

- **Sign Up Page**: You can register to use the application as an admin by signing up with your Email address or create a custom account using your desired email and password.

- **Log In Page**: This page allows you to login with your Email address or the custom account you created during signup.

- **Advice List Page**: This is the admin interface. Admin can add, edit, delete and set the status of the advice. An advice with an approval pending status will not be displayed on the main page.


## 👩🏽‍🍳 The Process

I started by building the advice page interface using Vanilla CSS and tailwind css. I created a firebase project, set it up in my react app. I went ahead to create the authentication module and collections for storing the advices. 

The advice collection has three fields: author, content and status. I also implemented a role based authentication using firebase cloud functions.

## 📚 What I Learned

During this project, I've being able to master some React concepts and Firebase functions.

###  `useEffect` Hook:

- **Loading data on first time Load**: Using the `useEffect` hook reminded me of the onMounted hook in vue.js.

###  `React Router`:

- **Protecting a route from unathorized access**: I learnt how to protect a route from unauthorized access using prop drilling.

###  Firebase Cloud Function:

- **Role based authentication**: I learnt how to write cloud functions to perform specific functions.

### 🎨 Using Tailwind CSS:

- **New Tools**: I used Tailwind css extensively for the first time in this project. I've always loved to write vanilla css but I'm blown off with Tailwind CSS features.


### 📈 Overall Growth:

Each part of this project challenged me to learn something new things even though I'm not new to development.

## 💭 How can it be improved?

- Use a backend tools to create APIs instead of Firebase.
- Improve Performance on both desktop and mobile from 87% and 59% to 100% respectively.
- Improve SEO from 85% to 100%.

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` or `yarn` in the project directory to install the required dependencies.
3. Run `npm run dev` or `yarn dev` to get the project started.
4. Open [http://localhost:5173](http://localhost:5173) (or the address shown in your console) in your web browser to view the app.


### Links

- GitHub URL: [https://github.com/Captressketh001/adviza](https://github.com/Captressketh001/adviza)
- Live Site URL: [https://adviza.netlify.app](https://adviza.netlify.app)

## Author

- Oluwakemi Omoyeni
    - LinkedIn URL - [Oluwakemi Omoyeni](https://www.linkedin.com/in/oluwakemi-omoyeni/)
    - Twitter URL - [https://twitter.com/cap_keth](https://twitter.com/cap_keth)
    - GitHub URL - [https://github.com/Captressketh001](https://github.com/Captressketh001)



