class TimersDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timers: [
                {
                    title: 'Timer 1',
                    project: 'Project 1',
                    id: uuid.v4(),
                    elapsed: 5456099,
                    runningSince: Date.now()
                },
                {
                    title: 'Timer 2',
                    project: 'Project 2',
                    id: uuid.v4(),
                    elapsed: 7456099,
                    runningSince: null
                }
            ]
        };
    }

    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    };

    handleTimerDelete = (timer_id) => {
        this.deleteTimer(timer_id);
    };

    deleteTimer = (timer_id) => {
        this.setState({
            timers: this.state.timers.filter((timer) => {
                return timer.id != timer_id;
            })
        });
    }

    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
    };

    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project,
                    });
                } else {
                    return timer;
                }
            }),
        });
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList 
                        timers = {this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onDeleteClick={this.handleTimerDelete}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                        isOpen={true}
                    />
                </div>
            </div>

        );
    }
}

class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map((timer) => (
            <EditableTimer
                id={timer.id}
                key={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                onDeleteClick={this.props.onDeleteClick}
            />
        ));
        return (
            <div id='timers'>
                {timers}
            </div>
        )
    }
}

class EditableTimer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editFormOpen : false, // timer is closed by default
        };

    }

    handleEditClick = () => {
        this.openForm();
    };

    handleFormClose = () => {
        this.closeForm();
    };

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    closeForm = () => {
        this.setState({ editFormOpen: false });
    };

    openForm = () => {
        this.setState({ editFormOpen: true });
    };

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                />
            )
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.props.onDeleteClick}
                />
            )
        }
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    };

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    };

    handleProjectChange = (e) => {
        this.setState({project: e.target.value});
    };

    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                            type='text' 
                            value={this.state.title} 
                            onChange={this.handleTitleChange} 
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                            type='text' 
                            value={this.state.project} 
                            onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button 
                                className='ui basic blue button'
                                onClick={this.handleSubmit} 
                            >
                                {submitText}
                            </button>
                            <button 
                                className='ui basic red button'
                                onClick={this.props.onFormClose} 
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ToggleableTimerForm extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false, // closed by default
        };

        // bind "this" inside handleOpenForm to ToggleableTimerForm component
        this.handleFormOpen = this.handleFormOpen.bind(this);

    }

     handleFormOpen() {
        this.setState({ isOpen: true })
    }

    handleFormClose = () => {
        this.setState({ isOpen: false });
    };

    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);  // NOTE: this call is async and may fail
        this.setState({ isOpen: false });
    };

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm 
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
            <div className='ui basic content center aligned segment'>
                <button 
                    className='ui basic button icon'
                    onClick={this.handleFormOpen}
                >
                    <i className='plus icon' />
                </button>
            </div>
           );
        }
    }
}

class PlusButton extends React.Component {
    render() {
        return (
            <div className='ui basic content center aligned segment'>
                <button className='ui basic button icon'>
                    <i className='plus icon' />
                </button>
            </div>
        );
    }
}

class Timer extends React.Component {

    handleTimerDelete = () => {
        this.props.onDeleteClick(this.props.id);
    };

    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span 
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                        >
                            <i className='edit icon' />
                        </span>
                        <span 
                            className='right floated trash icon'
                            onClick={this.handleTimerDelete}
                        >
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
)