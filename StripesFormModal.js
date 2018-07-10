import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import ConfirmationModal from '@folio/stripes-components/lib/ConfirmationModal';

function StripesFormModal(props, context) {
  const unsavedChangesMsg = context.intl.formatMessage({ id: 'stripes-form.unsavedChanges' });
  const unsavedHeading = context.intl.formatMessage({ id: 'stripes-form.areYouSure' });

  return (
    <ConfirmationModal
      open={props.openWhen}
      message={unsavedChangesMsg}
      heading={unsavedHeading}
      onConfirm={props.remoteSave ? props.saveChanges : props.closeCB}
      onCancel={props.discardChanges}
      confirmLabel={props.remoteSave ? <FormattedMessage id="stripes-form.saveChanges" /> : <FormattedMessage id="stripes-form.keepEditing" />}
      cancelLabel={<FormattedMessage id="stripes-form.closeWithoutSaving" />}
    />
  );
}

StripesFormModal.propTypes = {
  openWhen: PropTypes.bool,
  saveChanges: PropTypes.func,
  discardChanges: PropTypes.func,
  closeCB: PropTypes.func,
  remoteSave: PropTypes.bool,
};
StripesFormModal.contextTypes = {
  intl: intlShape,
};

export default StripesFormModal;
