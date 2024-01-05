import { auth, googleProvider } from "../../init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import {  useEffect } from "react";
// import 'sweetalert2/src/sweetalert2.scss'
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
// const Swal = require('sweetalert2')
const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Minimum of 6 Character!")
    .max(50, "Maximum of 50 Characters!")
    .required("Required"),
});
const Auth = ({ setUser }) => {
  let navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        
        setUser({ email: user.email, name: user.displayName, profile_pix: user.photoURL });
        navigate("/advice-list");
      } else {
        // No user is signed in
        // Handle accordingly, for instance, redirect to login page
      }
    });
    return () => unsubscribe();
  }, [setUser, navigate]);

  const signIn = ( email, password) => {
    Swal.showLoading()
    // const history = useHistory();
    
    
     createUserWithEmailAndPassword(auth, email, password)
     .then(() =>{
      // setEmail(auth?.currentUser?.email)
      // setName(auth?.currentUser?.displayName)
      // setProfilePix(auth?.currentUser?.photoURL)
      // setTimeout(()=> setUser({email: emailAddress, name: name, profile_pix: profilePix}), 5000)
      
      Swal.fire({
        title: "",
        text: "Login Successful!",
        icon: "success"
      });
      
     })
      
    .catch((err ) => {
      Swal.close()
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }) 
      
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((res) => {
    //     console.log(res.user);

    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(err.message, {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: false,
    //       progress: undefined,
    //       theme: "light",
    //       });
    //   });
  };
  const signInWithGoogle =  async () => {
    Swal.showLoading()
    try{
      console.log('I workeed')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('ressss')
      //  = await getRedirectResult(auth)
      console.log('I woed')
      
        if (result.user){
          console.log(result)
          Swal.fire({
            title: "",
            text: "Login Successful!",
            icon: "success"
          });
          navigate("/advice-list");
        }
        else{
          toast.error('Not a user')
          Swal.close()
        }
    }
    catch (error){
      Swal.close()
        toast.error('Error', {
          position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        })
    }
       
    
      // .catch((error) =>{
      //   toast.error(error)
      // })
      
    
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign In to use Adviza as an Admin
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          initialValues={{
            password: "",
            email: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            signIn(values.email, values.password);
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <Field
                    name="email"
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && touched.email ? (
                    <div className="text-sm text-red-400">{errors.email}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Field
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.password && touched.password ? (
                    <div className="text-sm text-red-400">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <button
                  type="Submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                 
                >
                  Sign In
                </button>
                <button
                  onClick={signInWithGoogle}
                  type="button"
                  className="text-white w-full mt-3  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                >
                  <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Sign up with Google<div></div>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
