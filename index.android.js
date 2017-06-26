import React, { Component } from "react";
import { AppRegistry } from "react-native";
import Scene01 from "./components/extras/scene-01";
import Scene02 from "./components/extras/scene-02";
import TableOfContents from "./components/table-of-contents";

export default class NatureOfCodeApp extends Component {
	render() {
		return (
			<TableOfContents
				contents={{
					heading: "Chapters",
					items: [
						{
							heading: "01. Introduction",
							summary: "This is a summary about the book",
							items: [
								{
									heading: "1.1 Basic Mover",
									scene: 0
								},
								{
									heading: "1.2 Advanced Mover",
									scene: 1
								}
							]
						},
						{
							heading: "02. Motion",
							summary: "This is a summary about motion",
							items: [
								{
									heading: "2.1 Basic Motion",
									scene: 2
								},
								{
									heading: "2.2 Advanced Motion",
									scene: 3
								}
							]
						}
					]
				}}
			/>
		);
	}
}

AppRegistry.registerComponent("NatureOfCodeApp", () => NatureOfCodeApp);
