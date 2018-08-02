import { Observable, Subject, empty, of, merge } from "rxjs";
import {
	mergeMap,
	first,
	timeoutWith,
	delay,
	takeUntil,
	map,
	groupBy,
	filter,
	pairwise
} from "rxjs/operators";

export default ({
	triggerPressEventBefore = 200,
	triggerLongPressEventAfter = 700
}) => {
	return touches => {
		let touchStart = new Subject().pipe(
			map(e => ({ id: e.identifier, type: "start", event: e }))
		);
		let touchMove = new Subject().pipe(
			map(e => ({ id: e.identifier, type: "move", event: e }))
		);
		let touchEnd = new Subject().pipe(
			map(e => ({ id: e.identifier, type: "end", event: e }))
		);

		let touchPress = touchStart.pipe(
			mergeMap(e =>
				touchEnd.pipe(
					first(x => x.id === e.id),
					timeoutWith(triggerPressEventBefore, empty())
				)
			),
			map(e => ({ ...e, type: "press" }))
		);

		let longTouch = touchStart.pipe(
			mergeMap(e =>
				of(e).pipe(
					delay(triggerLongPressEventAfter),
					takeUntil(
						merge(touchMove, touchEnd).pipe(
							first(x => x.id === e.id)
						)
					)
				)
			),
			map(e => ({ ...e, type: "long-press" }))
		);

		let touchMoveDelta = merge(touchStart, touchMove, touchEnd).pipe(
			groupBy(e => e.id),
			mergeMap(group =>
				group.pipe(
					pairwise(),
					map(([e1, e2]) => {
						if (e1.type !== "end" && e2.type === "move") {
							return {
								id: group.key,
								type: "move",
								event: e2,
								delta: {
									locationX: e2.locationX - e1.locationX,
									locationY: e2.locationY - e1.locationY,
									pageX: e2.pageX - e1.pageX,
									pageY: e2.pageY - e1.pageY,
									timestamp: e2.timestamp - e1.timestamp
								}
							};
						}
					}),
					filter(x => x)
				)
			)
		);

		let subscriptions = [
			touchStart,
			touchEnd,
			touchPress,
			longTouch,
			touchMoveDelta
		].map(x => x.subscribe(y => touches.push(y)));

		return {
			process(type, event) {
				switch (type) {
					case "start":
						touchStart.next(event);
						break;
					case "move":
						touchMove.next(event);
						break;
					case "end":
						touchEnd.next(event);
						break;
				}
			},
			end() {
				touchStart.unsubscribe();
				touchMove.unsubscribe();
				touchEnd.unsubscribe();
				touchPress.unsubscribe();
				longTouch.unsubscribe();
				subscriptions.forEach(x => x.unsubscribe());
			}
		};
	};
};
