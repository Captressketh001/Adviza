import { Fragment, useRef, useState, useEffect } from "react";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { app } from "../../init";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "ldrs/ring";

import { signOut } from "firebase/auth";
import { auth } from "../../init";

const db = getFirestore(app);

const SignupSchema = Yup.object().shape({
  author: Yup.string().min(6, "Minimum of 6 Character!").required("Required"),
  content: Yup.string()
    .min(50, "Minimum of 50 Character!")
    .required("Required"),
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const List = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openSignOut, setOpenSignOut] = useState(false);
  const cancelButtonRef = useRef(null);
  const [advices, setAdvices] = useState([]);
  const [adviceid, setAdviceId] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  let navigate = useNavigate();

  const initialValues = isAddMode
    ? {
        author: "",
        content: "",
      }
    : { author, content };

  const onSubmit = (fields, { setStatus, setSubmitting }) => {
    setStatus();
    if (isAddMode) {
      addAdvice(fields.author, fields.content, setSubmitting);
    } else {
      updateAdvice(fields.author, fields.content, setSubmitting);
    }
  };
  const fetchAdvice = async () => {
    Swal.showLoading();
    await getDocs(collection(db, "advice"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAdvices(newData);
        setIsLoading(false);
        Swal.close();
      })
      .catch((error) => {
        toast.error("Error Fetching Advice List", error);
        setIsLoading(false);
        Swal.close();
      });
  };
  const addAdvice = async (author, content, setSubmitting) => {
    Swal.showLoading();
    setOpenAdd(false);
    try {
      await addDoc(collection(db, "advice"), {
        author: author,
        content: content,
        status: false,
      });
      toast.success("Advice Added Successfully");
      Swal.showLoading();
      fetchAdvice();
    } catch (e) {
      toast.error("Error Adding Advice: ", e);
      setSubmitting(false);
    }
  };
  const deleteAdvice = async (id) => {
    setOpen(false);
    try {
      await deleteDoc(doc(db, "advice", id));
      fetchAdvice();
      toast.success("Advice deleted Successfully");
    } catch (e) {
      toast.error("Error deleting Advice: ", e);
    }
  };
  const handleDelete = (id) => {
    setAdviceId(id);
    setOpen(true);
  };
  const updateStatus = (id, status) => {
    const docRef = doc(db, "advice", id);
    let data = {
      status: status,
    };
    updateDoc(docRef, data)
      .then(() => {
        toast.success("Advice Status Updated!");
        fetchAdvice();
      })
      .catch((error) => {
        toast.error("Error updating status", error);
      });
  };

  const updateAdvice = (author, content, setSubmitting) => {
    Swal.showLoading();
    setOpenAdd(false);
    const docRef = doc(db, "advice", adviceid);
    let data = {
      author: author,
      content: content,
    };
    updateDoc(docRef, data)
      .then(() => {
        toast.success("Advice Status Updated!");
        Swal.showLoading();
        fetchAdvice();
      })
      .catch((error) => {
        toast.error("Error updating status", error);
        setSubmitting(false);
      });
  };
  const handleEdit = (advice) => {
    setAdviceId(advice.id);
    setAuthor(advice.author);
    setContent(advice.content);
    setOpenAdd(true);
    setIsAddMode(false);
  };
  const logOut = async () => {
    try {
      Swal.showLoading();
      await signOut(auth);
      Swal.close();
      navigate("/signup");
    } catch (err) {
      Swal.close();
      toast.error(err);
    }
  };
  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <>
      <Disclosure as="nav" className="bg-indigo-800">
        {
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  {/* Mobile menu button*/}
                  <div
                    className="flex flex-shrink-0 items-center text-white cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    ADVIZA ADMIN
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  {/* <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div> */}
                </div>
                <p className="text-white text-xs hidden sm:block">
                  Welcome, {user?.name}
                </p>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">User Image</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            user?.profile_pix ? (
                              user?.profile_pix
                            ) : (
                              <UserCircleIcon
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                              />
                            )
                          }
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() => setOpenSignOut(true)}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/* <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel> */}
          </>
        }
      </Disclosure>

      <div style={{ width: "95%", margin: "0 auto" }}>
        <div className="relative overflow-x-auto shadow-md mt-5 mb-5">
          <div className="flex justify-between items-center">
            <p className="mx-2">List of all advices</p>
            <button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="inline-flex sm:w-auto m-2 bg-indigo-700 justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white text-left shadow-sm  w-auto"
            >
              Add Advice
            </button>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium border border-slate-300"
                >
                  S/N
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium border border-slate-300"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium border border-slate-300"
                >
                  Content
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium dark:text-white border border-slate-300"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center font-medium border border-slate-300"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 border border-slate-300">
                    Loading...
                  </td>
                </tr>
              ) : advices.length > 0 ? (
                advices.map((advice, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 border border-slate-300">
                      {i + 1}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-slate-300"
                    >
                      {advice.author}
                    </th>
                    <td className="px-6 py-4 border border-slate-300">
                      {advice.content}
                    </td>
                    <td className="px-6 py-4 border border-slate-300">
                      {advice.status ? "Approved" : "Pending Approval"}
                    </td>
                    <td className="px-6 py-4 border border-slate-300 text-center">
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => handleEdit(advice)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                        onClick={() => handleDelete(advice.id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                        onClick={() => updateStatus(advice.id, !advice.status)}
                      >
                        Set Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 border border-slate-300">
                    No Record at the moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete advice?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this advice? This
                            advice will be permanently removed. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => deleteAdvice(adviceid)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openSignOut} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenSignOut}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Sign Out?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to sign out of this platform?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={logOut}
                    >
                      Sign Out
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={openAdd} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenAdd}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="sm:flex min-h-full items-end justify-center p-4 sm:items-left sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div>
                      <div className="mt-3  sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {isAddMode ? "Add a new advice" : "Edit Advice"}
                        </Dialog.Title>
                        <div className="mt-10 sm:mx-auto sm:w-full ">
                          <Formik
                            initialValues={initialValues}
                            validationSchema={SignupSchema}
                            onSubmit={onSubmit}
                          >
                            {({ errors, touched, isSubmitting }) => {
                              return (
                                <Form className="space-y-6 ">
                                  <div>
                                    <label
                                      htmlFor="author"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Author
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        name="author"
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      {errors.author && touched.author ? (
                                        <div className="text-sm text-red-400">
                                          {errors.author}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="content"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Content
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        name="content"
                                        as="textarea"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      {errors.content && touched.content ? (
                                        <div className="text-sm text-red-400">
                                          {errors.content}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div></div>
                                  <div></div>
                                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                      type="Submit"
                                      disabled={isSubmitting}
                                      className="inline-flex  w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                    >
                                      {isAddMode ? "Create" : "Update"}
                                    </button>

                                    <button
                                      type="button"
                                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                      onClick={() => setOpenAdd(false)}
                                      ref={cancelButtonRef}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </Form>
                              );
                            }}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ToastContainer />
    </>
  );
};

export default List;
