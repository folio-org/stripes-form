import React from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { flatten } from 'flat';
import StripesFormWrapper from './StripesFormWrapper';

//  function to scroll to the topmost validation error on a form submit
const scrollToError = (errors) => {
  const errorElements = flatten(errors);
  const topMostErrorElement = Object.keys(errorElements).reduce((firstErrorElement, secondErrorElement) =>
    (document.querySelector(`[name="${firstErrorElement}"]`).getBoundingClientRect().top <
    document.querySelector(`[name="${secondErrorElement}"]`).getBoundingClientRect().top
      ? firstErrorElement : secondErrorElement));
  document.querySelector(`[name="${topMostErrorElement}"]`).scrollIntoView({ top: 0, behavior: 'smooth' });
};

const optWithOnSubmitFail = opts => Object.assign({
  onSubmitFail: (errors, dispatch, submitError) => {
    if (submitError && !(submitError instanceof SubmissionError)) {
      // eslint-disable-next-line no-console
      console.error(submitError);
      throw new SubmissionError({ message: submitError.message });
    } else {
      // eslint-disable-next-line no-console
      console.warn(errors);
      if (errors) scrollToError(errors);
    }
  },
}, opts);

export default function stripesForm(opts) {
  return (Form) => {
    const StripesForm = props => <StripesFormWrapper {...props} Form={Form} formOptions={opts} />;
    return reduxForm(optWithOnSubmitFail(opts))(StripesForm);
  };
}
