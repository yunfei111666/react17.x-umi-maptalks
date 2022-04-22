import { Component } from 'react';
export default class Access extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessKeys: JSON.parse(localStorage.getItem('access')) || [],
            canIUse: false,
        };
    }
    render() {
        const { canIUse } = this.state;
        return canIUse ? this.props.children : null;
    }
    componentDidMount() {
        this.init();
    }
    init() {
        const canIUse = this.state.accessKeys.includes(this.props.accessKey);
        const isSuperUser = localStorage.getItem('isSuperUser');
        this.setState({
            canIUse: canIUse || isSuperUser,
        });
    }
}
