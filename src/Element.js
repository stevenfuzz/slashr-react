
import React from 'react';
import {Slashr} from './Slashr';
import { toJS, decorate, observable, trace, action } from "mobx";
import { inject, observer } from "mobx-react";
import {SlashrUiElement} from './core/SlashrUiElement';
import {RouteLink} from './Router';
export const _Element = inject("app")(observer(
	class _Element extends React.Component {
		constructor(props) {
			super(props);
			this._metadata = {
				elmt: null,
				isMounted: false,
				isRendered: false,
				hasRendered: false,
			}
			this.hasReacted = false;
			// Only create element if it has required props
		
			if (SlashrUiElement.shouldElementInit(props)) {
				this._metadata.elmt = this.props.app._slashr.ui.createElement(props);
			}
		}
		componentDidMount() {
			if (this.elmt && this.elmt.shouldRender) {
				this.elmt.handleMount(this.props);
				this.updateRender();
			}
		}
		updateRender() {
			if (this.elmt && this.elmt.shouldRender) {
				if (!this._metadata.hasRendered && this._metadata.isRendered) {
					if (this.props.scrollToTop) setTimeout(() => {
						Slashr.utils.dom.scrollTop();
					}, 100);
					this._metadata.hasRendered = true;
				}
				if (this._metadata.isRendered && this.props.scrollTop && !isNaN(this.props.scrollTop)) {
					Slashr.utils.dom.scrollTop(this.props.scrollTop);
				}
			}
		}

		// shouldComponentUpdate(nextProps, nextState) {
		// 	return (this.elmt) ? true : false;
		// 	// console.log("element should update",this.elmt.idx, this.elmt.ref.current, nextProps.children);
		// 	// return SlashrUiElement.shouldComponentUpdate(this.props, nextProps);
		// }
		componentDidUpdate(prevProps, prevState, snapshot) {
			let hasReacted = this.hasReacted;
			this.hasReacted = false;
			//if(this.elmt && ! hasReacted) this.elmt.handleReact(this.props);
			if (this.elmt && this.elmt.shouldRender) {
				this.updateRender();

				//console.log("element componentDidUpdate",this.elmt.className);
				let update = SlashrUiElement.reducePropUpdates(prevProps, this.props);

				// if(update){
				// 	if( ! hasReacted) console.warn("Prop update has taken place without a reaction.",this.elmt.idx,this.props,this.elmt.idx,update);
				// 	else console.warn("Prop update reacted.",this.elmt.idx,this.props,this.elmt.idx,update);
				// }

				// TODO: this should probably be moved
				// this.elmt._triggerAnimationEvents();
				if (update === false) return false;

				this.elmt.handleUpdate(update);
			}
			// hasReacted track whether the state needs to be updated.
			
			// console.log("element component update");
			// // if(! this.elmt){
			// // 	if(! SlashrUiElement.shouldElementInit(this.props)) return;

			// // 	this._metadata.elmt = this.props.slashr.ui.createElement(this.props);

			// // 	console.log("element CREATING ELEMENT!!!!!!!!!!!",this.props, this);
			// // 	//this.elmt.handleMount(this.props);
		// // 	return;
			// // }
			// let update = SlashrUiElement.reducePropUpdates(prevProps, this.props);
			// console.log(update);

			// if (update === false) return false;
			// // console.log("element IS UPDATING",this.elmt, this.elmt.idx, update);
			// this.elmt.update(update);
		}
		componentWillUnmount() {
			this.unmount();
		}
		componentWillReact() {
			this.hasReacted = true;
			
			if (this.elmt) {
				this.elmt.handleReact(this.props);
			}
		}
		get elmt() {
			return this._metadata.elmt;
		}
		unmount() {
			if (this.elmt) {
				this.elmt.unmount();
			}
		}
		render() {
			// if("transition" in this.props)
			// console.log(this.props);
			// Moved from component will react
			// trace();
			// if (this.elmt) {
			// 	console.log("render element", this.props);
			// 	this.elmt.handleReact(this.props);
			// }
			//this.elmt.update();
			// Check if the elment has unmountOnHide
			// if(this.rendered){
			// 	this.elmt.update();
			// }
			// else{
			// 	throw("SLDKFJLSDKJFFH");
			// }

			// if(this.elmt && this.isMounted){
			// 	this.elmt.update(this.props);
			// }
			// this.mounted = true;

			// Show or hide the element
			// let doRender = true;
			//this.mounted = true;
			// if (this.elmt && this.elmt.unmountOnHide){
			// 	// If it's hidden, mark unmounts
			// 	if(this.elmt.isHidden){
			// 		//console.log("element UNMNOUNTED",this.elmt.className);
			// 		doRender = false;
			// 		this.mounted = false;
			// 	}
			// 	// else if(! this.isMounted){
			// 	// 	this.elmt.rendered = true;
			// 	// 	console.log("element trigger update",this.elmt.className);
			// 	// }
			// }
			//this.rendered = true;
			//TODO: Check why REF is broken, and needs to get used on render?
			
			let props = {
				//ref: (this.elmt) ? (this.props.forwardRef || this.elmt.ref) : this.props.forwardRef,
				forwardRef: (this.elmt) ? (this.props.forwardRef || this.elmt.ref) : this.props.forwardRef,
				style: (this.elmt) ? this.elmt.reactStyle : this.props.style,
				type: (this.elmt) ? this.elmt.type : this.props.type,
				src: (this.elmt) ? this.elmt.src : this.props.src,
				alt: (this.elmt) ? this.elmt.alt : this.props.alt,
				to: (this.elmt) ? this.elmt.to : this.props.to,
				tag: (this.elmt) ? this.elmt.tag : this.props.tag,
				name: (this.elmt) ? this.elmt.name : this.props.name,
				id: (this.elmt) ? this.elmt.id : this.props.id,
				elmt: this.elmt || null,
				shouldRender: (this.elmt) ? this.elmt.shouldRender : true
			};

			if(this.elmt){
				let className = this.elmt._stateProps.className;
			}

			let className = (this.elmt) ? this.elmt.className : this.props.className;
			let classNames = (this.elmt) ? this.elmt.classNames : this.props.classNames;
			if (classNames && classNames.length > 0) {
				if (className && classNames.indexOf(className) === -1) classNames.push(className);
				className = classNames.join(" ");
			}
			props.className = className;

			// Add event handlers
			if (this.elmt && !this.elmt.shouldRender) {
				this._metadata.isRendered = false;
				this.elmt.unmount();
			}

			this._metadata.isRendered = true;

			//console.log("Element Rendered",(this.elmt) ? "Controlled":"Pure", props.className, props.forwardRef);
			// let _ChildElement = React.forwardRef((props, ref) => (
			// 	<__Element 
			// 		{...props}
			// 		forwardRef={ref}
			// 	>
			// 		{this.props.children}
			// 	</__Element>
			// ));
			// return(
			// 	<_ChildElement ref={props.forwardRef}/>
			// );
			return (
				<__Element {...props}>
					{this.props.children}
				</__Element>
			);

		}
	}
));
class __Element extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	// componentDidMount(){
	// 	if(this.props.forwardRef) console.log("element ref mount",this.props.className,this.props.forwardRef.current);
	// }
	render() {
		let doRender = true;
		if (this.props.elmt && !this.props.shouldRender) {
			return null;
		}
		let to = this.props.to || null;
		let tag = this.props.tag || "div";
		let props = {
			ref: this.props.forwardRef || null,
			className: this.props.className || null,
			style: this.props.style || null,
			type: this.props.type || null,
			src: this.props.src || null,
			alt: this.props.alt || null,
			name: this.props.name || null,
			id: this.props.id || null
		};

		if (this.props.elmt) {
			props = { ...props, ...this.props.elmt.eventHandlers };
			props.key = "ele"+this.props.elmt.idx;
		}

		//if(this.props.forwardRef) console.log("element ref mount",this.props.className,this.props.forwardRef.current);
		let el = React.createElement(tag, props, this.props.children);
		if (to) el = <RouteLink to={to}>{el}</RouteLink>;
		return el;
	}
}

