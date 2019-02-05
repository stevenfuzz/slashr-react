import React from 'react';
import {Slashr} from './Slashr';

export class DialogUiDomain extends Slashr.Domain{
    constructor() {
        super();
		console.log(this);
    }
    dialog(name){

    }
    open(name){

    }
}
class DialogInstanceUiDomain extends Slashr.Domain{
	constructor(slashrUi, idx, props) {
        super();
		this._metadata = {
			ui: slashrUi,
			idx: idx,
			props: {},
			ref: props.forwardRef || React.createRef(),
			eventHandlers: {},
		};
		this.state = {
			isOpen: props.open || false
		};
	}
	delete() {
		this._metadata.ui.deleteDialog(this.idx);
	}
	get isOpen() {
		return this._metadata.state.isOpen;
	}
	set isOpen(isOpen) {
		this.setState({
			isOpen: isOpen
		});
		return this;
	}
	set open(isOpen) {
		this.isOpen = isOpen;
	}
	get open() {
		return this.isOpen;
	}
}

export const Dialog = React.forwardRef((props, ref) => {
	return (
		<_Dialog
			{...props}
			forwardRef={ref}
		>
			{props.children}
		</_Dialog>
	);
});

export const _Dialog = Slashr.connect(
	class _Dialog extends React.Component {
		constructor(props) {
            super(props);
            console.log(props);
			this.handleClose = this.handleClose.bind(this);
			this.dlg = this.props.slashr.ui.createDialog(props);
			this.hasOpened = false;
			this.closeButton = this.props.closeButton || null;

			let classNames = ["dialog"];
			if (this.props.className) classNames.push(this.props.className);
			this.dialogProps = {
				...props,
				onClickOut: this.handleClose,
				classNames: classNames
			};

			let backdropClassNames = ["dialog-backdrop"];
			if (this.props.backdropClassName) backdropClassNames.push(this.props.backdropClassName);
			this.dialogBackdropProps = {
				classNames: backdropClassNames
			};
		}
		handleClose(e) {
			if (!this.close()) return;
			e.preventDefault();
			e.stopPropagation();
		}
		close() {
			if (this.props.shouldClose && this.props.shouldClose() === false) {
				return false;
			}
			this.dlg.open = false;
			return true;
		}
		componentDidUpdate(prevProps, prevState, snapshot) {
			if (this.props.open !== prevProps.open) this.dlg.open = this.props.open;
			if (this.dlg.open) {
				if (!this.hasOpened) {
					this.hasOpened = true;
					this.onOpen();
				}
			}
			else if (this.hasOpened) {
				this.hasOpened = false;
				this.onClose();
			}
		}
		// componentWillReact(){
		// 	console.log("Component Will React");

		// 	if(this.props.open != this.dlg.open) this.dlg.open = this.props.open;
		// }
		componentWillUnmount() {
			this.dlg.delete();
		}
		onClose() {
			if (this.props.onClose) this.props.onClose(this.dlg);
		}
		onOpen() {
			if (this.props.onOpen) this.props.onOpen(this.dlg);
		}
		render() {
			let closeButton = null;
			if (this.closeButton) {
				closeButton = React.cloneElement(this.closeButton, {
					onClick: this.handleClose
				});
			}
			let titleBar = (this.props.title) ? <h2>{this.props.title}</h2> : null;
			return (
				<BodyPortal>
					<Container
						hide
						unmountOnHide
						fadeToggle={this.dlg.isOpen}
						{...this.dialogBackdropProps}
					>
						<Container
							className="dialog-close-button"
						>
							{closeButton}
						</Container>

						<Container
							{...this.dialogProps}
							ref={this.props.forwardRef}
						>	{titleBar}
							{this.props.component || this.props.children}
						</Container>
					</Container>
				</BodyPortal>
			);
		}
	}
);
export const DialogButtons = React.forwardRef((props, ref) => (
	<Element
		{...props}
		className={props.className || "dialog-buttons"}
		ref={ref}
	>
		{props.children}
	</Element>
));

