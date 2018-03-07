# stripes-form

A [redux-form](https://github.com/erikras/redux-form) wrapper for Stripes

**Usage:**

    stripesForm({
	  ...options
	})(StripesComponent);

The options are passed through to `reduxForm`, so any applicable form options can be used here. In addition to the `reduxForm` options there are the following `stripesForm`-specific options:

    {navigationCheck: [true *defaults to false]}

This option will cause Stripes Form to do a dirty check on the form and in a case where there is unsaved data the user is prompted before navigating from the form.

    {allowRemoteSave: [true *defaults to false]}

This option will cause the navigation prompt to include a "Save Data" option which will remotely submit the form. This will only result in a persistence of the form data if persistence of the form's data is triggered by a form submission.

    {scrollToError: [true *defaults to false]}

    This option will cause Stripes Form to scroll to the topmost validation error after submitting a form.
