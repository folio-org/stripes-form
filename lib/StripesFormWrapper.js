import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { submit } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { LastVisitedContext } from '@folio/stripes-core';
import { ConfirmationModal } from '@folio/stripes-components';

class StripesFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      nextLocation: null,
    };

    this.saveChanges = this.saveChanges.bind(this);
    this.continue = this.continue.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (this.props.formOptions.navigationCheck) {
      this.unblock = this.props.history.block((nextLocation) => {
        const { dirty, submitSucceeded, submitting } = this.props;
        const shouldPrompt = dirty && !submitSucceeded && !submitting;

        if (shouldPrompt) {
          this.setState({
            openModal: true,
            nextLocation,
          });
        }
        return !shouldPrompt;
      });
    }
  }

  componentWillUnmount() {
    if (this.props.formOptions.navigationCheck) {
      this.unblock();
    }
  }

  saveChanges(ctx) {
    this.props.dispatch(submit(this.props.formOptions.form));

    if (this.props.invalid) {
      this.closeModal();
    } else {
      this.continue(ctx);
    }
  }

  continue(ctx) {
    const {
      nextLocation: {
        pathname,
        search,
      },
    } = this.state;

    ctx.cachePreviousUrl();
    this.unblock();
    this.props.history.push(`${pathname}${search}`);
  }

  closeModal() {
    this.setState({
      openModal: false,
    });
  }

  handleConfirm = (ctx) => {
    const { formOptions: { allowRemoteSave } } = this.props;

    return allowRemoteSave ? this.saveChanges(ctx) : this.closeModal();
  };

  render() {
    const { formOptions: { allowRemoteSave } } = this.props;
    const { openModal } = this.state;

    return (
      <LastVisitedContext.Consumer>
        { ctx => (
          <>
            <this.props.Form {...this.props} />
            <ConfirmationModal
              id="cancel-editing-confirmation"
              open={openModal}
              message={<FormattedMessage id="stripes-form.unsavedChanges" />}
              heading={<FormattedMessage id="stripes-form.areYouSure" />}
              onConfirm={() => this.handleConfirm(ctx)}
              onCancel={() => this.continue(ctx)}
              confirmLabel={
                allowRemoteSave ? (
                  <FormattedMessage id="stripes-form.saveChanges" />
                ) : (
                  <FormattedMessage id="stripes-form.keepEditing" />
                )
              }
              cancelLabel={<FormattedMessage id="stripes-form.closeWithoutSaving" />}
            />
          </>
        )}
      </LastVisitedContext.Consumer>
    );
  }
}

StripesFormWrapper.propTypes = {
  dirty: PropTypes.bool,
  dispatch: PropTypes.func,
  formOptions: PropTypes.shape({
    allowRemoteSave: PropTypes.bool,
    navigationCheck: PropTypes.bool,
    scrollToError: PropTypes.bool,
    form: PropTypes.string,
  }),
  history: PropTypes.shape({
    block: PropTypes.func,
    push: PropTypes.func,
  }),
  invalid: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  submitting: PropTypes.bool
};

export default withRouter(StripesFormWrapper);
