class TimersDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timers: [],
        };
    }

    componentDidMount() {
        this.loadTimersFromServer();
        setInterval(this.loadTimersFromServer, 5000); // run every 5 seconds
    };

    loadTimersFromServer = () => {
        client.getTimers((serverTimers) => {
            this.setState({timers: serverTimers});
        });
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

    deleteTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter((timer) => {
                return timer.id != timerId;
            })
        });
        client.deleteTimer(
            {
                id: timerId
            }
        );
    };

    startTimer = (timerId) => {
        const now = Date.now();
        this.setState({

            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {runningSince: now});
                } else {
                    return timer;
                }
            })
        });
        client.startTimer(
            {
                id: timerId,
                start: now,
            }
        );
    };

    stopTimer = (timerId) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        elapsed: timer.elapsed + (now - timer.runningSince),
                        runningSince: null,
                    });
                } else {
                    return timer;
                }
            })
        });
        client.stopTimer({
            id: timerId,
            stop: now,
        });
    };

    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
        client.createTimer(timer)
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
        client.updateTimer(attrs);
    };

    handleStartClick = (timerId) => {
        this.startTimer(timerId);
    };

    handleStopClick = (timerId) => {
        this.stopTimer(timerId);
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList 
                        timers = {this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onDeleteClick={this.handleTimerDelete}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
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
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
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
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
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

    componentDidMount() {
        // setInterval() returns a unique ID that can then be used in clearInterval()
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }

    // called before component is removed from the app
    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
    }

    handleTimerDelete = () => {
        this.props.onDeleteClick(this.props.id);
    };

    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
    };

    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
    };

    
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
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
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}

class TimerActionButton extends React.Component {
    render () {
        let return_value = null
        if (this.props.timerIsRunning) {
            return_value = (
                <div
                    className='ui bottom attached red basic button'
                    onClick={this.props.onStopClick}
                >
                 Stop   
                </div>
            );
        } else {
            return_value = (
                <div
                    className='ui bottom attached green basic button'
                    onClick={this.props.onStartClick}
                >
                    Start
                </div>
            );
        }
        return return_value
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
)