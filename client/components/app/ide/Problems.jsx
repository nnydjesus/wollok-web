import React, {Component, PropTypes} from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class ProblemsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:-1
        };
    }


    componentDidMount(){

    }

    render() {
        var errors = _.flatMap(this.props.project.files, file => file.errors || [] )
        return (
            <div className="problems">
                <p className="description"> {errors.length} Errores</p>
                <ReactTable
                    showPagination={false}
                    showPaginationBottom={false}
                    noDataText="Sin erroes"
                    data={errors}
                    pageSize = {errors.length}
                    minRows = {errors.length} 
                    columns={[
                        {
                            Header: "Descripción",
                            accessor: "message"
                        },
                        {
                            Header: "Archivo",
                            accessor: "file",
                        },
                        {
                            id: 'location',
                            Header: "Ubicación",
                            accessor: d => "Linea " + d.location.start.line,
                        },
                    ]}
                    className="-striped -highlight"
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {
                                this.setState({
                                    selected: rowInfo.index
                                })
                            },
                            onDoubleClick: (e, handleOriginal) => {
                                this.props.onSelectError(rowInfo.original)
                                this.setState({
                                    selected: -1
                                })
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            },
                            style: {
                                background: rowInfo.index === this.state.selected ? 'rgba(0, 0, 0, 0.26)' :undefined,
                            }
                        }
                    }}
                />
            </div>
        );
    }
}

ProblemsComponent.propTypes = {
    project: PropTypes.object,
};

export default ProblemsComponent;