export const Element = React.forwardRef((props, ref) => {
	return (
		<_Element
			{...props}
			forwardRef={ref}
		>
			{props.children}
		</_Element>
	);
});
export const Text = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag={props.tag || "span"}
	>
		{props.children}
	</Element>
));
export const Container = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
	>
		{props.children}
	</Element>
));
export const Paragraph = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="p"
	>
		{props.children}
	</Element>
));
export const Section = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="section"
	>
		{props.children}
	</Element>
));
export const Image = React.forwardRef((props, ref) => {
	if (props.backgroundUrl) {
		let style = props.style || {};
		style.backgroundImage = `url('${props.backgroundUrl}')`;
		return (
			<Element
				role="img"
				{...props}
				style={style}
				ref={ref}
				tag="span"
			>
				&nbsp;
			</Element>
		);
	}
	else {
		return (
			<Element
				{...props}
				ref={ref}
				tag="img"
			/>
		);
	}

});
export const Navigation = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="nav"
	>
		{props.children}
	</Element>
));


export const H1 = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="h1"
	>
		{props.children}
	</Element>
));
export const H2 = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="h2"
	>
		{props.children}
	</Element>
));

export const H3 = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="h3"
	>
		{props.children}
	</Element>
));

export const H4 = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="h4"
	>
		{props.children}
	</Element>
));
export const H5 = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="h5"
	>
		{props.children}
	</Element>
));
export const Ul = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="ul"
	>
		{props.children}
	</Element>
));
export const Li = React.forwardRef((props, ref) => (
	<Element
		{...props}
		ref={ref}
		tag="Li"
	>
		{props.children}
	</Element>
));

