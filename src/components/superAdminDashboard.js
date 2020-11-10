import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../services/bookingService";
import Activate from "../components/common/activate";
import { toast } from "react-toastify";
import {
  getUsers,
  deleteUser,
  partialUserUpdate,
} from "../services/userService";
import _ from "lodash";
import {
  isSameWeek,
  isSameYear,
  isSameMonth,
  isSameDay,
  isYesterday,
} from "date-fns";
import Breadcrumb from "../components/common/breadcrumb";
import Slider from "react-slick";
import auth from "../services/authService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Line } from "react-chartjs-2";
import { ShoppingCart } from "react-feather";
import CountUp from "react-countup";
let primary = localStorage.getItem("primary_color") || "#4466f2";

const totalSalesDivider = 1000;
const commissionSalesDivider = 100;

class SuperAdminDashboard extends Component {
  _isMounted = false;
  state = {
    bookings: [],
    users: [],
    dashBoardTotal: [],
    totalSalesPerMonth: [],
    totalCommissionPerMonth: [],
  };

  async componentDidMount() {
    document.title = "Marvellous Ventures SuperAdmin Dashboard";
    this._isMounted = true;

    const { data: bookings } = await getBookings();
    const user = auth.getCurrentUser();
    const { data: users } = await getUsers();
    if (this._isMounted) {
      this.setState({ bookings, user, users });
      const data = this.state.bookings;

      let sub_totals = data.map((num) => Number(num.final_total));

      const today = new Date();

      //get todays bookings
      const todayBookings = data.filter((booking) =>
        isSameDay(new Date(booking.created_at), today)
      );
      let today_totals = todayBookings.map((num) => Number(num.final_total));

      //get monthly total commission bookings
      const totalCommissionPerMonth = bookings.reduce((acc, cur) => {
        acc[new Date(cur.created_at).getMonth() + 1] =
          acc[new Date(cur.created_at).getMonth() + 1] +
            Number(cur.commission_total) || Number(cur.commission_total); // increment or initialize to cur.value
        return acc;
      }, {});

      this.setState({ totalCommissionPerMonth: totalCommissionPerMonth });

      //get monthly total sales bookings
      const totalSalesPerMonth = bookings.reduce((acc, cur) => {
        acc[new Date(cur.created_at).getMonth() + 1] =
          acc[new Date(cur.created_at).getMonth() + 1] +
            Number(cur.final_total) || Number(cur.final_total); // increment or initialize to cur.value
        return acc;
      }, {});

      this.setState({ totalSalesPerMonth: totalSalesPerMonth });

      const yesterdayBookings = data.filter((booking) =>
        isYesterday(new Date(booking.created_at), today)
      );
      let yesterday_totals = yesterdayBookings.map((num) =>
        Number(num.final_total)
      );

      const thisWeekBookings = data.filter((booking) =>
        isSameWeek(new Date(booking.created_at), today)
      );
      let week_totals = thisWeekBookings.map((num) => Number(num.final_total));

      const thisMonthBookings = data.filter((booking) =>
        isSameMonth(new Date(booking.created_at), today)
      );
      let month_totals = thisMonthBookings.map((num) =>
        Number(num.final_total)
      );

      const thisYearBookings = data.filter((booking) =>
        isSameYear(new Date(booking.created_at), today)
      );
      let year_totals = thisYearBookings.map((num) => Number(num.final_total));

      const dashBoardTotal = [
        { value: _.sum(today_totals), label: "Today sales" },
        { value: _.sum(yesterday_totals), label: "Yesterday sales" },
        { value: _.sum(week_totals), label: "Weekly sales" },
        { value: _.sum(month_totals), label: "Monthly sales" },
        { value: _.sum(year_totals), label: "Yearly sales" },
        { value: _.sum(sub_totals), label: "All time sales" },
      ];

      this.setState({ dashBoardTotal });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleActivate = async (user) => {
    const users = [...this.state.users];
    const index = users.indexOf(user);
    users[index] = { ...users[index] };
    users[index].is_active = !users[index].is_active;
    this.setState({ users });
    try {
      await partialUserUpdate(user.id, {
        is_active: users[index].is_active,
        from_api: true,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  handleDelete = async (user) => {
    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u.id !== user.id);
    this.setState({ users });
    try {
      await deleteUser(user.id);
      toast.error("User successfully deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This User has already been deleted");

      this.setState({ users: originalUsers });
    }
  };
  render() {
    const {
      dashBoardTotal,
      users,
      totalCommissionPerMonth,
      totalSalesPerMonth,
    } = this.state;

    let commissionData = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      datasets: [
        {
          lagend: "none",
          data: [
            totalCommissionPerMonth["1"] / commissionSalesDivider,
            totalCommissionPerMonth["2"] / commissionSalesDivider,
            totalCommissionPerMonth["3"] / commissionSalesDivider,
            totalCommissionPerMonth["4"] / commissionSalesDivider,
            totalCommissionPerMonth["5"] / commissionSalesDivider,
            totalCommissionPerMonth["6"] / commissionSalesDivider,
            totalCommissionPerMonth["7"] / commissionSalesDivider,
            totalCommissionPerMonth["8"] / commissionSalesDivider,
            totalCommissionPerMonth["9"] / commissionSalesDivider,
            totalCommissionPerMonth["10"] / commissionSalesDivider,
            totalCommissionPerMonth["11"] / commissionSalesDivider,
            totalCommissionPerMonth["12"] / commissionSalesDivider,
          ],
          lineTension: 0.05,
          borderColor: primary,
          backgroundColor: "transparent",
          pointBackgroundColor: primary,
          borderWidth: "2",
          fill: "origin",
        },
      ],
    };
    let totalSalesData = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      datasets: [
        {
          lagend: "Month",
          data: [
            totalSalesPerMonth["1"] / totalSalesDivider,
            totalSalesPerMonth["2"] / totalSalesDivider,
            totalSalesPerMonth["3"] / totalSalesDivider,
            totalSalesPerMonth["4"] / totalSalesDivider,
            totalSalesPerMonth["5"] / totalSalesDivider,
            totalSalesPerMonth["6"] / totalSalesDivider,
            totalSalesPerMonth["7"] / totalSalesDivider,
            totalSalesPerMonth["8"] / totalSalesDivider,
            totalSalesPerMonth["9"] / totalSalesDivider,
            totalSalesPerMonth["10"] / totalSalesDivider,
            totalSalesPerMonth["11"] / totalSalesDivider,
            totalSalesPerMonth["12"] / totalSalesDivider,
          ],
          lineTension: 0.05,
          borderColor: primary,
          backgroundColor: "transparent",
          pointBackgroundColor: primary,
          borderWidth: "2",
          fill: "origin",
        },
      ],
    };

    let commissionOptions = {
      maintainAspectRatio: false,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5000,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            display: true,
          },
        ],
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    };

    let totalSalesOptions = {
      maintainAspectRatio: false,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5000,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            display: true,
          },
        ],
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    };

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 370,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    let usersData = users
      .filter((user) => {
        return user.user_type_name === "Company";
      })
      .map((user) => {
        return (
          <tr key={user.id}>
            <td>
              <Link to={`${process.env.PUBLIC_URL}/users/${user.id}`}>
                {user.name}
              </Link>
            </td>
            <td>
              <Activate
                activate={user.is_active}
                onClick={() => this.handleActivate(user)}
              />
            </td>
            <td>
              <i
                className="fa fa-trash"
                onClick={() => this.handleDelete(user)}
                style={{ color: "red", cursor: "pointer", fontSize: 24 }}
              ></i>
            </td>
          </tr>
        );
      });

