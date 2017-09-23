import React, {Component, PropTypes} from 'react';

import {Translate, I18n} from 'react-redux-i18n';

import Icon from './Icon.jsx';
import DatePicker from 'react-toolbox/lib/date_picker';

class WollokDatePicker extends Component {

    formatPickedDate = (value) => {
        return I18n.l(value.toISOString(), {dateFormat: "pos.detail.dateOnlyFormat"});
    };

    render() {
        return (
            <span className="date-picker">
                <DatePicker className="pos-date-picker"
                            inputClassName="date-input"
                            theme={this.props.theme}
                            locale={this.props.locale}
                            minDate={this.props.minDate}
                            autoOk
                            cancelLabel={I18n.t("pos.detail.cancel")}
                            inputFormat={this.formatPickedDate}
                            onChange={this.props.onChange}
                            value={this.props.value}
                            sundayFirstDayOfWeek>
                    <Icon className="calendar" name="calendar"/>
                </DatePicker>
            </span>
        );
    }

}

WollokDatePicker.propTypes = {
    theme: PropTypes.object,
    locale: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any
};

export default WollokDatePicker;