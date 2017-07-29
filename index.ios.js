import React, { Component } from "react";
import { AppRegistry, View, Modal, Text, TouchableOpacity } from "react-native";
import SingleTouch from "./app/touch-events/single-touch";
import MultiTouch from "./app/touch-events/multi-touch";
import RigidBodies from "./app/physics/rigid-bodies";
import TableOfContents from "./app/table-of-contents";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

EStyleSheet.build();

export default class NatureOfCodeApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sceneVisible: false,
			scene: null
		};
	}

	mountScene = scene => {
		this.setState({
			sceneVisible: true,
			scene: scene
		});
	};

	unMountScene = () => {
		this.setState({
			sceneVisible: false,
			scene: null
		});
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<TableOfContents
					sceneVisible={this.state.sceneVisible}
					contents={{
						heading: "Chapters",
						items: [
							{
								heading: "Touch Events",
								items: [
									{
										heading: "Single Touch",
										onPress: () =>
											this.mountScene(<SingleTouch />)
									},
									{
										heading: "Multi Touch",
										onPress: () =>
											this.mountScene(<MultiTouch />)
									}
								]
							},
							{
								heading: "Physics",
								items: [
									{
										heading: "Rigid Bodies",
										onPress: () =>
											this.mountScene(<RigidBodies />)
									}
								]
							}
						]
					}}
				/>
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.sceneVisible}
					onRequestClose={_ => {}}
				>

					{this.state.scene}

					<CloseButton onPress={this.unMountScene} />

				</Modal>
			</View>
		);
	}
}

AppRegistry.registerComponent("NatureOfCodeApp", () => NatureOfCodeApp);
