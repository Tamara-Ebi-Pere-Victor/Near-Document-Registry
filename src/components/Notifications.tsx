import React from 'react';
import PropTypes from 'prop-types';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface prop {
  text: string | null | undefined
}

const Notification = () => (
  <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover
  />
);

const NotificationSuccess:React.FC<prop> = ({text}) => (
  <div>
    <i className="bi bi-check-circle-fill text-success mx-2" />
    <span className="text-secondary mx-1">{text}</span>
  </div>
);

const NotificationError:React.FC<prop> = ({ text }) => (
  <div>
    <i className="bi bi-x-circle-fill text-danger mx-2" />
    <span className="text-secondary mx-1 notification">{text}</span>
  </div>
);

const Props = {
  text: PropTypes.string,
};

const DefaultProps = {
  text: '',
};

NotificationSuccess.propTypes = Props;
NotificationSuccess.defaultProps = DefaultProps;

NotificationError.propTypes = Props;
NotificationError.defaultProps = DefaultProps;

export { Notification, NotificationSuccess, NotificationError };
