import React, { Component, PropTypes } from 'react';
import CoinPurseSvg from '../../../resources/svg/coin-purse-1.svg';
import SettingsSvg from '../../../resources/svg/settings-1.svg';
import ColumnsSvg from '../../../resources/svg/content-view-column.svg';
import CalendarSvg from '../../../resources/svg/calendar-1.svg';
import DownloadSvg from '../../../resources/svg/file-download-2.svg';
import CameraSvg from '../../../resources/svg/camera-1.svg';
import SeatsAppSvg from '../../../resources/svg/seats-app.svg';
import HamburguerSvg from '../../../resources/svg/hamburger_2.svg';
import TicketSvg from '../../../resources/svg/leisure-ticket-3.svg';
import QRCodeSvg from '../../../resources/svg/qr-code.svg';
import SmartWatchSvg from '../../../resources/svg/smart-watch-circle-wireless-signal.svg'
import SmartWatchSquareWirelessSvg from '../../../resources/svg/smart-watch-square-wireless-signal.svg'
import SmartWatchSquareSvg from '../../../resources/svg/smart-watch-square.svg'
import PurseSvg from '../../../resources/svg/purse.svg'

class Icon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var svg = Icon.iconSvg(this.props.name);
        if (svg) {
            return <span className={"svg-icon" + (this.props.className ? " " + this.props.className : "") + (this.props.size ? " " + this.props.size : "")}
                         style={{...this.props.style}}
                         onClick={this.props.onClick} title={this.props.title}>
                        {React.createElement(svg, {width: "100%", height: "100%", viewBox: this.props.viewBox || "0 0 24 24"})}
                </span>;
        }
        return (<i className={"material-icons" + (this.props.className ? " " + this.props.className : "") + (this.props.size ? " " + this.props.size : "")}
                   onClick={this.props.onClick} title={this.props.title}>{this.props.name}</i>);
    }
}

Icon.iconSvg = (iconName) => {
    switch (iconName) {
        case "purse":
            return PurseSvg;
        case "settings":
            return SettingsSvg;
        case "columns":
            return ColumnsSvg;
        case "calendar":
            return CalendarSvg;
        case "download":
            return DownloadSvg;
        case "camera":
            return CameraSvg;
        case "seats":
            return SeatsAppSvg;
        case "hamburger":
            return HamburguerSvg;
        case "ticket":
            return TicketSvg;
        case "qr-code":
            return QRCodeSvg;
        case "smart-watch":
            return SmartWatchSvg;
        case "smart-watch-square-wireless":
            return SmartWatchSquareWirelessSvg
        case "smart-watch-square":
            return SmartWatchSquareSvg
        default:
            return undefined;
    }
};

Icon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    viewBox: PropTypes.string,
};

export default Icon;