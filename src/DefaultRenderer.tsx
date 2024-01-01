import React from "react";
import type { ScaledSize } from 'react-native';

export default function DefaultRenderer(entities: any, screen: any, layout: ScaledSize) {
	if (!entities || !screen || !layout) return null;

	return Object.keys(entities)
		.filter(key => entities[key].renderer)
		.map(key => {
			let entity = entities[key];
			if (typeof entity.renderer === "object")
				return (
					<entity.renderer.type
						key={key}
						screen={screen}
						layout={layout}
						{...entity}
					/>
				);
			else if (typeof entity.renderer === "function")
				return (
					<entity.renderer
						key={key}
						screen={screen}
						layout={layout}
						{...entity}
					/>
				);
		});
};
