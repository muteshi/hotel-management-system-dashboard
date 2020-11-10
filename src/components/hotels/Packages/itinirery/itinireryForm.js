import React from "react";
import Joi from "joi-browser";
import Select from "react-select";
import Breadcrumb from "../../../common/breadcrumb";
import Form from "../../../common/form";
import {
  getItinirery,
  saveItinirery,
} from "../../../../services/itinireryService";
import { getPackages } from "../../../../services/packageService";
import { toast } from "react-toastify";

class ItinireryForm extends Form {
  state = {
    data: {
      package: [],
      description: "",
      title: "",
    },
    errors: {},
    packages: [],
  };
  schema = {
    id: Joi.number(),
    title: Joi.string().label("Title"),
    package: Joi.object().label("Package"),
    description: Joi.string().label("Description"),
  };

  async populatePackages() {
    const { data: packages } = await getPackages();
    this.setState({ packages });
  }

  async populateItinirery() {
    try {
      const itinireryId = this.props.match.params.itinireryId;
      if (itinireryId === "new-itinirery") return;
      const { data: itinirery } = await getItinirery(itinireryId);
      this.setState({ data: this.mapToViewModel(itinirery) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async componentDidMount() {
    await this.populateItinirery();
    await this.populatePackages();
  }

  handlePackageSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.package = selectedOption;
    this.setState({ data });
  };

  mapToViewModel(itinirery) {
    const pack = {
      label: itinirery.package_name,
      value: itinirery.package,
    };
    return {
      id: itinirery.id,
      package: pack,
      title: itinirery.title,
      description: itinirery.description,
    };
  }

  doSubmit = async () => {
    try {
      const data = this.state.data;
      const itinireryData = {
        ...data,
        package: data.package.value,
      };
      await saveItinirery(itinireryData);
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/packages`);
      toast.success("Itinirery saved successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    const { packages, data } = this.state;

    let packageOptions = packages.map(function (pack) {
      return { value: pack.id, label: pack.title };
    });

    return (
      <div>
        <Breadcrumb parent="Package itinirery" title="New itinirery" />
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="jumbotron">
              <h3>
                {" "}
                {this.props.match.params.itinireryId === "new-itinirery"
                  ? "Add itinirery to package"
                  : "Update itinirery "}
              </h3>
              <hr />

              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col">
                    <small className="text-muted">Select package</small>
                    <Select
                      isSearchable
                      value={data.package}
                      name="form-field-name"
                      className="mb-3"
                      onChange={this.handlePackageSelectChange}
                      options={packageOptions}
                      // isDisabled={isDisabled}
                      placeholder="Select package"
                    />
                    {/* {this.renderSelect(
                  "package",
                  "Select package",
                  this.state.packages
                )} */}
                  </div>
                  <div className="col">
                    {this.renderInput(
                      "title",
                      "Title of the itinirery",
                      "e.g Day 1: Pickup at the airport"
                    )}
                  </div>
                </div>

                {this.renderTextArea("description", "Brief description ")}

                {this.props.match.params.itinireryId === "new-itinirery"
                  ? this.renderButton("Save itinirery")
                  : this.renderButton("Update itinirery")}
              </form>
            </div>
            <div className="col-sm-10"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ItinireryForm;
