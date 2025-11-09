import React from "react";
import PropTypes from "prop-types";
import InnerForm from "@wsb/guac-widget-shared/lib/components/Form";
import DataAid from "../../common/constants/data-aids";
import { UX2 } from "@wsb/guac-widget-core";
import Field from "../../common/constants/editable-field-tags";
import { FORM_PIVOT } from "../../common/constants/routes";

class ContactForm extends React.Component {
  render() {
    const { formTitle, category, section } = this.props;

    const titleElement = (
      <UX2.Element.Heading.Minor
        data-aid={DataAid.CONTACT_FORM_TITLE_REND}
        data-route={Field.FORM_TITLE}
        data-field-route={FORM_PIVOT}
        children={formTitle}
        style={{
          marginBottom: "medium",
        }}
      />
    );

    return (
      <UX2.Component.Grid inset={true} bottom={false}>
        <UX2.Element.Block
          data-aid={DataAid.CONTACT_FORM_CONTAINER_REND}
          category={category}
          section={section}
          style={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <InnerForm
            title={titleElement}
            dataAidPrefix="CONTACT"
            {...this.props}
          />
        </UX2.Element.Block>
      </UX2.Component.Grid>
    );
  }
}

ContactForm.propTypes = {
  formTitle: PropTypes.string,
  category: PropTypes.string,
  section: PropTypes.string,
  ...InnerForm.propTypes,
};

export default ContactForm;
