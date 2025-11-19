import { objectAccessor } from "./object";

export function getFormikTextFieldHelperText(
  formik: any,
  key: string,
  helperText?: string
) {
  return !!objectAccessor(formik.touched, key) &&
    objectAccessor(formik.errors, key)
    ? objectAccessor(formik.errors, key)
    : helperText;
}

export function getFormikTextFieldError(formik: any, key: string) {
  return (
    !!objectAccessor(formik.touched, key) &&
    !!objectAccessor(formik.errors, key)
  );
}

/**
 *
 * @param {*} formik
 * @param {*} key
 * @returns
 */
export function getFormikTextFieldHelperTextAndErrorProps(
  formik: any,
  key: string,
  helperText?: string
) {
  return {
    error: getFormikTextFieldError(formik, key),
    helperText: getFormikTextFieldHelperText(formik, key, helperText),
  };
}

/**
 * @param {*} formik
 * @param {*} key
 * @returns
 */
export function getFormikTextFieldProps(
  formik: any,
  key: string,
  helperText?: string
) {
  const value = objectAccessor(formik.values, key);
  return {
    value,
    onChangeText: (text: string) => formik.setFieldValue(key, text),
    onBlur: formik.handleBlur(key),
    ...getFormikTextFieldHelperTextAndErrorProps(formik, key, helperText),
  };
}

export function getFormikCheckFieldProps(
  formik: any,
  key: string,
  checkedValue = true
  // unCheckedValue = false
) {
  const textFieldProps = getFormikTextFieldProps(formik, key);

  const value =
    typeof checkedValue === "boolean"
      ? !!textFieldProps.value
      : textFieldProps.value;
  return {
    ...textFieldProps,
    value: value,
    checked: value === checkedValue,
  };
  // return {
  //   checked: !!formik.values[key],
  //   onChange: (e) => formik.setFieldValue(key, e.target.checked),
  // };
}
