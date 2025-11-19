import { useForm } from "@/hooks/useForm";
import { contactValidation } from "../contactValidation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";

// Hook for contact form
export const useContactForm = () => {
  return useForm({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validation: contactValidation,
    onSubmit: async (data) => {
      try {
        await addDoc(collection(database, "messages"), {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          createdAt: serverTimestamp(),
        });
        console.log("Message sent successfully!");
        // TODO: Show success message to user
      } catch (err) {
        console.error("Failed to send message:", err);
        // TODO: Show error message to user
        throw err;
      }
    },
  });
};
