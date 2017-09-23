import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import IconButton from 'react-toolbox/lib/button';
import Checkbox from 'react-toolbox/lib/checkbox';
import { Translate, I18n } from 'react-redux-i18n';

class ColumnDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allColumns: props.allColumns,
            active: props.active,
            columns: props.columns,
            errorMessage: ""
        };
    }

    hideDialog = () => {
        this.setState({active: false});
    };

    changeColumnState = (id) => {
        this.state.allColumns.forEach(column => {
            if (column.id === id) {
                column.active = !column.active;
            }
        });
        this.updateColumns();
    };

    updateColumns = () => {
        var newColumns = this.state.allColumns.map(column => {
            if (column.active) {
                return column.id;
            }
            return null;
        }).filter(item => {return item !== null});
        this.setState({columns: newColumns});
    };

    componentWillReceiveProps(newProps) {
        this.actions.map(action => {
            if (action.labelKey) {
                action.label = I18n.t(action.labelKey);
                delete action.labelKey;
            }
        });
        var newState = {};
        if (this.state.active !== newProps.active) {
            newState.active = newProps.active;
        }
        if (this.state.columns !== newProps.columns) {
            newState.columns = newProps.columns;
        }
        this.setState(newState);
    }

    updateAndClose = (ev) => {
        if (this.state.columns.length === 0) {
            this.setState({errorMessage: I18n.t("app.generic.columnDialog.atLeastOneColumn")});
            if (ev) {
                ev.preventDefault();
            }
        } else {
            this.setState({errorMessage: ""});
            this.props.callback(this.state.columns);
            this.hideDialog();
        }
    };

    actions = [
        { labelKey: "app.generic.columnDialog.saveButton", onClick: this.updateAndClose }
    ];

    render() {
        return (
            <Dialog theme={this.props.theme} className={this.props.componentName + "-column-dialog"} title={I18n.t("app.generic.columnDialog.title")} actions={this.actions} active={this.state.active}
                    onEscKeyDown={this.hideDialog} onOverlayClick={this.hideDialog}>
                <IconButton theme={this.props.theme} className="dialog-close-button" icon="close" onClick={this.hideDialog} />
                <div className="checkbox-list">
                    { this.state.allColumns.map(column => {
                        column.active = (this.state.columns.indexOf(column.id) !== -1);
                        return (<Checkbox key={column.id}
                                          theme={this.props.theme}
                                          checked={column.active}
                                          label={<Translate value={this.props.componentName + ".list.columns." + column.id} />}
                                          onChange={() => {this.changeColumnState(column.id)}} />)
                    }) }
                </div>
                {this.state.errorMessage !== "" && <div className="column-dialog-error">{this.state.errorMessage}</div>}
            </Dialog>
        )
    }
}

ColumnDialog.propTypes = {
    theme: PropTypes.object,
    componentName: PropTypes.string,
    active: PropTypes.bool,
    allColumns: PropTypes.array,
    columns: PropTypes.array,
    callback: PropTypes.func
};

export default ColumnDialog;