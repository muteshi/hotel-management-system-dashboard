import React, { Component, Fragment } from "react";
import ImageUploader from "react-images-upload";
import { toast } from "react-toastify";
import Breadcrumb from "../../common/breadcrumb";
import { getHotel } from "../../../services/hotelService";
import { uploadPhotos } from "../../../services/photoService";

class UploadImages extends Component {
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
    const picturesData = this.state.pictures;
    console.log(picturesData);
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
    const hotelSlug = this.props.match.params.slug;
    const { data: hotel } = await getHotel(hotelSlug);
    photoData.append("hotel", hotel.id);
    try {
      await uploadPhotos(photoData);
      toast.success("Successfully uploaded");
      this.props.history.replace(
        `${process.env.PUBLIC_URL}/dashboard/hotels/gallery/${hotelSlug}`
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
                    Upload images (atleast 5 images )for your hotel gallery
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

export default UploadImages;