export const Layout = Slashr.connect(
	class Layout extends React.Component {
		constructor(props) {
			super(props);
			this.ref = React.createRef();
		}
		render() {
			let theme = this.props.app.mdl.ui.layout.theme;
			let classNames = ["layout"];
			let style = this.props.style || {};
			if(! this.props.app.mdl.ui.layout.isScrollable){
				classNames.push("layout-scroll-disabled");
				style.height = "100vh";
                style.overflow = "hidden";
                style.position = "fixed";
			}
			if(theme) classNames.push(`layout-theme-${theme}`)
			return (
				<Container
					{...this.props}
					classNames = {classNames}
					style={style}
				>
					{this.props.children}
				</Container>
			);
		}
	}
);

export const Header = Slashr.connect(
	class Header extends React.Component {
		constructor(props) {
			super(props);
			this.ref = React.createRef();
			this.hasAutoHidden = false;
			this.lastScrollY = null;
			this.lastScrollDiffY = 0;
			this.lastScrollYDir = "down";
			this.doRollUp = false;
			this.isSticky = true;
			this.handleAutoHide = this.handleAutoHide.bind(this);
			this.state = {
				shouldAutohide: false,
				height: 0,
				isTop: true
			};
		}
		handleAutoHide(){
			this.update();
			
		}
		get animate(){
			let animate = this.hasAutoHidden ? {
				easing: "easeOutQuad",
				duration: 200,
				from: {
					transform:{
						translateY: `-${this.state.height}px`
					}
				},
				to: {
					transform:{
						translateY:"0px"
					}
				}
			} : false;
			// let animate = null;

			if (this.state.shouldAutohide) {
				this.hasAutoHidden = true;
				animate = {
					easing: "easeOutQuad",
					duration: 200,
					from: {
						transform: {
							translateY: "0px"
						}
					},
					to: {
						transform: {
							translateY: `-${this.state.height}px`
						}
					}
				};
			}
			return animate;
		}
		update(){
			let scrollY = window.scrollY;
			let shouldAutohide = this.state.shouldAutohide;
			let height = this.ref.current.clientHeight;
			let scrollYDir = "down";
			let threshold = 120;
			if(! this.props.app.mdl.ui.layout.isScrollable){
				shouldAutohide = true;
			}
			else if (this.lastScrollY === null || scrollY < height) {
				shouldAutohide = false;
			}
			else {
				scrollYDir = (scrollY - this.lastScrollY) < 0 ? "up" : "down";
				let scrollYDiff = scrollY - this.lastScrollY;
				if (scrollYDir !== this.lastScrollYDir) {
					this.lastScrollDiffY = scrollY - this.lastScrollY;
				}
				else this.lastScrollDiffY = this.lastScrollDiffY + scrollYDiff;
				if (this.lastScrollDiffY > threshold) {
					shouldAutohide = true;
				}
				else if (this.lastScrollDiffY < 0 && this.lastScrollDiffY < (threshold * -1)) {
					shouldAutohide = false;
				}
			}
			let isTop = (scrollY === 0 && this.lastScrollY !== scrollY);

			this.lastScrollY = scrollY;
			this.lastScrollYDir = scrollYDir;

			if(this.state.isTop !== isTop || this.state.height !== height || this.state.shouldAutohide !== shouldAutohide){
				this.setState({
					height: height,
					shouldAutohide: shouldAutohide,
					isTop: isTop
				});
			}
		}
		componentDidMount(){

		}
		render() {
			let animate = this.animate;
			let classNames = ["header"];
			let style = this.props.style || {};
			if(window.scrollY === 0){
				classNames.push("header-top");
			}
			if(this.state.shouldAutohide) classNames.push("header-autohide");
			return (
				<Element
					{...this.props}
					classNames = {classNames}
					style={style}
					tag="header"
					ref={this.ref}
					// animate={this.props.autohide && animate}
					onObserveResize={this.props.autohide && this.handleAutoHide}
					onWindowScroll={this.props.autohide && this.handleAutoHide}
				>
					{this.props.children}
				</Element>
			);
		}
	}
);
// value: function() {
// 	var e = this.props.app.mdl.ui.layout.isScrollable
// 	  , t = this.props.style || {}
// 	  , n = this.props.classNames || [];
// 	return n.push("main"),
// 	e || (n.push("main-scroll-disabled"),
// 	t.position = "relative",
// 	t.marginTop = "-" + window.scrollY + "px"),
// 	console.log(t),
// 	s.a.createElement(Hh, Zs({}, this.props, {
// 		style: t,
// 		classNames: n,
// 		tag: "div"
// 	}), this.props.children)
export const Main = Slashr.connect(
	class Main extends React.Component {
		constructor(props) {
			super(props);
			// this.ref = React.createRef();
		}
		render() {
			let theme = this.props.app.mdl.ui.layout.theme;
			let classNames = ["main"];

			let style = this.props.style || {};
			let windowScrollY = window.scrollY;
			if(! this.props.app.mdl.ui.layout.isScrollable){
				classNames.push("main-scroll-disabled");
				style.height = "100vh";
                style.marginTop = `-${windowScrollY}px`;
                style.position = "relative";
			}
			return (
				<main
					{...this.props}
					className = {classNames.join(" ")}
					style={style}
				>
					{this.props.children}
				</main>
			);
		}
	}
);

