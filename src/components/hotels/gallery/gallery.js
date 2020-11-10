import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import { Link } from "react-router-dom";
import FadeIn from "react-fade-in";
import Placeholder from "../../placeholder";
import Breadcrumb from "../../common/breadcrumb";
import "react-image-lightbox/style.css";
import { getHotel } from "../../../services/hotelService";
import { getPhotos } from "../../../services/photoService";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex: 0,
      isOpen: false,
      loading: true,
      hotel: [],
      photos: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const hotelSlug = this.props.match.params.slug;
    const { data: hotel } = await getHotel(hotelSlug);

    if (this._isMounted) {
      this.setState({ hotel });
      const { data: photos } = await getPhotos(this.state.hotel.id);
      setTimeout(() => this.setState({ loading: false }), 4000);
      this.setState({ photos });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getPhotosArray() {
    const hotelPhotos = { ...this.state.photos };
    try {
      let images = [];
      for (const index in hotelPhotos) {
        const photo = hotelPhotos[index].image;
        images.push(photo);
      }
      return images;
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { photoIndex, isOpen } = this.state;
    let photos = this.getPhotosArray().map((image, index) => {
      return (
        <figure className="col-xl-3 col-sm-6" key={index}>
          {this.state.loading ? (
            <>
              <Placeholder />
            </>
          ) : (
            <FadeIn>
              <img
                onClick={() =>
                  this.setState({ photoIndex: index, isOpen: true })
                }
                src={image}
                alt="Gallery"
                className="img-thumbnail"
                style={{ cursor: "pointer" }}
              />
            </FadeIn>
          )}
        </figure>
      );
    });

    return (
      <div>
        <Breadcrumb title="Gallery" parent={"Hotel Gallery"} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <Link
                    to={`${process.env.PUBLIC_URL}/dashboard/hotels/upload/${this.props.match.params.slug}`}
                    className="btn btn-primary"
                    style={{ marginBottom: 20, marginTop: 20 }}
                  >
                    Add Photos
                  </Link>
                </div>
                <div className="my-gallery card-body row">{photos}</div>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={this.getPhotosArray()[photoIndex]}
            nextSrc={
              this.getPhotosArray()[
                (photoIndex + 1) % this.getPhotosArray().length
              ]
            }
            prevSrc={
              this.getPhotosArray()[
                (photoIndex + this.getPhotosArray().length - 1) %
                  this.getPhotosArray().length
              ]
            }
            imageTitle={photoIndex + 1 + "/" + this.getPhotosArray().length}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + this.getPhotosArray().length - 1) %
                  this.getPhotosArray().length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % this.getPhotosArray().length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default Gallery;
