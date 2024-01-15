import { auth } from "../../init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
// import 'sweetalert2/src/sweetalert2.scss'
import {
  createUserWithEmailAndPassword,
  signOut
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
const Register = () => {
  let navigate = useNavigate();
  const signIn = ( email, password) => {
    Swal.showLoading()
    // const history = useHistory()
     createUserWithEmailAndPassword(auth, email, password)
     
     .then(() =>{
      signOut(auth)
      navigate('/signup')
      Swal.close()
      toast.success("Registered! You can login now")
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
  } 
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign Up as an Admin
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
                    className="block formik-input w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  
                </div>
                <div className="mt-2">
                  <Field
                    name="password"
                    autoComplete="current-password"
                    type="password"
                    required
                    className="block formik-input w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  Register
                </button>
                
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-10 text-center text-sm text-gray-500">
            Have an Account?{' '}
            <Link to='/signup' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign In here
            </Link>
          </p>
      </div>
      <ToastContainer />
    </div>
  );
 }
;

export default Register;
