import React, { Component, Fragment } from "react";
import ImageUploader from "react-images-upload";
import { toast } from "react-toastify";
import Breadcrumb from "../../common/breadcrumb";
import { getPackage } from "../../../services/packageService";
import { uploadPackagePhotos } from "../../../services/photoService";

class UploadPackageImages extends Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  async onDrop(pictureFiles) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles),
    });
  }

  validate = () => {
    if (this.state.pictures.length <= 4) {
      return true;
    } else {
      return false;
    }
  };

  photosUploadHandler = async () => {
    const uploadedPhotos = this.state.pictures;
    const photoData = new FormData();
    for (var i = 0; i < uploadedPhotos.length; i++) {
      photoData.append("image", uploadedPhotos[i]);
    }
    const packageSlug = this.props.match.params.slug;
    const { data: packageData } = await getPackage(packageSlug);
    photoData.append("package", packageData.id);
    try {
      await uploadPackagePhotos(photoData);
      toast.success("Successfully uploaded");
      this.props.history.replace(
        `${process.env.PUBLIC_URL}/dashboard/package/gallery/${packageSlug}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Fragment>
        <Breadcrumb title="Upload" parent="Gallery" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>
                    Upload images (atleast 5 images )for your package gallery
                  </h5>
                </div>
                <div className="card-body">
                  <ImageUploader
                    withIcon={false}
                    withPreview={true}
                    label=""
                    buttonText="Upload Images"
                    onChange={this.onDrop}
                    imgExtension={[".jpg", ".jpeg", ".png"]}
                    maxFileSize={1048576}
                    fileSizeError=" file size is too big"
                  />
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => this.photosUploadHandler()}
                    disabled={this.validate()}
                  >
                    Submit Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UploadPackageImages;
