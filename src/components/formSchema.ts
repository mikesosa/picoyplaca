import * as yup from "yup";

export const formSchema = yup.object().shape({
  number: yup.string().required("Required"),
});