export const RouteDialog = Slashr.connect(
	class RouteDialog extends React.Component {
		constructor(props) {
			super(props);
			this.handleClose = this.handleClose.bind(this);
			this.handleOpen = this.handleOpen.bind(this);
			//this.handleClickClose = this.handleClickClose.bind(this);
			this.name = this.props.name || "dialog";
			this.location = this.props.location;
			this.slashr = this.props.slashr;
			this.routeProps = this.slashr.router.create(this.name, this.props);
			//throw("SLKDJF");
			// if(this.dialog){
			// 	this.props.app.mdl.ui.dialog.open(this.dialog,{
			// 		component: this.props.component,
			// 		props: {
			// 			location: this.props.location,
			// 			match: this.props.match
			// 		}
			// 	});
			// }
		}
		get isOpen() {
			return this.slashr.router.hasRoute(this.name);
		}
		get shouldOpen() {
			return (!this.isOpen && !this.shouldClose);
		}
		get shouldClose() {
			return (!this.props.isDialogRoute);
		}
		get isDialogRoute() {
			return (this.props.location.state
				&& this.props.location.state.dialog
				&& (!this.location || this.props.location.pathname !== this.location.pathname)) ? true : false;
		}
		close() {
			//this.props.app.mdl.ui.dialog.close("route");
		}
		open() {
			//this.props.app.mdl.ui.dialog.open("route");
		}
		handleUpdate() {
			if (this.shouldClose) this.close();
			else if (this.shouldOpen) this.open();
			if (!this.shouldClose) this.location = this.props.location;
		}
		componentDidMount() {
			this.handleUpdate();
		}
		componentDidUpdate() {
			this.handleUpdate();
		}
		// handleClickClose(){
		// 	throw("SLKDJF");
		// 	this.handleClose();
		// }
		handleOpen() {
			if (this.props.onOpen) this.props.onOpen();
			// if(this.location.pathname === this.props.location.pathname){
			// 	this.props.history.go(-1);
			// }
			// if(postRoute ===  this.props.location.pathname){
			// 
			// }
			// if(this.isOpen) this.close();
		}
		handleClose() {
			// console.log("route dialog on close",this.props.onClose);
			if (this.props.onClose) this.props.onClose();

			//TODO: Allow for multiple layers
			//TODO: Refactor this
		
			if (this.slashr.router.hasRoute(this.name)){
				let routerPortal = this.slashr.router.portal("default");
				this.slashr.router.reset(this.name);
				let pushState = this.slashr.router.createState({
					portal: "default"
				});
				this.slashr.router.history.push({
					pathname: routerPortal.location.pathname,
					state:pushState,
					search: routerPortal.location.search || ""
				});
			}
			//this.slashr.app.router.push(routerPortal.location.pathname + (routerPortal.location.search || ""));
		}
		componentWillReact() {
			// console.log("Route dialog react!!!",this.props);
		}
		componentWillUnmount() {
			if (this.isOpen) this.close();
		}
		render() {
			let uid = this.props.slashr.router.portal(this.name).isInitialized;
			let routeDialogComponents = null;
			if (!this.shouldClose) {
				// routeDialogComponents = this.routePropss.map(({path, key, component, dialog, reload}) => {
				// 	if(dialog){

				// 		// Set key?
				// 		return <Route exact path={path} key={key || path} render={(props)=>{
				// 			let Component = component;
				// 			return <Component 
				// 					isDialog 
				// 					{...props}
				// 				/>;
				// 		}}/>
				// 	}
				// 	return null;
				// });
			}
			return (

				<Dialog
					className="dialog-portal"
					backdropClassName="dialog-backdrop-portal"
					open={this.isOpen}
					onOpen={this.handleOpen}
					onClose={this.handleClose}
					closeButton={this.props.closeButton || null}
				// {...this.props}
				>
					{this.props.titleBar || null}
					<RouterPortal
						modal
						name={this.name}
					/>
					{/* <Container className="dialog-portal-header">
						<IconButton icon="arrowBack" onClick={this.handleClickClose}>
							<Image src={headerImage} />
						</IconButton>
					</Container>
					<Switch location={this.props.location}>
						{routeDialogComponents}
					</Switch> */}
					{/* <ProgressIndicator name="routeDialog" /> */}
				</Dialog>
			);
		}
	}
);