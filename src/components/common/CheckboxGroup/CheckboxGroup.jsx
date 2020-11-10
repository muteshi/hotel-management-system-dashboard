import React, { Component } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import "../../../assets/scss/CheckboxGroup.scss";
import CheckboxItem from "./CheckboxItem/CheckboxItem";

class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentCheckboxChecked: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateParentWithChildren(nextProps);
  }

  componentWillMount() {
    this.updateParentWithChildren(this.props);
  }

  handleParentCheckboxChange = (isChecked) => {
    const { data, onCheckboxGroupChange } = this.props;
    const newCheckState = data.map((aCheckbox) => ({
      ...aCheckbox,
      checked: isChecked,
    }));
    onCheckboxGroupChange(newCheckState);
  };

  updateParentWithChildren = (props) => {
    const { data } = props;
    let allChecked = false;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].checked) {
        allChecked = true;
      } else {
        allChecked = false;
        break;
      }
    }
    this.setState({
      parentCheckboxChecked: allChecked,
    });
  };

  handleChildCheckboxChange = (isChecked, index) => {
    const { data } = this.props;
    const { onCheckboxGroupChange } = this.props;
    const newCheckState = data.map((aCheckbox, i) =>
      index === i ? { ...aCheckbox, checked: isChecked } : aCheckbox
    );
    onCheckboxGroupChange(newCheckState);
  };

  renderCheckboxes = () => {
    const { data } = this.props;
    if (!data) {
      return null;
    }
    return data.map((aCheckbox, index) => (
      <CheckboxItem
        key={index}
        checkboxLabel={aCheckbox.name}
        checkboxValue={aCheckbox.name}
        checked={aCheckbox.name}
        checkboxChangeCallback={(checkStatus) =>
          this.handleChildCheckboxChange(checkStatus, index)
        }
      />
    ));
  };

  render() {
    const { parentCheckboxChecked } = this.state;
    return (
      <div className="checkbox-wrapper">
        <FormGroup>
          <div className="checkbox-head">
            <CheckboxItem
              checkboxLabel="All"
              checkboxValue="all"
              checked={parentCheckboxChecked}
              checkboxChangeCallback={this.handleParentCheckboxChange}
            />
          </div>
          <div className="checkbox-children">{this.renderCheckboxes()}</div>
        </FormGroup>
      </div>
    );
  }
}

export default CheckboxGroup;
