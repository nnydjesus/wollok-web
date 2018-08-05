import {Component} from 'react';

export default class FileCreator extends Component {
    constructor(props) {
        super(props);
    }

    createObject = () => {
        this.props.showDialog({
        mode: "newFile",
        title:'Crear un nuevo archivo para un Objeto',
        contentName:"Nombre del objeto",
        confirm: (result) => {
                this.props.newFile({ name: result.fileName, type:"object", extension:"wlk"})
            }
        })
    }

    createClass = () => {
        this.props.showDialog({
            mode: "newFile",
            title:'Crear un nuevo archivo para una clase',
            contentName:"Nombre de la clase",
            confirm: (result) => {
                this.props.newFile({ name: result.fileName, type:"class", extension:"wlk"})
            }
        })
    }

    createTest = () => {
        this.props.showDialog({
            mode: "newFile",
            title:'Crear un nuevo archivo para un test',
            contentName:"Nombre de la test",
            confirm: (result) => {
                this.props.newFile({ name: result.fileName, type:"test", extension:"wtest"})
            }
        })
    }

    createProgram = () => {
        this.props.showDialog({
            mode: "newFile",
            title:'Crear un nuevo archivo para un programa',
            contentName:"Nombre del programa",
            confirm: (result) => {
                this.props.newFile({ name: result.fileName, type:"program", extension:"wpgm"})
            }
        })
    }

    newFolder = () =>{
        this.props.showDialog({
            mode: "newFolder",
            title:'Nuevo Carpeta',
            confirm: (result) => this.props.newFolder(result.folderName)
        })
    }
    
}