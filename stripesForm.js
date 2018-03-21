import React from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { flatten } from 'flat';
import StripesFormWrapper from './StripesFormWrapper';

//  function to scroll to the topmost validation error on a form submit
const scrollToError = (errors) => {
  const errorElements = flatten(errors);

  //  function to replace error names of type 'addresses.0.addressType' to 'addresses[0].addressType'
  function replacer(match, p1, p2) {
    return ['[', p2, ']'].join('');
  }

  Object.keys(errorElements).forEach((key) => {
    if (key.match(/(\.)(\d+)/)) {
      const newKey = key.replace(/(\.)(\d+)/, replacer);
      errorElements[newKey] = errorElements[key];
      delete errorElements[key];
    }
  });

  const topMostErrorElement = Object.keys(errorElements).reduce((topMostelement, currentElement) => {
    const topMostelementSelector = document.querySelector(`[name="${topMostelement}"]`);
    const currentElementSelector = document.querySelector(`[name="${currentElement}"]`);

    if (topMostelementSelector && currentElementSelector) {
      // compare the top values and return the minimum one
      return (currentElementSelector.getBoundingClientRect().top <
      topMostelementSelector.getBoundingClientRect().top) ? currentElement : topMostelement;
    } else {
      return currentElementSelector ? currentElement : topMostelement;
    }
  }, null);
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
      if (errors && (typeof opts.scrollToError === 'undefined' || opts.scrollToError === true)) {
        scrollToError(errors);
      }
    }
  },
}, opts);

export default function stripesForm(opts) {
  return (Form) => {
    const StripesForm = props => <StripesFormWrapper {...props} Form={Form} formOptions={opts} />;
    return reduxForm(optWithOnSubmitFail(opts))(StripesForm);
  };
}
