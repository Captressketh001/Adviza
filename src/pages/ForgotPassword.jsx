import { auth } from "../../init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});
const ForgotPassword = () => {
  let navigate = useNavigate();
  const forgotPassword = (email) => {
    Swal.showLoading();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          title: "",
          text: "Password Reset Email Sent!",
          icon: "success",
        });
        navigate("/signup");
      })
      .catch((error) => {
        toast.error(error.message);
        Swal.close();
      });
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            forgotPassword(values.email);
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

              <div></div>
              <div>
                <button
                  type="Submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-10 text-center text-sm text-gray-500">
          Have an Account?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};
export default ForgotPassword;