    let cards = dashBoardTotal.map((item) => {
      return (
        <div className="item" key={item.label}>
          <div className="card" style={{ marginRight: 10 }}>
            <div className="card-body ecommerce-icons text-center">
              <ShoppingCart />
              <div>
                <span>{item.label}</span>
              </div>
              <h4 className="font-primary mb-0">
                <CountUp className="counter" end={item.value} />
              </h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <Breadcrumb parent="Dashboard" title="Your dashboard" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-7 xl-100">
              <div className="row">
                <div className="col-md-12 ecommerce-slider">
                  <Slider {...settings}>{cards}</Slider>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Total Income</h5>
                  <small className="text-muted">per month per 100 Ksh</small>
                </div>
                <div className="card-body chart-block ecommerce-income">
                  <Line data={commissionData} options={commissionOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Total Sales</h5>
                  <small className="text-muted">per month per 1000 Ksh</small>
                </div>
                <div className="card-body chart-block ecommerce-income">
                  <Line data={totalSalesData} options={totalSalesOptions} />
                </div>
              </div>
            </div>
            <div className="col-xl-8 xl-50">
              <div className="card">
                <div className="card-header">
                  <h5>Latest partners</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive shopping-table text-center">
                    <table className="table table-bordernone">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Status</th>
                          <th scope="col">Delete</th>
                        </tr>
                      </thead>
                      <tbody>{usersData}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SuperAdminDashboard;