// export class Layout extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.slashr = Slashr.getInstance();
// 		this.handleClick = this.handleClick.bind(this);
// 		this.routeProps = this.slashr.router.parseLinkProps(this.props);
// 		if (!this.props.to) throw ("ContainerLink error: 'to' prop missing");
// 	}
// 	handleClick(e) {
// 		if (e.target.tagName !== "A") {
// 			this.slashr.app.router.push(this.routeProps);
// 		}
// 	}
// 	render() {
// 		return (
// 			<div className={this.props.className} onClick={this.handleClick}>
// 				{this.props.children}
// 			</div>
// 		);
// 	}
// };

export class ContainerLink extends React.Component {
	constructor(props) {
		super(props);
		this.slashr = Slashr.getInstance();
		this.handleClick = this.handleClick.bind(this);
		this.routeProps = this.slashr.router.parseLinkProps(this.props);
		if (!this.props.to) throw ("ContainerLink error: 'to' prop missing");
	}
	handleClick(e) {
		if (e.target.tagName !== "A") {
			this.slashr.app.router.push(this.routeProps);
		}
	}
	render() {
		return (
			<div className={this.props.className} onClick={this.handleClick}>
				{this.props.children}
			</div>
		);
	}
};

export class SocialText extends React.Component {
	constructor(props) {
		super(props);
		if (!this.props.tagRenderer) throw ("Social Text Error: tagRenderer required.");
	}
	renderText() {
		const reactStringReplace = require('react-string-replace');
		let text = this.props.value;
		if (!text) return text;
		if (text.indexOf("@[") === -1) return text;
		let regex = /@\[([a-z\d_]+):([a-z\d_ ]+):([a-z\d_-]+)\]/ig;
		// text = reactStringReplace(text, regex, (match, i) => {
		// 	console.log("mention",match,i);
		// });
		let tags = text.match(regex);
		if (!tags || !tags.length) return text;
		let mentions = [];
		if (tags && tags.length) {
			tags.forEach((val) => {
				let idx = 0;
				let tagInfo = val.match(/@\[([a-z\d_]+):([a-z\d_ ]+):([a-z\d_-]+)\]/i);
				if (tagInfo.length < 4) return;
				let tag = {
					match: tagInfo[0],
					type: tagInfo[1],
					label: tagInfo[2],
					value: tagInfo[3]
				};
				// console.log("RENDER TAG match",tag.label, i);
				text = reactStringReplace(text, tag.match, () => {
					return this.props.tagRenderer(tag.type, tag.value, tag.label, ++idx);
				});
			});
		}
		return text;
	}
	render() {
		return this.renderText();
	}
}

export const Toolbar = React.forwardRef((props, ref) => (
	<Element
		{...props}
		className={props.className || "toolbar"}
		ref={ref}
	>
		{props.children}
	</Element>
));
// export const Button = React.forwardRef((props, ref) => (
// 	<Element
// 		{...props}
// 		tag={props.tag || "button"}
// 		type={props.type || "button"}
// 		ref={ref}
// 	>
// 		{props.children}
// 	</Element>
// ));
