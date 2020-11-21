import React from "react";
import Joi from "joi-browser";
import Breadcrumb from "../../common/breadcrumb";
import Form from "../../common/form";
import { getPackageTypes } from "../../../services/packageTypeService";
import { getPackage, savePackage } from "../../../services/packageService";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

class NewPackageForm extends Form {
  state = {
    data: {
      title: "",
      package_type: "",
      city: "",
      country: "",
      description: "",
    },
    errors: {},
    package_type: [],
  };
  schema = {
    title: Joi.string().required().label("Name of the package"),
    description: Joi.string().required().label("Brief Description"),
    package_type: Joi.number(),
    slug: Joi.string(),
    country: Joi.string().required().label("Country"),
    city: Joi.string().required().label("City/Town"),
  };

  async populatePackages() {
    try {
      const packageSlug = this.props.match.params.slug;
      if (packageSlug === "new-package") return;
      const { data: pack } = await getPackage(packageSlug);
      this.setState({ data: this.mapToViewModel(pack) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async populatePackageTypes() {
    try {
      const { data: package_type } = await getPackageTypes();
      this.setState({ package_type });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    await this.populatePackages();
    await this.populatePackageTypes();
  }

  mapToViewModel(pack) {
    return {
      slug: pack.slug,
      title: pack.title,
      description: pack.description,
      package_type: pack.package_type,
      city: pack.city,
      country: pack.country,
    };
  }

  doSubmit = async () => {
    try {
      await savePackage(this.state.data);

      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/packages`);
      toast.success("Package saved successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    return (
      <div>
        <Breadcrumb parent="Package" title="New package" />

        <hr className="mb-3" />
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="jumbotron">
              <h4>
                {" "}
                {this.props.match.params.slug === "new-package"
                  ? "Add New package form"
                  : "Update package form"}
              </h4>
              <hr />
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput("title", "", "Name of the package")}
                  </div>
                  <div className="col-sm-6">
                    {this.renderSelect(
                      "package_type",
                      "Package type",
                      this.state.package_type
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput(
                      "city",
                      "",
                      "City/Town/Location of this package"
                    )}
                  </div>
                  <div className="col-sm-6">
                    {this.renderInput("country", "", "Country")}
                  </div>
                </div>

                {this.renderTextArea("description", "", "Package Description")}
                {this.props.match.params.slug === "new-package"
                  ? this.renderButton("Save package")
                  : this.renderButton("Update package")}
              </form>
            </div>
          </div>
          <div className="col-sm-1"></div>
        </div>
      </div>
    );
  }
}

export default withRouter(NewPackageForm);
