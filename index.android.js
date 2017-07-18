import React, { Component } from "react";
import { AppRegistry, View, Modal, Text, TouchableOpacity } from "react-native";
import Scene01 from "./app/extras/scene-01";
import Scene02 from "./app/extras/scene-02";
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
			<View style={{flex: 1}}>
				<TableOfContents
					sceneVisible={this.state.sceneVisible}
					contents={{
						heading: "Chapters",
						items: [
							{
								heading: "Extras",
								items: [
									{
										heading: "Single Worm",
										onPress: () =>
											this.mountScene(<Scene01 />)
									},
									{
										heading: "Multi-Touch Worms",
										onPress: () =>
											this.mountScene(<Scene02 />)
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

					<CloseButton
						onPress={this.unMountScene}
					/>

				</Modal>
			</View>
		);
	}
}

AppRegistry.registerComponent("NatureOfCodeApp", () => NatureOfCodeApp);
