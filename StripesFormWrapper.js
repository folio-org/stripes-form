import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { submit } from 'redux-form';
import StripesFormModal from './StripesFormModal';

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
        const shouldPrompt = this.props.dirty && !this.props.submitSucceeded;
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

  saveChanges() {
    this.props.dispatch(submit(this.props.formOptions.form));

    if (this.props.invalid) {
      this.closeModal();
    } else {
      this.continue();
    }
  }

  continue() {
    this.unblock();
    this.props.history.goBack();
    setTimeout(() => {
      this.props.history.push(this.state.nextLocation.pathname);
    }, 1);
  }

  closeModal() {
    this.setState({
      openModal: false,
    });
  }

  render() {
    return (
      <div>
        <this.props.Form {...this.props} />
        <StripesFormModal
          openWhen={this.state.openModal}
          saveChanges={this.saveChanges}
          discardChanges={this.continue}
          remoteSave={this.props.formOptions.allowRemoteSave}
          closeCB={this.closeModal}
        />
      </div>
    );
  }
}

StripesFormWrapper.propTypes = {
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
  dirty: PropTypes.bool,
  dispatch: PropTypes.func,
  invalid: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
};

export default withRouter(StripesFormWrapper);
