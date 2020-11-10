import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import "../../../assets/css/hotelFacilitiesForm.css";
import { getRoom, updateRoomAmmenities } from "../../../services/roomService";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

class RoomAmmenitiesForm extends Form {
  state = {
    data: {
      free_toiletries: false,
      blackout_drapes: false,
      safe_deposit_box: false,
      lcd_tv: false,
      free_wifi: false,
      pay_tv: false,
      mini_bar: false,
      refrigerator: false,
      water_body_view: false,
      telephone: false,
      ironing_facilities: false,
      desk: false,
      hair_dryer: false,
      extra_towels: false,
      bathrobes: false,
      wake_up_service: false,
      electric_kettle: false,
      warddrobe: false,
      toilet_paper: false,
      slippers: false,
      toilet: false,
      alarm_clock: false,
      tea_coffee_maker: false,
      bathtub_shower: false,
      makeup_shaving_mirror: false,
      city_view: false,
      air_conditioner: false,
      cribs_infant_beds: false,
      daily_housekeeping: false,
      garden_view: false,
      projector: false,
      screen: false,
      conference_phone: false,
      water: false,
      speakers: false,
      whiteboard: false,
      sockets: false,
    },
    errors: {},
  };
  schema = {
    free_toiletries: Joi.boolean().label("Free Toiletries"),
    blackout_drapes: Joi.boolean().label("Blackout drapes"),
    safe_deposit_box: Joi.boolean().label("Safe deposit box"),
    lcd_tv: Joi.boolean().label("LCD TV"),
    free_wifi: Joi.boolean().label("Free WiFi"),
    pay_tv: Joi.boolean().label("Pay Tv"),
    mini_bar: Joi.boolean().label("Mini Bar"),
    refrigerator: Joi.boolean().label("Refrigerator"),
    water_body_view: Joi.boolean().label("Lake/Ocean/Sea view"),
    telephone: Joi.boolean().label("Telphone"),
    ironing_facilities: Joi.boolean().label("Ironing Facilities"),
    desk: Joi.boolean().label("Desk"),
    hair_dryer: Joi.boolean().label("Hair Dryer"),
    extra_towels: Joi.boolean().label("Extra towels"),
    bathrobes: Joi.boolean().label("Bathrobes"),
    wake_up_service: Joi.boolean().label("Wake up service"),
    electric_kettle: Joi.boolean().label("Electric kettle"),
    warddrobe: Joi.boolean().label("Wardrobe"),
    toilet_paper: Joi.boolean().label("Toilet paper"),
    slippers: Joi.boolean().label("Slippers"),
    toilet: Joi.boolean().label("Toilet"),
    alarm_clock: Joi.boolean().label("Alarm clock"),
    tea_coffee_maker: Joi.boolean().label("Tea/Coffee maker"),
    bathtub_shower: Joi.boolean().label("Bathtub/Shower"),
    makeup_shaving_mirror: Joi.boolean().label("Makeup/Shaving mirror"),
    city_view: Joi.boolean().label("City view"),
    air_conditioner: Joi.boolean().label("Air conditioner"),
    cribs_infant_beds: Joi.boolean().label("Cribs/Infants bed"),
    daily_housekeeping: Joi.boolean().label("Daily house keeping"),
    garden_view: Joi.boolean().label("Garden view"),
    projector: Joi.boolean().label("Projector"),
    screen: Joi.boolean().label("Screen"),
    conference_phone: Joi.boolean().label("Conference phone"),
    water: Joi.boolean().label("Bottled water"),
    speakers: Joi.boolean().label("Speakers"),
    whiteboard: Joi.boolean().label("Whiteboard"),
    sockets: Joi.boolean().label("Wall sockets"),
  };

  async populateRooms() {
    try {
      const roomId = this.props.match.params.roomId;
      if (roomId === "new-room") return;
      const { data: room } = await getRoom(roomId);
      this.setState({ data: this.mapToViewModel(room) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async componentDidMount() {
    await this.populateRooms();
  }

  mapToViewModel(room) {
    return {
      free_toiletries: room.free_toiletries,
      blackout_drapes: room.blackout_drapes,
      safe_deposit_box: room.safe_deposit_box,
      lcd_tv: room.lcd_tv,
      free_wifi: room.free_wifi,
      pay_tv: room.pay_tv,
      mini_bar: room.mini_bar,
      refrigerator: room.refrigerator,
      water_body_view: room.water_body_view,
      telephone: room.telephone,
      ironing_facilities: room.ironing_facilities,
      desk: room.desk,
      hair_dryer: room.hair_dryer,
      extra_towels: room.extra_towels,
      bathrobes: room.bathrobes,
      wake_up_service: room.wake_up_service,
      electric_kettle: room.electric_kettle,
      warddrobe: room.warddrobe,
      toilet_paper: room.toilet_paper,
      slippers: room.slippers,
      toilet: room.toilet,
      alarm_clock: room.alarm_clock,
      tea_coffee_maker: room.tea_coffee_maker,
      bathtub_shower: room.bathtub_shower,
      makeup_shaving_mirror: room.makeup_shaving_mirror,
      city_view: room.city_view,
      air_conditioner: room.air_conditioner,
      cribs_infant_beds: room.cribs_infant_beds,
      daily_housekeeping: room.daily_housekeeping,
      garden_view: room.garden_view,
      projector: room.projector,
      screen: room.screen,
      conference_phone: room.conference_phone,
      water: room.water,
      speakers: room.speakers,
      whiteboard: room.whiteboard,
      sockets: room.sockets,
    };
  }

  toggleCheckbox = (e) => {
    const AmmenityBoxName = e.target.name;
    this.setState((state) => ({
      data: {
        ...state.data,
        [AmmenityBoxName]: !state.data[AmmenityBoxName],
      },
    }));
  };

  toggleAllCheckboxes = (check) => {
    this.setState((state) => ({
      data: Object.keys(state.data).reduce((acc, key) => {
        acc[key] = check;
        return acc;
      }, {}),
    }));
  };

  doSubmit = async () => {
    try {
      const roomId = this.props.match.params.roomId;
      await updateRoomAmmenities(roomId, this.state.data);
      window.location.reload();
      toast.success("Settings submitted successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    return (
      <div>
        <div className="form-check">
          <label className="containerBox">
            <input
              type="checkbox"
              checked={Object.keys(this.state.data).every(
                (k) => this.state.data[k]
              )}
              onChange={(e) => this.toggleAllCheckboxes(e.target.checked)}
              className="form-check-input"
            />
            <span className="checkmark"></span>
            Select All
          </label>
        </div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="air_conditioner"
                    type="checkbox"
                    checked={this.state.data.air_conditioner}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Air Conditioner
                </label>
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="projector"
                    type="checkbox"
                    checked={this.state.data.projector}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Projector
                </label>
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="water"
                    type="checkbox"
                    checked={this.state.data.water}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Bottled water
                </label>
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="screen"
                    type="checkbox"
                    checked={this.state.data.screen}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Screen
                </label>
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="water_body_view"
                    type="checkbox"
                    checked={this.state.data.water_body_view}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Lake/Sea/Ocean view
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="conference_phone"
                    type="checkbox"
                    checked={this.state.data.conference_phone}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Conference Phone
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="alarm_clock"
                    type="checkbox"
                    checked={this.state.data.alarm_clock}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Alarm Clock
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="bathrobes"
                    type="checkbox"
                    checked={this.state.data.bathrobes}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Bathrobes
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="bathtub_shower"
                    type="checkbox"
                    checked={this.state.data.bathtub_shower}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Bathtub/Shower
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="blackout_drapes"
                    type="checkbox"
                    checked={this.state.data.blackout_drapes}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Blackout/Curtain Drapes
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="city_view"
                    type="checkbox"
                    checked={this.state.data.city_view}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  City view
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="cribs_infant_beds"
                    type="checkbox"
                    checked={this.state.data.cribs_infant_beds}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Infant bed/cribs
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="daily_housekeeping"
                    type="checkbox"
                    checked={this.state.data.daily_housekeeping}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Daily house keeping
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="desk"
                    type="checkbox"
                    checked={this.state.data.desk}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Working Space desk
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="electric_kettle"
                    type="checkbox"
                    checked={this.state.data.electric_kettle}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Electric kettle
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="extra_towels"
                    type="checkbox"
                    checked={this.state.data.extra_towels}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Extra towels
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="free_toiletries"
                    type="checkbox"
                    checked={this.state.data.free_toiletries}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Free Toiletries
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="free_wifi"
                    type="checkbox"
                    checked={this.state.data.free_wifi}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Free WiFi
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="garden_view"
                    type="checkbox"
                    checked={this.state.data.garden_view}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Garden view
                </label>{" "}
              </div>
            </div>
            <div className="col">
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="hair_dryer"
                    type="checkbox"
                    checked={this.state.data.hair_dryer}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Hair dryer
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="ironing_facilities"
                    type="checkbox"
                    checked={this.state.data.ironing_facilities}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Ironing facilities
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="lcd_tv"
                    type="checkbox"
                    checked={this.state.data.lcd_tv}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  TV
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="makeup_shaving_mirror"
                    type="checkbox"
                    checked={this.state.data.makeup_shaving_mirror}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Makeup/Shaving mirror
                </label>{" "}
              </div>

              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="mini_bar"
                    type="checkbox"
                    checked={this.state.data.mini_bar}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Mini bar
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="pay_tv"
                    type="checkbox"
                    checked={this.state.data.pay_tv}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Satellite/Pay Tv
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="refrigerator"
                    type="checkbox"
                    checked={this.state.data.refrigerator}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Refrigerator
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="safe_deposit_box"
                    type="checkbox"
                    checked={this.state.data.safe_deposit_box}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Safe deposit box
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="slippers"
                    type="checkbox"
                    checked={this.state.data.slippers}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Slippers
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="tea_coffee_maker"
                    type="checkbox"
                    checked={this.state.data.tea_coffee_maker}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Tea/Coffee maker
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="telephone"
                    type="checkbox"
                    checked={this.state.data.telephone}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Telphone
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="toilet"
                    type="checkbox"
                    checked={this.state.data.toilet}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Toilet
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="toilet_paper"
                    type="checkbox"
                    checked={this.state.data.toilet_paper}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Extra toilet paper
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="wake_up_service"
                    type="checkbox"
                    checked={this.state.data.wake_up_service}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Wake up service
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="warddrobe"
                    type="checkbox"
                    checked={this.state.data.warddrobe}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Wardrobe
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="whiteboard"
                    type="checkbox"
                    checked={this.state.data.whiteboard}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Whiteboard
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="speakers"
                    type="checkbox"
                    checked={this.state.data.speakers}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Speakers
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="sockets"
                    type="checkbox"
                    checked={this.state.data.sockets}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Wall Sockets
                </label>{" "}
              </div>
            </div>

            {this.props.match.params.slug === "new-hotel"
              ? this.renderButton("Submit Hotel facilities")
              : this.renderButton("Update Hotel facilities")}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(RoomAmmenitiesForm);
